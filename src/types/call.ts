
export enum CallStatus {
  QUEUED = 'queued',
  DIALING = 'dialing',
  IN_ROOM = 'in_room',
  RAG = 'rag',
  DONE = 'done',
  ERROR = 'error',
}

export interface Call {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  company: string;
  status: CallStatus;
  createdAt: string;
  duration: number | null;
  transcript?: string;
  summary?: string;
  customPrompt?: string;
}

export interface CreateCallRequest {
  customerName: string;
  phone: string;
  email: string;
  company?: string;
  customPrompt?: string;
}
