import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funzione per generare codice alfanumerico a 8 caratteri
export function generatePublicId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Tipi per il database
export interface Conversation {
  id: string
  public_id: string
  created_at: string
  updated_at: string
  status: 'active' | 'completed' | 'archived'
  metadata: Record<string, unknown>
}

export interface ConversationMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  metadata: Record<string, unknown>
}

// Helper functions for chat management
export const chatQueries = {
  // Get all conversations with message counts and previews
  async getAllConversations() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    return { data, error };
  },

  // Get specific conversation by public_id
  async getConversationByPublicId(publicId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('public_id', publicId)
      .single();
    
    return { data, error };
  },

  // Get all messages for a conversation
  async getConversationMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  // Get message count for a conversation
  async getMessageCount(conversationId: string) {
    const { count, error } = await supabase
      .from('conversation_messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);
    
    return { count, error };
  }
};