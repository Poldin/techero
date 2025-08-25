"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, ExternalLink } from "lucide-react";
import { supabase, Conversation } from "@/lib/supabase";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";

interface ConversationWithPreview extends Conversation {
  firstMessage?: string;
  lastMessage?: string;
  messageCount: number;
}

export default function ChatListPage() {
  const { PasswordProtection } = usePasswordProtection();
  const [conversations, setConversations] = useState<ConversationWithPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"created_at" | "updated_at">("updated_at");

  useEffect(() => {
    fetchConversations();
  }, [sortBy]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Fetch conversations with sorting
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .order(sortBy, { ascending: false });

      if (conversationsError) throw conversationsError;

      // For each conversation, get message count and preview
      const conversationsWithPreview = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          // Get message count
          const { count } = await supabase
            .from('conversation_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          // Get first message (user message)
          const { data: firstMessage } = await supabase
            .from('conversation_messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .eq('role', 'user')
            .order('created_at', { ascending: true })
            .limit(1);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('conversation_messages')
            .select('content, role')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...conv,
            messageCount: count || 0,
            firstMessage: firstMessage?.[0]?.content?.substring(0, 100),
            lastMessage: lastMessage?.[0]?.content?.substring(0, 100),
          };
        })
      );

      setConversations(conversationsWithPreview);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = 
      conv.firstMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.public_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openChat = (publicId: string) => {
    window.open(`/chat/${publicId}`, '_blank');
  };

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                tec<span className="text-primary">Hero</span>
              </h1>
              <span className="ml-4 text-muted-foreground">/ Chat Management</span>
            </div>
            <Button 
              className="rounded-full px-6"
              onClick={() => window.open('/', '_self')}
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Gestione Chat
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualizza e gestisci tutte le conversazioni del sistema
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cerca per ID, contenuto messaggio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Tutti gli stati</option>
                <option value="active">Attive</option>
                <option value="completed">Completate</option>
                <option value="archived">Archiviate</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "created_at" | "updated_at")}
                className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="updated_at">Ultima attività</option>
                <option value="created_at">Data creazione</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{conversations.length}</div>
              <div className="text-sm text-muted-foreground">Totale conversazioni</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {conversations.filter(c => c.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Attive</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {conversations.reduce((sum, c) => sum + c.messageCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Totale messaggi</div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations Table */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Caricamento conversazioni...</div>
            </CardContent>
          </Card>
        ) : filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Nessuna conversazione trovata con i filtri applicati" 
                  : "Nessuna conversazione trovata"
                }
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="p-4 font-medium text-muted-foreground">ID</th>
                      <th className="p-4 font-medium text-muted-foreground">Primo Messaggio</th>
                      <th className="p-4 font-medium text-muted-foreground">Ultimo Messaggio</th>
                      <th className="p-4 font-medium text-muted-foreground">Messaggi</th>
                      <th className="p-4 font-medium text-muted-foreground">Stato</th>
                      <th className="p-4 font-medium text-muted-foreground">Creata</th>
                      <th className="p-4 font-medium text-muted-foreground">Aggiornata</th>
                      <th className="p-4 font-medium text-muted-foreground">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConversations.map((conversation) => (
                      <tr 
                        key={conversation.id} 
                        className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => openChat(conversation.public_id)}
                      >
                        <td className="p-4">
                          <div className="font-mono text-sm font-medium">
                            {conversation.public_id}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs truncate text-sm">
                            {conversation.firstMessage || "-"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs truncate text-sm">
                            {conversation.lastMessage || "-"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium">
                            {conversation.messageCount}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.status === 'active' 
                              ? 'bg-green-500/10 text-green-500'
                              : conversation.status === 'completed'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {conversation.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(conversation.created_at)}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(conversation.updated_at)}
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              openChat(conversation.public_id);
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Apri
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
                 )}
       </div>
     </div>
    </PasswordProtection>
   );
 }
