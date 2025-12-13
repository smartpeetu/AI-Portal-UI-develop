import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useChat } from "@/context/chat-context";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const TypingIndicator = () => (
  <div className="flex flex-col items-start">
    <div className="bg-primary-100 max-w-[75%] rounded-lg px-4 py-3 text-black">
      <Icon icon="svg-spinners:3-dots-fade" className="h-5 w-5 text-gray-600" />
    </div>
  </div>
);

export default function ChatMessages() {
  const { messages, isLoading, selectedChatId, loadChatMessages } = useChat();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Reload when chatId changes
  useEffect(() => {
    if (selectedChatId) loadChatMessages(selectedChatId);
  }, [selectedChatId]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="w-full flex-1 overflow-y-auto px-6 py-6" ref={scrollRef}>
      <div className="mx-auto flex max-w-7xl flex-col space-y-6">
        {messages.map((message, idx) => {
          const isUser = message.role === "user";
          return (
            <div
              key={idx}
              className={cn("flex flex-col", {
                "items-end": isUser,
                "items-start": !isUser,
              })}
            >
              <div
                className={cn("rounded-lg text-sm whitespace-pre-wrap", {
                  "bg-primary max-w-[70%] rounded-xl px-4 py-2 text-white":
                    isUser,
                  "bg-primary-100 max-w-[75%] px-4 py-2 text-black": !isUser,
                })}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        // For block code with language
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        // For inline code
                        <code className="bg-muted-foreground/20 rounded-sm px-1 py-0.5">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {!isUser && (
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => handleCopy(message.content, idx)}
                  >
                    {copiedIndex === idx ? (
                      <Icon icon="mdi:check" className="h-4 w-4" />
                    ) : (
                      <Icon icon="mdi:content-copy" className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <Icon icon="mdi:refresh" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <Icon icon="lucide:thumbs-up" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <Icon icon="lucide:thumbs-down" className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
}
