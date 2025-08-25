"use client";

import React, { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Send, Bot, User, Loader2 } from "lucide-react";

// Stili custom per scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    background: hsl(var(--background));
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: hsl(var(--background));
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.2);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary) / 0.4);
  }
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--primary) / 0.2) transparent;
  }
`;

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
}) => {
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [publicId, setPublicId] = React.useState<string | null>(null);
  const conversationIdRef = React.useRef<string | null>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: async (url: RequestInfo | URL, options?: RequestInit) => {
        // Aggiungi conversationId al body
        if (options?.body) {
          const body = JSON.parse(options.body as string);
          const currentId = conversationIdRef.current;
          if (currentId) {
            body.conversationId = currentId;
          }
          options.body = JSON.stringify(body);
        }
        
        const response = await fetch(url, options);
        
        // Cattura gli ID dalla prima risposta
        if (!conversationId && response.ok) {
          const newConversationId = response.headers.get('X-Conversation-Id');
          const newPublicId = response.headers.get('X-Public-Id');
          
          if (newConversationId) setConversationId(newConversationId);
          if (newPublicId) setPublicId(newPublicId);
        }
        
        // Log risposta e header utili
        console.log("ChatWidget fetch response", {
          ok: response.ok,
          status: response.status,
          headers: {
            conversationId: response.headers.get('X-Conversation-Id'),
            publicId: response.headers.get('X-Public-Id'),
          },
        });
        return response;
      },
    }),
    onFinish: (message) => {
      // Log del messaggio finale ricevuto dal modello
      console.log("ChatWidget onFinish message", message);
    },
    onError: (error) => {
      console.error("ChatWidget onError", error);
    },
  });

  const [input, setInput] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Log dei messaggi correnti per capire se arriva il messaggio finale dell'assistente
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      console.log("ChatWidget messages update", {
        count: messages.length,
        lastRole: last.role,
        lastParts: last.parts?.map((p) => p.type) ?? [],
      });
    } else {
      console.log("ChatWidget messages empty");
    }
  }, [messages]);

  // Log dei cambi di stato dello stream (ready/streaming)
  useEffect(() => {
    console.log("ChatWidget status", status);
  }, [status]);

  // Reset conversation quando la chat viene chiusa
  useEffect(() => {
    if (!isOpen) {
      setConversationId(null);
      setPublicId(null);
    }
  }, [isOpen]);

  // Mantieni sempre aggiornato il riferimento all'ID conversazione
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Messaggio iniziale del bot
  const initialBotMessage = {
    id: 'welcome',
    role: 'assistant' as const,
    parts: [{
      type: 'text' as const,
      text: 'Ciao! Raccontami il tuo progetto e ti farò alcune domande per una quotazione preliminare.'
    }]
  };

  // Mostra messaggio iniziale se non ci sono altri messaggi
  const displayMessages = messages.length === 0 ? [initialBotMessage] : messages;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      {/* Mobile */}
      <div className="fixed inset-0 z-50 lg:hidden bg-background">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">tecHero Bot</h3>
                <p className="text-sm text-muted-foreground">
                  {publicId ? `Chat: ${publicId}` : 'Online'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}>
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}>
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <span key={index} className="text-sm leading-relaxed">
                          {part.text}
                        </span>
                      );
                    }
                    const anyPart = part as unknown as { type: string; output: string };
                    const isToolPart = typeof anyPart?.type === 'string' && anyPart.type.startsWith('tool-');
                    if (isToolPart && anyPart.output) {
                      let display = '';
                      try {
                        const parsed = JSON.parse(anyPart.output);
                        display = parsed?.ok === true
                          ? 'Richiesta inviata correttamente. Ti ricontatteremo a breve con la quotazione.'
                          : "C'è stato un problema nell'invio. Puoi lasciarci un contatto alternativo o riprovare?";
                      } catch {
                        display = 'Operazione completata. Ti ricontatteremo a breve.';
                      }
                      return (
                        <span key={index} className="text-sm leading-relaxed">
                          {display}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            
            {status === "streaming" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-card">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={status !== "ready"}
                placeholder="Scrivi messaggio..."
                rows={1}
                className="flex-1 px-4 py-2 border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[40px] max-h-32 overflow-y-auto custom-scrollbar"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && status === "ready") {
                      sendMessage({ text: input });
                      setInput("");
                      // Reset height
                      setTimeout(() => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                      }, 0);
                    }
                  }
                }}
              />
              <Button
                type="submit"
                disabled={status !== "ready" || !input.trim()}
                size="icon"
                className="rounded-full flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block fixed bottom-4 right-6 z-50">
        <Card className="w-[35vw] h-[95vh] shadow-2xl border-2">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">tecHero Bot</h3>
                  <p className="text-sm text-muted-foreground">
                    {publicId ? `Chat: ${publicId}` : 'Online'}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(95vh-120px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {displayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    {message.role === "user" ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <span key={index} className="text-sm leading-relaxed">
                            {part.text}
                          </span>
                        );
                      }
                      const anyPart = part as unknown as { type: string; output: string };
                      const isToolPart = typeof anyPart?.type === 'string' && anyPart.type.startsWith('tool-');
                      if (isToolPart && anyPart.output) {
                        let display = '';
                        try {
                          const parsed = JSON.parse(anyPart.output);
                          display = parsed?.ok === true
                            ? 'Richiesta inviata correttamente. Ti ricontatteremo a breve con la quotazione.'
                            : "C'è stato un problema nell'invio. Puoi lasciarci un contatto alternativo o riprovare?";
                        } catch {
                          display = 'Operazione completata. Ti ricontatteremo a breve.';
                        }
                        return (
                          <span key={index} className="text-sm leading-relaxed">
                            {display}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== "ready"}
                  placeholder="Messaggio..."
                  rows={1}
                  className="flex-1 px-3 py-2 text-sm border rounded-2xl bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[32px] max-h-24 overflow-y-auto custom-scrollbar"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() && status === "ready") {
                        sendMessage({ text: input });
                        setInput("");
                        // Reset height
                        setTimeout(() => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                        }, 0);
                      }
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={status !== "ready" || !input.trim()}
                  size="sm"
                  className="rounded-full px-3 flex-shrink-0"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
