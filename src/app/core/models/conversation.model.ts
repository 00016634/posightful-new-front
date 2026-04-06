export interface LeadConversation {
  id: number;
  tenant: number;
  lead: number;
  agent: number;
  agent_code: string;
  agent_name: string;
  lead_customer_name: string;
  lead_customer_phone: string;
  channel: 'in_person' | 'phone' | 'email' | 'online_chat';
  audio_file: string | null;
  raw_transcript: string;
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  rating: number | null;
  conversation_topic: string;
  short_description: string;
  conversation_outcome: string;
  customer_sentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive' | null;
  ai_raw_response: any;
  analyzed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadConversationCreate {
  lead: number;
  channel: 'in_person' | 'phone' | 'email' | 'online_chat';
  raw_transcript?: string;
  audio_file?: File;
}
