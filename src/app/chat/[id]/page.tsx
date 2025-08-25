"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, User, Bot, Calendar, Hash, Activity } from "lucide-react";
import { supabase, Conversation, ConversationMessage } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";

export default function ChatDetailPage() {
  const { PasswordProtection } = usePasswordProtection();
  const params = useParams();
  const router = useRouter();
  const chatId = params?.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chatId) {
      fetchConversationData();
    }
  }, [chatId]);

  const fetchConversationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch conversation by public_id
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('public_id', chatId)
        .single();

      if (conversationError) {
        if (conversationError.code === 'PGRST116') {
          setError('Conversazione non trovata');
          return;
        }
        throw conversationError;
      }

      setConversation(conversationData);

      // Fetch messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationData.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setError('Errore nel caricamento della conversazione');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatMessageContent = (content: string) => {
    // Basic formatting for better readability
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'assistant':
        return <Bot className="w-4 h-4" />;
      case 'system':
        return <Activity className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user':
        return 'text-blue-500';
      case 'assistant':
        return 'text-green-500';
      case 'system':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-500/10';
      case 'completed':
        return 'text-blue-500 bg-blue-500/10';
      case 'archived':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  if (loading) {
    return (
      <PasswordProtection>
        <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-16">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Indietro
              </Button>
              <h1 className="text-2xl font-bold">
                tec<span className="text-primary">Hero</span>
              </h1>
              <span className="ml-4 text-muted-foreground">/ Chat / Caricamento...</span>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Caricamento conversazione...</div>
            </CardContent>
          </Card>
        </div>
      </div>
      </PasswordProtection>
    );
  }

  if (error || !conversation) {
    return (
      <PasswordProtection>
        <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-16">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Indietro
              </Button>
              <h1 className="text-2xl font-bold">
                tec<span className="text-primary">Hero</span>
              </h1>
              <span className="ml-4 text-muted-foreground">/ Chat / Errore</span>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground">{error}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      </PasswordProtection>
    );
  }

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Indietro
              </Button>
              <h1 className="text-2xl font-bold">
                tec<span className="text-primary">Hero</span>
              </h1>
              <span className="ml-4 text-muted-foreground">/ Chat / {conversation.public_id}</span>
            </div>
            <Button 
              className="rounded-full px-6"
              onClick={() => window.open('/chat', '_self')}
            >
              Tutte le Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Conversation Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Hash className="w-5 h-5 text-muted-foreground" />
                    {conversation.public_id}
                  </h1>
                  <p className="text-muted-foreground">
                    {messages.length} messaggio{messages.length !== 1 ? 'i' : ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(conversation.status)}`}>
                  {conversation.status}
                </span>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(conversation.created_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground">Nessun messaggio in questa conversazione</div>
              </CardContent>
            </Card>
          ) : (
            messages.map((message, index) => (
              <Card key={message.id} className="relative">
                <CardContent className="p-6">
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        message.role === 'user' 
                          ? 'bg-blue-500/10' 
                          : message.role === 'assistant'
                          ? 'bg-green-500/10'
                          : 'bg-orange-500/10'
                      }`}>
                        <div className={getRoleColor(message.role)}>
                          {getRoleIcon(message.role)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium capitalize">
                          {message.role === 'user' ? 'Utente' : 
                           message.role === 'assistant' ? 'Assistente' : 
                           'Sistema'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`prose prose-sm max-w-none ${
                    message.role === 'user' ? 'text-foreground' : 'text-foreground/90'
                  }`}>
                    <div className="whitespace-pre-wrap break-words">
                      {formatMessageContent(message.content)}
                    </div>
                  </div>

                  {/* Metadata */}
                  {message.metadata && Object.keys(message.metadata).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <details className="group">
                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                          Metadata
                        </summary>
                        <pre className="mt-2 text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(message.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Conversation Metadata */}
        {conversation.metadata && Object.keys(conversation.metadata).length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Metadata Conversazione</h3>
              <pre className="text-xs bg-muted/30 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(conversation.metadata, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </PasswordProtection>
  );
}
