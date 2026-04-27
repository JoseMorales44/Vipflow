"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface SpaceChatProps {
  spaceId: string;
}

export function SpaceChat({ spaceId }: SpaceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
    loadMessages();

    const channel = supabase
      .channel(`space:${spaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `space_id=eq.${spaceId}`
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();
          
          const newMessage = {
            ...payload.new,
            profiles: profile
          } as Message;

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [spaceId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles:sender_id(full_name, avatar_url)')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (data) setMessages(data as any[]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !userId) return;

    const { error } = await supabase.from('messages').insert({
      space_id: spaceId,
      sender_id: userId,
      content: content.trim()
    });

    if (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.02)_0%,_transparent_100%)]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === userId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start gap-4",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="h-10 w-10 rounded-xl bg-zinc-900 shrink-0 border border-white/[0.05] flex items-center justify-center text-[10px] font-bold text-zinc-600">
                  {msg.profiles?.full_name?.[0] || 'U'}
                </div>
                <div className={cn(
                  "flex flex-col max-w-[65%]",
                  isMe ? "items-end" : "items-start"
                )}>
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      {msg.profiles?.full_name || 'Miembro'}
                    </span>
                    <span className="text-[9px] text-zinc-800 font-bold">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={cn(
                    "px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed border shadow-2xl",
                    isMe 
                      ? "bg-white text-black border-white rounded-tr-none font-medium" 
                      : "bg-zinc-900/50 text-zinc-300 border-white/[0.03] rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 bg-black border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto w-full">
            <PromptInputBox 
              placeholder="Escribe un mensaje privado..."
              onSend={(msg) => handleSendMessage(msg)}
            />
            <p className="text-[9px] text-zinc-800 mt-4 text-center uppercase tracking-[0.3em] font-black">
              Encriptación de grado agencia activa
            </p>
        </div>
      </div>
    </div>
  );
}
