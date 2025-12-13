import { useEffect, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { useChat } from "@/context/chat-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ChatInputBoxProps {
  onSend?: () => void;
  prefill?: string;
}

export default function ChatInputBox({ onSend, prefill }: ChatInputBoxProps) {
  const { sendChat, model, isLoading } = useChat();
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const suggestions = [
    "Can you explain more?",
    "Give me an example.",
    "What are the implications?",
  ];

  useEffect(() => {
    if (prefill) setMessage(prefill);
  }, [prefill]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessage("");
    setShowSuggestions(false);
    setHasInteracted(true);

    await sendChat(text);
    onSend?.();
    const checkInterval = setInterval(() => {
      if (!isLoading) {
        setShowSuggestions(true);
        clearInterval(checkInterval);
      }
    }, 400);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(message);
    }
  };

  const handleSuggestionSelect = (text: string) => {
    setMessage(text);
  };

  return (
    <>
      {hasInteracted && showSuggestions && (
        <div className="flex w-full justify-center pb-2 transition-all duration-300">
          <div className="flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionSelect(s)}
                className="rounded-full border border-gray-300 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 transition-all hover:bg-gray-100 hover:shadow-sm active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="relative w-full py-3">
        <div className="relative mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl border border-gray-300 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="resize-none border-none text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ maxHeight: "7.5rem" }}
          />

          <div className="flex items-center justify-end gap-3">
            <div className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-[4px] text-sm font-medium text-gray-700 shadow-sm transition-all hover:from-gray-100 hover:to-gray-200">
              <Icon icon="mdi:sparkles" className="text-primary h-4 w-4" />
              <span className="max-w-[200px] truncate">
                {model?.shortName ?? "No model selected"}
              </span>
            </div>
            <Button
              size="icon"
              disabled={!model || isLoading}
              className="bg-primary/90 rounded-md text-white shadow-sm transition-all hover:bg-primary hover:shadow-md disabled:opacity-50"
              onClick={() => handleSend(message)}
            >
              <Icon
                icon={isLoading ? "line-md:loading-loop" : "mdi:arrow-up"}
                className="h-5 w-5"
              />
            </Button>
          </div>
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          Please read the{" "}
          <button
            className="font-medium text-blue-600 hover:underline focus:outline-none"
            onClick={() => setShowDialog(true)}
          >
            Terms and Conditions
          </button>
          .
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="h-[95vh] w-full max-w-full overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Model Terms and Conditions
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-gray-600">
              Please review the following terms before using this AI model.
              These guidelines help ensure responsible and ethical use of the
              system.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-5 leading-relaxed text-gray-700">
            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                1. Purpose and Use
              </h3>
              <p>
                The AI model is designed to assist with general-purpose
                questions, content generation, and enterprise use cases. It is
                not intended to replace human judgment or provide legally
                binding advice.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                2. Accuracy and Limitations
              </h3>
              <p>
                While the model strives for accuracy, it may generate
                incomplete, outdated, or incorrect information. Users must
                validate outputs independently before relying on them for
                critical or production use.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                3. Data Privacy
              </h3>
              <p>
                Do not input sensitive personal data, confidential business
                information, or protected health details. Model interactions may
                be logged and analyzed for system improvement.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                4. Responsible Use
              </h3>
              <p>
                The user agrees not to employ the model for harmful, unethical,
                or unlawful purposes, including disinformation, harassment,
                discrimination, or automated decision-making without oversight.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                5. Liability and Warranty
              </h3>
              <p>
                The organization and model providers disclaim any warranties of
                accuracy, reliability, or merchantability. Users accept full
                responsibility for how outputs are interpreted or applied.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                6. Updates and Policy Changes
              </h3>
              <p>
                These terms may be updated periodically to reflect improvements
                or regulatory changes. Continued use after modifications implies
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h3 className="mb-1 text-lg font-semibold text-gray-800">
                7. Contact
              </h3>
              <p>
                For compliance, privacy inquiries, or reporting misuse, contact
                your administrator or the AI governance team within your
                organization.
              </p>
            </section>
          </div>

          <DialogFooter className="mt-6 flex justify-end">
            <Button
              variant="default"
              onClick={() => setShowDialog(false)}
              className="rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
