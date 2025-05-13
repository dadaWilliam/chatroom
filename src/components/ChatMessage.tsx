import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  author: string;
  isCurrentUser?: boolean;
}

export function ChatMessage({ content, author, isCurrentUser = false }: ChatMessageProps) {
    console.log('isCurrentUser:', isCurrentUser);
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isCurrentUser ? 'flex-row' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 border-2 border-background flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-medium">
              {author.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
            isCurrentUser 
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none" 
              : "bg-muted dark:bg-muted/90 rounded-bl-none border border-border/50"
          )}
        >
          {!isCurrentUser && (
            <div className="text-xs text-muted-foreground font-medium mb-1">{author}</div>
          )}
          {isCurrentUser && (
            <div className="text-xs font-medium mb-1 text-white">{author}</div>
          )}
          <div className="break-words">{content}</div>
        </div>

        {isCurrentUser && (
          <Avatar className="h-8 w-8 border-2 border-background flex-shrink-0 ml-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
              {author.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
} 