export interface ExotelSessionEvent {
  event: "Connected" | "Start" | "Media" | "Stop" | "DTMF" | "Clear";
  stream_sid?: string;
  start?: {
    stream_sid: string;
    sample_rate: number;
    codec?: string;
    format?: string;
  };
  media?: {
    chunk: string;
    timestamp?: number;
  };
  dtmf?: {
    digit: string;
  };
  reason?: string;
  custom_parameters?: Record<string, string>;
}

export interface BotMediaMessage {
  event: "media";
  stream_sid: string;
  media: {
    chunk: string;
  };
}

export interface BotMarkMessage {
  event: "mark";
  stream_sid: string;
  mark: {
    name: string;
  };
}

export interface OpenAISessionConfig {
  instructions: string;
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  input_audio_format: "pcm16" | "g711_ulaw" | "g711_alaw";
  output_audio_format: "pcm16" | "g711_ulaw" | "g711_alaw";
  turn_detection: {
    type: "server_vad" | "none";
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
  modalities: ("text" | "audio")[];
  temperature: number;
  max_response_output_tokens: number | "inf";
}

export interface OrderVerificationResult {
  orderId: string;
  confirmed: boolean;
  customerResponse?: string;
}

export interface BotSessionState {
  streamSid: string | null;
  sampleRate: number;
  openaiConnected: boolean;
  audioBuffer: string[];
  orderCtx: OrderContext | null;
  fullTranscript: string;
  resultSent: boolean;
  startedAt: number;
}

export interface OrderContext {
  orderId: string;
  callRecordId: string;
  orderNumber: string;
  customerName: string;
  items: string;
  total: string;
  paymentMethod: string;
  attemptNumber: number;
}

export interface BotResultPayload {
  callRecordId: string;
  result: "CONFIRMED" | "DENIED" | "ERROR";
  transcript: string;
  summary: string | null;
}

export interface OpenAIFunctionCallbacks {
  onAudioDelta: (chunk: string) => void;
  onTranscript: (text: string, role: "customer" | "ai") => void;
  onResult?: (result: { confirmed: boolean; customerResponse: string }) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

export const BOT_DEFAULTS = {
  MAX_CALL_DURATION_MS: 5 * 60 * 1000,
  MAX_CONCURRENT_CALLS: 10,
  CONVERSATION_TIMEOUT_MS: 120_000,
  MAX_RECONNECT_ATTEMPTS: 3,
  RECONNECT_BASE_DELAY_MS: 1000,
  AUDIO_FLUSH_INTERVAL_MS: 500,
  AUDIO_FLUSH_TIMEOUT_MS: 30_000,
  OPENAI_CONNECT_DELAY_MS: 2000,
} as const;
