"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Users } from "lucide-react";

export function ChatRoom() {
  const messages = useQuery(api.messages.get);
  const sendMessage = useMutation(api.messages.send);
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) {
      const randomUsername = `User${Math.floor(Math.random() * 10000)}`;
      setUsername(randomUsername);
    }
  }, [username]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    await sendMessage({ content, author: username });
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
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Users size={14} className="mr-1.5" />
            Online
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 relative">
        <div className="absolute inset-0 overflow-y-auto">
          <div className="p-6 space-y-4 min-h-full flex flex-col justify-end">
            {messages && messages.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-center text-muted-foreground">
                  No messages yet. Start chatting!
                </p>
              </div>
            ) : messages ? (
              messages.map((message) => (
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