interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function ChatSuggestions({
  suggestions,
  onSelect,
}: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(suggestion)}
          className="cursor-pointer rounded-full border border-slate-800 px-3 py-1 text-sm transition hover:bg-slate-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
