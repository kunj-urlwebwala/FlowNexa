"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "ai" | "admin";
  text: string;
  timestamp: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m-1", sender: "ai", text: "Welcome to FlowNexa Hub AI assistant. I can query warehouse tables, write blog templates, or predict stock requirements. Ask me anything!", timestamp: "10:00 AM" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue) return;
    const adminMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "admin",
      text: inputValue,
      timestamp: "Just Now",
    };
    setMessages((prev) => [...prev, adminMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      let replyText = "I parsed your instruction. Let me compile a warehouse data analysis report for you shortly.";
      if (inputValue.toLowerCase().includes("stock") || inputValue.toLowerCase().includes("inventory")) {
        replyText = "Alert: MagSafe Stand (SF Logistics Center) stock count is currently 4, below minimum threshold. Dispatched Restock PO suggestion.";
      } else if (inputValue.toLowerCase().includes("payout") || inputValue.toLowerCase().includes("wallet")) {
        replyText = "Silicon Valley Bank Checking Account wallet balances are ₹48,291.50. Dispatched request for automated payout schedules.";
      }
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai",
        text: replyText,
        timestamp: "Just Now",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-left h-[calc(100vh-140px)]">
      
      {/* Header Info */}
      <div className="flex flex-col gap-1 select-none shrink-0">
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Sparkles size={20} className="text-flownexa-lime" />
          FlowNexa AI Assistant
        </h1>
        <p className="text-xs text-muted-foreground">Autonomous assistant executing backend CLI orders and analyzing sales indices.</p>
      </div>

      {/* Chat Terminal Console */}
      <div className="flex-1 bg-flownexa-surface border border-white/5 rounded-3xl flex flex-col justify-between overflow-hidden shadow-lg">
        
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin">
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  isAI ? "self-start text-left" : "self-end flex-row-reverse text-right"
                )}
              >
                {/* Avatar */}
                <Avatar className={cn("size-8 rounded-lg shrink-0 border", isAI ? "border-flownexa-lime/20" : "border-white/10")}>
                  {isAI ? (
                    <AvatarFallback className="bg-flownexa-lime-muted text-flownexa-lime font-black">
                      <Bot size={13} />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-white/5 text-white font-bold text-[10px]">
                      AM
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Message Body Bubble */}
                <div className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-xs leading-relaxed",
                      isAI
                        ? "bg-[#1A1D26] text-white border border-white/5 rounded-tl-sm"
                        : "bg-flownexa-lime text-flownexa-black font-semibold rounded-tr-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input box bar */}
        <div className="p-4 bg-zinc-950/40 border-t border-white/5 select-none shrink-0">
          <div className="flex gap-2 items-center bg-[#1A1D26] border border-white/5 rounded-xl px-3 py-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask AI to query sales ledger, check stock, or list articles..."
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs p-0 text-white placeholder-muted-foreground"
            />
            <Button
              size="sm"
              onClick={handleSend}
              className="rounded-lg size-8 p-0 bg-flownexa-lime text-flownexa-black hover:bg-flownexa-lime-hover shrink-0 cursor-pointer"
            >
              <Send size={12} />
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
