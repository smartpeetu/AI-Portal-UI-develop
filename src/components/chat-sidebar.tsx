import { ChatSidebar, ChatSidebarContent } from "@/components/ui/chat-sidebar";
import { ChatHistory } from "./chat-history";
import { ModelSelector } from "@/components/chatbot/ModelSelector";
import { useChat } from "@/context/chat-context";
import { AgentSelector } from "@/components/chatbot/AgentSelector";

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof ChatSidebar>) {
  const { modelList } = useChat();
  return (
    <ChatSidebar
      side="left"
      className="border-r-0 bg-white shadow-md"
      {...props}
    >
      <ChatSidebarContent className="flex flex-col space-y-4 p-4">
        <ModelSelector models={modelList} />
        <AgentSelector />
        <ChatHistory />
      </ChatSidebarContent>
    </ChatSidebar>
  );
}
 