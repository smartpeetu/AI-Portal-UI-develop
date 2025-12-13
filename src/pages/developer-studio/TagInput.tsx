import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagInput({ value = [], onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const addEmail = () => {
    const email = input.trim();
    if (!email) return;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return;
    if (value.includes(email)) return;

    onChange([...value, email]);
    setInput("");
  };

  const removeEmail = (email: string) => {
    onChange(value.filter((e) => e !== email));
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-md border p-2">
      {value.map((email) => (
        <div
          key={email}
          className="bg-secondary flex items-center gap-1 rounded-md px-2 py-1 text-sm"
        >
          {email}
          <button
            type="button"
            onClick={() => removeEmail(email)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <Input
        className="h-auto min-w-[150px] flex-1 border-none p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={value.length === 0 ? "Add email…" : ""}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addEmail();
          }
          if (e.key === "Backspace" && input === "" && value.length > 0) {
            removeEmail(value[value.length - 1]);
          }
        }}
        onBlur={addEmail}
      />
    </div>
  );
}
