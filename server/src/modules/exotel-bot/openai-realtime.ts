import WebSocket from "ws";
import { logger } from "../../config/logger";

const OPENAI_REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-realtime-1.5";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_BASE_DELAY_MS = 1000;
const CONVERSATION_TIMEOUT_MS = 120_000;

export interface OpenAICallbacks {
  onAudioDelta: (chunk: string) => void;
  onTranscript: (text: string, role: "customer" | "ai") => void;
  onResult?: (result: { confirmed: boolean; customerResponse: string }) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

interface ConversationItem {
  role: string;
  text: string;
  timestamp: number;
}

export class OpenAIClient {
  private ws: WebSocket | null = null;
  private apiKey: string = "";
  private callbacks: OpenAICallbacks | null = null;
  private inputAudioFormat: "pcm16" | "g711_ulaw" | "g711_alaw" = "pcm16";
  private reconnectAttempts = 0;
  private conversationItems: ConversationItem[] = [];
  private lastActivityTimestamp = Date.now();
  private conversationTimer: ReturnType<typeof setInterval> | null = null;
  private functionCallArgs = "";
  private isDisconnecting = false;

  setInputAudioFormat(format: "pcm16" | "g711_ulaw" | "g711_alaw"): void {
    this.inputAudioFormat = format;
  }

  connect(apiKey: string, callbacks: OpenAICallbacks): void {
    this.apiKey = apiKey;
    this.callbacks = callbacks;
    this.reconnectAttempts = 0;
    this.isDisconnecting = false;
    this.createConnection();
  }

  private createConnection(): void {
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws = null;
    }

    this.ws = new WebSocket(OPENAI_REALTIME_URL, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });

    this.ws.on("open", () => {
      logger.info("Connected to OpenAI Realtime API");
      this.reconnectAttempts = 0;
      this.lastActivityTimestamp = Date.now();
      this.sendSessionUpdate();
      this.startConversationTimer();
    });

    this.ws.on("message", (data: WebSocket.RawData) => {
      this.lastActivityTimestamp = Date.now();
      this.handleMessage(data);
    });

    this.ws.on("error", (err) => {
      logger.error({ error: err.message }, "OpenAI Realtime WebSocket error");
      this.callbacks?.onError(err);
    });

