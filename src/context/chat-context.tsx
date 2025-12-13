import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Chat,
  EnterpriseChatbotModelInfo,
  EnterpriseChatRequest,
  EnterpriseChatResponse,
} from "@/types";
import {
  getEnterpriseChatbotModels,
  enterpriseChat,
  getChatList,
  getChatMessages,
  createOrReplaceChat,
} from "@/services/endpoints";

export interface ChatMessage {
  content: string;
  role: "user" | "system" | "assistant";
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  model: EnterpriseChatbotModelInfo | null;
  modelList: EnterpriseChatbotModelInfo[];
  setModel: (model: EnterpriseChatbotModelInfo) => void;
  sendChat: (content: string) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
  chatList: Chat[];
  fetchChatHistory: () => Promise<void>;
  loadChatMessages: (chatId: string) => Promise<void>;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
  chatStarted: boolean | null;
  setChatStarted: (val: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [model, setModel] = useState<EnterpriseChatbotModelInfo | null>(null);
  const [modelList, setModelList] = useState<EnterpriseChatbotModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const getUserEmail = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.email || null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    getEnterpriseChatbotModels()
      .then((res) => {
        const models = res.text || [];
        setModelList(models);
        if (models.length > 0 && !model) setModel(models[0]);
      })
      .catch((err) => console.error("Failed to fetch models:", err));
  }, []);

  const fetchChatHistory = async () => {
    const email = getUserEmail();
    try {
      const res = await getChatList({ userid: email });
      setChatList(res || []);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const loadChatMessages = async (chatId: string) => {
    const email = getUserEmail();
    setIsLoading(true);
    try {
      const res = await getChatMessages({ userid: email }, chatId);
      setMessages(res.messages || []);
      setSelectedChatId(chatId);
    } catch (err) {
      console.error("Failed to load chat messages:", err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedChatId(null);
  };

  const sendChat = async (content: string) => {
    const email = getUserEmail();
    if (!email) return;
    if (!model) {
      addMessage({
        role: "assistant",
        content: "Please select a model before sending a message.",
      });
      return;
    }

    const userMessage: ChatMessage = { role: "user", content };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    const region = model.arn.split(":")[3];
    const payload: EnterpriseChatRequest = {
      model: model.arn,
      region: region || "us-east-1",
      messages: [...messages, userMessage],
    };
    let chatId = selectedChatId;
    let isNewChat = false;

    if (!chatId) {
      chatId = crypto.randomUUID();
      setSelectedChatId(chatId);
      isNewChat = true;
    }

    try {
      const response: EnterpriseChatResponse = await enterpriseChat(payload);
      const outputText =
        (response as any)?.response ?? "No response received from model.";
      const updatedMessages: ChatMessage[] = [
        ...currentMessages,
        { role: "assistant", content: outputText },
      ];
      setMessages(updatedMessages);

      await createOrReplaceChat({ userid: email }, chatId, updatedMessages);
      if (isNewChat) await fetchChatHistory();
    } catch (err) {
      console.error("Chat API failed:", err);
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        model,
        modelList,
        setModel,
        sendChat,
        clearChat,
        isLoading,
        chatList,
        fetchChatHistory,
        loadChatMessages,
        selectedChatId,
        setSelectedChatId,
        chatStarted,
        setChatStarted,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
