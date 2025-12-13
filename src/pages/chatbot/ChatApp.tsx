import { useContext, useEffect, useState } from "react";
import ChatInputBox from "@/components/chatbot/ChatInputBox";
import ChatMessages from "@/components/chatbot/ChatMessages";
import { ChatProvider, useChat } from "@/context/chat-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import PromptLibrary from "@/components/chatbot/PromptLibrary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ChatSidebarProvider,
  ChatSidebarTrigger,
} from "@/components/ui/chat-sidebar";
import { SidebarLeft } from "@/components/chat-sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserContext } from "@/context/user-context";

function ChatHeader({ handleNewChat }: { handleNewChat: () => void }) {
  const { model } = useChat();

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-20 h-14 w-full border-b backdrop-blur">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left side trigger */}
        <div className="flex items-center gap-3">
          <ChatSidebarTrigger />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={200}>
            {/* ➕ New Chat Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNewChat}
                  className="bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:ring-primary/60 flex h-9 items-center gap-2 rounded-md px-3 shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none active:translate-y-0 active:shadow-sm sm:px-4"
                >
                  <Icon icon="mdi:plus" />
                  <span>New Chat</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-sm">
                Start a new chat
              </TooltipContent>
            </Tooltip>

            {/* ℹ️ Info Button */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-muted/40 text-foreground hover:bg-muted hover:ring-primary/50 focus-visible:ring-primary/60 relative flex h-9 w-9 items-center justify-center rounded-md shadow-sm transition-all hover:ring-1 focus-visible:ring-2"
                    >
                      <Icon
                        icon="mdi:information-outline"
                        className="h-5 w-5"
                      />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-sm">
                  Model Info
                </TooltipContent>
              </Tooltip>

              {/* Dialog Content */}
              <DialogContent className="border-border/50 from-background/95 to-muted/80 h-[75vh] max-w-4xl overflow-y-auto rounded-2xl border bg-gradient-to-br p-8 shadow-2xl backdrop-blur-md">
                <div className="from-primary/70 via-primary to-primary/70 absolute top-0 right-0 left-0 h-1 rounded-t-2xl bg-gradient-to-r" />
                <DialogHeader>
                  <DialogTitle className="text-foreground mb-4 text-2xl font-semibold">
                    About This Model
                  </DialogTitle>
                </DialogHeader>

                <div className="text-muted-foreground grid grid-cols-2 gap-8 text-sm leading-relaxed">
                  <section>
                    <h4 className="text-foreground mb-2 text-lg font-medium">
                      Model Information
                    </h4>
                    <p className="mb-1">
                      <strong>Name:</strong>{" "}
                      {model?.name || "No model selected"}
                    </p>
                    <p>
                      <strong>Provider:</strong> Exelixis AI / AWS Bedrock
                    </p>
                    <p>
                      <strong>Version:</strong> 1.0.0
                    </p>
                    <p>
                      <strong>Capabilities:</strong> Chat, RAG, Text Analysis,
                      Embeddings
                    </p>
                  </section>

                  <section>
                    <h4 className="text-foreground mb-2 text-lg font-medium">
                      Performance
                    </h4>
                    <p>
                      Optimized for enterprise-scale workloads with adaptive
                      routing between inference endpoints.
                    </p>
                    <p>
                      Typical latency: <strong>1.2s – 2.5s</strong>
                    </p>
                    <p>
                      Maximum token limit: <strong>16,000</strong>
                    </p>
                  </section>

                  <Separator className="col-span-2 my-4" />

                  <section>
                    <h4 className="text-foreground mb-2 text-lg font-medium">
                      Data Privacy & Usage
                    </h4>
                    <p>
                      Data is processed securely within AWS infrastructure and
                      not stored permanently. Avoid sharing sensitive content
                      unless explicitly authorized.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-foreground mb-2 text-lg font-medium">
                      Platform Details
                    </h4>
                    <p>
                      Exelixis AI Platform — powered by AWS Bedrock, React, and
                      Tailwind. Built for enterprise-grade GenAI operations.
                    </p>
                    <p className="mt-2">
                      Contact support:{" "}
                      <a
                        href="mailto:support@exelixis.ai"
                        className="text-primary underline"
                      >
                        support@exelixis.ai
                      </a>
                    </p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}

function ChatLayout() {
  const [prefill, setPrefill] = useState("");
  const { clearChat, chatStarted, setChatStarted } = useChat();

  const handleNewChat = () => {
    clearChat();
    setChatStarted(false);
    setPrefill("");
  };

  const handleSend = () => setChatStarted(true);
  const handlePromptSelect = (prompt: string) => {
    setPrefill(prompt);
    setChatStarted(true);
  };

  return (
    <div className="relative flex h-full w-full">
      <SidebarLeft />
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader handleNewChat={handleNewChat} />

        <div
          className="flex flex-1 flex-col overflow-hidden"
        >
          <main
            className={`no-scrollbar flex-1 overflow-y-auto overflow-y-scroll transition-all duration-500 ${
              chatStarted
                ? "pt-4"
                : "flex flex-col items-center justify-center text-center"
            }`}
          >
            {!chatStarted ? (
              <div className="flex w-full flex-col items-center">
                <h1 className="text-foreground mb-8 text-3xl font-semibold">
                  How can I help you today?
                </h1>
                <PromptLibrary onSend={handlePromptSelect} />
              </div>
            ) : (
              <ChatMessages />
            )}
          </main>

          <footer className="mt-4 w-full pb-4">
            <div className="mx-auto max-w-4xl">
              <ChatInputBox onSend={handleSend} prefill={prefill} />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function ChatApp() {
  const { setIsCollapsed } = useContext(UserContext);
  useEffect(() => {
    setIsCollapsed(true);

    return () => {
      setIsCollapsed(false);
    };
  }, []);
  return (
    <ChatProvider>
      <ChatSidebarProvider>
        <ChatLayout />
      </ChatSidebarProvider>
    </ChatProvider>
  );
}
