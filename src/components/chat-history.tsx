import { useEffect, useState } from "react";
import { useChat } from "@/context/chat-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreVertical, Trash2 } from "lucide-react";
import { deleteChat } from "@/services/endpoints";

export function ChatHistory() {
  const {
    chatList,
    fetchChatHistory,
    loadChatMessages,
    selectedChatId,
    setSelectedChatId,
    setChatStarted,
  } = useChat();

  const [chatToDelete, setChatToDelete] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    setChatStarted(true);
    await loadChatMessages(chatId);
  };

  const handleDelete = async () => {
    if (!chatToDelete) return;

    setIsDeleting(true);

    try {
      const email = (() => {
        try {
          const stored = localStorage.getItem("user");
          if (!stored) return null;
          const parsed = JSON.parse(stored);
          return parsed.email || null;
        } catch {
          return null;
        }
      })();

      // ✅ Call delete API
      const status = await deleteChat({ userid: email }, chatToDelete.chatId);

      if (status === 204) {
        if (selectedChatId === chatToDelete.chatId) {
          setSelectedChatId(null);
        }

        // ✅ Refresh sidebar
        await fetchChatHistory();
      } else {
        console.warn("Unexpected delete status:", status);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
      setChatToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-muted-foreground mb-2 px-1 text-sm font-semibold">
        Conversation History
      </h3>

      <div className="space-y-1">
        {chatList.length === 0 && (
          <p className="text-muted-foreground px-3 py-2 text-xs">
            No chats yet
          </p>
        )}

        {chatList.map((chat) => (
          <div
            key={chat.chatId}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-150",
              selectedChatId === chat.chatId
                ? "bg-accent/80 text-accent-foreground"
                : "hover:bg-muted/60 text-foreground",
            )}
          >
            <button
              onClick={() => handleSelect(chat.chatId)}
              className="flex-1 truncate text-left text-sm font-medium"
            >
              {chat.chatTitle || "Untitled Chat"}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-6 w-6"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => {
                    setChatToDelete(chat);
                    setIsDialogOpen(true);
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* 🗑️ Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-foreground font-medium">
                {chatToDelete?.chatTitle || "this chat"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
