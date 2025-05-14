"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Users, Loader2 } from "lucide-react";

export function ChatRoom() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasTriedInitialScroll, setHasTriedInitialScroll] = useState(false);
  
  // Get the most recent messages (limited to 2 for testing pagination)
  const recentMessages = useQuery(api.messages.get);
  
  // Set up paginated query for older messages with fewer initial items
  const {
    results: olderMessages,
    status,
    loadMore
  } = usePaginatedQuery(
    api.messages.getPaginated,
    {},
    { initialNumItems: 5 } // Start with 5 for testing
  );
  
  // For debugging - log pagination status changes
  useEffect(() => {
    console.log("Pagination status:", status);
    console.log("Older messages count:", olderMessages?.length || 0);
    console.log("Recent messages count:", recentMessages?.length || 0);
  }, [status, olderMessages, recentMessages]);
  
  // Combine recent and paginated messages
  const allMessages = [...(olderMessages || []), ...(recentMessages || [])];
  
  // Remove duplicates (messages that appear in both arrays)
  const uniqueMessages = allMessages.filter((message, index, self) => 
    index === self.findIndex(m => m._id === message._id)
  );
  
  // Reverse order back to oldest-to-newest for display
  const displayMessages = [...uniqueMessages].reverse();
  
  const sendMessage = useMutation(api.messages.send);

  // Set username on first render
  useEffect(() => {
    if (!username) {
      const randomUsername = `User${Math.floor(Math.random() * 10000)}`;
      setUsername(randomUsername);
    }
  }, [username]);

  // Auto-scroll to bottom for new messages when autoScroll is true
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recentMessages, displayMessages, autoScroll]);

  // Initial scroll to bottom when messages first load
  useEffect(() => {
    if (displayMessages?.length > 0 && !hasTriedInitialScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
      setHasTriedInitialScroll(true);
    }
  }, [displayMessages, hasTriedInitialScroll]);

  // Handle scroll events to detect when user scrolls up
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    
    // If user scrolls near bottom, enable auto-scroll
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setAutoScroll(true);
    } else {
      setAutoScroll(false);
    }
    
    // Improved loading trigger - load more when scrolling near top
    if (scrollTop < 100 && status === "CanLoadMore" && !isLoadingMore) {
      console.log("Attempting to load more messages...");
      setIsLoadingMore(true);
      
      // Store current scroll position and height
      const currentScrollHeight = scrollHeight;
      
      // Use async/await pattern
      const loadMoreMessages = async () => {
        try {
          // loadMore doesn't return a promise we can await
          loadMore(10);
          console.log("Requested more messages");
          
          // After a short delay to allow messages to load, restore scroll position
          setTimeout(() => {
            if (messagesContainerRef.current) {
              const newPosition = messagesContainerRef.current.scrollHeight - currentScrollHeight;
              console.log(`Adjusting scroll position to ${newPosition}`);
              messagesContainerRef.current.scrollTop = newPosition;
              setIsLoadingMore(false);
            }
          }, 200); // Increased timeout to allow for loading
        } catch (error) {
          console.error("Error loading more messages:", error);
          setIsLoadingMore(false);
        }
      };
      
      loadMoreMessages();
    }
  }, [status, loadMore, isLoadingMore]);

  // Set up scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    await sendMessage({ content, author: username });
    setAutoScroll(true);
  };

  // Helper function to render pagination status text
  const getPaginationStatusText = () => {
    if (status === "CanLoadMore") return "(Scroll up for older messages)";
    if (status === "LoadingMore" || isLoadingMore) return "(Loading more messages...)";
    if (status === "Exhausted") return "(All messages loaded)";
    return "";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col shadow-lg rounded-xl overflow-hidden border-1 py-0">
      <CardHeader className="px-6 pb-4 border-b bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 flex-shrink-0 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageCircle size={20} className="text-primary" /> 
              Chat Room
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Connected as <span className="font-medium text-primary">{username}</span>
              {status && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {getPaginationStatusText()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Users size={14} className="mr-1.5" />
            Online
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 relative">
        <div 
          ref={messagesContainerRef} 
          className="absolute inset-0 overflow-y-auto scroll-smooth"
        >
          <div className="p-6 space-y-4 min-h-full flex flex-col justify-end">
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            )}
            
            {status === "Exhausted" && !isLoadingMore && (
              <div className="flex justify-center py-2 text-xs text-muted-foreground">
                No more messages to load
              </div>
            )}
            
            {displayMessages && displayMessages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-center text-muted-foreground">
                  No messages yet. Start chatting!
                </p>
              </div>
            ) : displayMessages ? (
              displayMessages.map((message) => (
                <ChatMessage
                  key={message._id}
                  content={message.content}
                  author={message.author}
                  isCurrentUser={message.author === username}
                />
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-center text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </CardContent>
      <ChatInput onSendMessage={handleSendMessage} />
    </Card>
  );
}