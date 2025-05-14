import { FormEvent, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="border-t px-4 py-3 bg-card">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <Button
            ref={emojiButtonRef}
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full flex-shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </Button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <div className="relative flex-1">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="pr-10 py-6 bg-muted/50 border-muted focus-visible:ring-primary/20 rounded-full"
          />
        </div>
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || !input.trim()} 
          className="rounded-full flex-shrink-0 bg-primary hover:bg-primary/90"
        >
          <SendHorizonal size={18} className="mr-0.5" />
        </Button>
      </form>
    </div>
  );
} 