    this.ws.on("close", () => {
      logger.info("OpenAI Realtime WebSocket closed");
      this.stopConversationTimer();
      if (!this.isDisconnecting && this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        this.attemptReconnect();
        return;
      }
      this.callbacks?.onClose();
    });
  }

  private attemptReconnect(): void {
    this.reconnectAttempts++;
    const delay = RECONNECT_BASE_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);
    logger.info({ attempt: this.reconnectAttempts, delay }, "Attempting to reconnect to OpenAI");
    setTimeout(() => this.createConnection(), delay);
  }

  private sendSessionUpdate(): void {
    const sessionConfig = {
      type: "session.update",
      session: {
        instructions: `You are an order verification assistant for FlowNexa — an Indian e-commerce company.

Your job is to call customers to confirm their orders. Be polite, professional, and speak in a mix of Hindi and English (Hinglish).

CONVERSATION FLOW:
1. Greet the customer: "Namaste, main FlowNexa ki taraf se baat kar raha hoon."
2. Ask for the customer by name to confirm you're speaking to the right person
3. Tell them their order details: order number, items ordered, total amount, and payment method
4. Ask clearly: "Kya aap apna order confirm karte hain?"
5. If customer confirms → Thank them warmly → Say "Dhanyavaad! Aapka order process ho jayega." → Call submit_verification_result with confirmed=true
6. If customer denies/cancels → Acknowledge politely → "Koi baat nahi, aapka order cancel kar diya jayega." → Call submit_verification_result with confirmed=false
7. If customer is busy or asks to call later → Agree → "Koi baat nahi, hum baad mein call karenge." → Call submit_verification_result with confirmed=false

IMPORTANT RULES:
- Keep conversations short and natural (under 2 minutes)
- Never ask for OTPs, passwords, bank details, or sensitive information
- If customer sounds confused, repeat the order details slowly
- At the END of the conversation, ALWAYS call submit_verification_result function
- Do NOT end the conversation before calling submit_verification_result`,
        voice: "nova",
        input_audio_format: this.inputAudioFormat,
        output_audio_format: "pcm16",
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
        modalities: ["text", "audio"],
        temperature: 0.7,
        max_response_output_tokens: "inf",
        tools: [{
          type: "function",
          name: "submit_verification_result",
          description: "Call this when the customer confirms or denies the order. MUST be called before ending the conversation.",
          parameters: {
            type: "object",
            properties: {
              confirmed: {
                type: "boolean",
                description: "true if customer confirmed the order, false if they denied or were unavailable",
              },
              customer_response: {
                type: "string",
                description: "Brief summary in English of what the customer said (e.g. 'customer confirmed order', 'customer wants to cancel', 'customer asked to call later')",
              },
            },
            required: ["confirmed", "customer_response"],
          },
        }],
        tool_choice: "auto",
      },
    };

    this.send(sessionConfig);
    logger.info("Session update sent with function calling");
  }

  private handleMessage(data: WebSocket.RawData): void {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case "session.created":
          logger.info("OpenAI session created");
          break;

        case "session.updated":
          logger.info("OpenAI session updated");
          break;

        case "conversation.item.created":
          break;

        case "conversation.item.input_audio_transcription.completed":
          if (msg.transcript) {
            this.conversationItems.push({
              role: "customer",
              text: msg.transcript,
              timestamp: Date.now(),
            });
            this.callbacks?.onTranscript(msg.transcript, "customer");
          }
          break;

        case "response.audio.delta":
          if (msg.delta) {
            this.callbacks?.onAudioDelta(msg.delta);
          }
          break;

        case "response.audio_transcript.delta":
          if (msg.delta) {
            this.callbacks?.onTranscript(msg.delta, "ai");
          }
          break;

        case "response.audio.done":
          break;

        case "response.function_call_arguments.delta":
          this.functionCallArgs += msg.delta || "";
          break;

        case "response.function_call_arguments.done":
          this.handleFunctionCallDone(msg.name, this.functionCallArgs);
          this.functionCallArgs = "";
          break;

        case "response.done":
          break;

        case "error":
          logger.error({ error: msg.error }, "OpenAI API error");
          this.callbacks?.onError(new Error(msg.error?.message || "OpenAI API error"));
          break;

        case "input_audio_buffer.speech_started":
          logger.debug("Customer started speaking");
          break;

        case "input_audio_buffer.speech_stopped":
          logger.debug("Customer stopped speaking");
          break;

        case "rate_limits.updated":
          break;

        default:
          break;
      }
    } catch (err) {
      logger.error({ error: err, data: data.toString().substring(0, 200) }, "Failed to parse OpenAI message");
    }
  }

  private handleFunctionCallDone(name: string, argsJson: string): void {
    if (name !== "submit_verification_result") {
      logger.warn({ name }, "Unknown function called");
      return;
    }

    try {
      const args = JSON.parse(argsJson);
      logger.info({ args }, "Verification result received from OpenAI");

      this.send({
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: name,
          output: JSON.stringify({ success: true }),
        },
      });

      this.callbacks?.onResult?.({
        confirmed: args.confirmed === true,
        customerResponse: args.customer_response || "",
      });
    } catch (err) {
      logger.error({ error: err, args: argsJson }, "Failed to parse function call arguments");
    }
  }

  private startConversationTimer(): void {
    this.stopConversationTimer();
    this.conversationTimer = setInterval(() => {
      const elapsed = Date.now() - this.lastActivityTimestamp;
      if (elapsed > CONVERSATION_TIMEOUT_MS) {
        logger.warn({ elapsed }, "Conversation timeout reached, disconnecting");
        this.callbacks?.onError(new Error("Conversation timeout"));
        this.disconnect();
      }
    }, 10_000);
  }

  private stopConversationTimer(): void {
    if (this.conversationTimer) {
      clearInterval(this.conversationTimer);
      this.conversationTimer = null;
    }
  }

  sendAudio(chunk: string): void {
    this.send({
      type: "input_audio_buffer.append",
      audio: chunk,
    });
  }

  commitAudioBuffer(): void {
    this.send({
      type: "input_audio_buffer.commit",
    });
  }

  triggerResponse(): void {
    this.send({
      type: "response.create",
      response: {
        modalities: ["text", "audio"],
      },
    });
  }

  addUserMessage(text: string): void {
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });
  }

  addSystemMessage(text: string): void {
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "system",
        content: [{ type: "text", text }],
      },
    });
  }

  cancelResponse(): void {
    this.send({
      type: "response.cancel",
    });
  }

  injectOrderDetails(
    orderNumber: string,
    customerName: string,
    items: string,
    total: string,
    paymentMethod: string,
  ): void {
    const message = `[ORDER CONTEXT] Order #${orderNumber} | Customer: ${customerName} | Items: ${items} | Total: ₹${total} | Payment: ${paymentMethod}. Call this customer to confirm their order.`;
    this.addSystemMessage(message);
    this.triggerResponse();
  }

  disconnect(): void {
    this.isDisconnecting = true;
    this.stopConversationTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getFullTranscript(): string {
    return this.conversationItems.map((item) =>
      `[${item.role === "customer" ? "Customer" : "AI"}]: ${item.text}`
    ).join("\n");
  }

  private send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get conversationDuration(): number {
    if (this.conversationItems.length === 0) return 0;
    const first = this.conversationItems[0].timestamp;
    const last = this.conversationItems[this.conversationItems.length - 1].timestamp;
    return last - first;
  }
}
