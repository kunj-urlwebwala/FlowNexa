import { WebSocketServer, WebSocket as WsClient } from "ws";
import { IncomingMessage } from "http";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { OpenAIClient } from "./openai-realtime";
import { getPendingOrder } from "../ai-calls/ai-calls.service";
import type {
  ExotelSessionEvent,
  BotMediaMessage,
  OrderContext,
  BotResultPayload,
  BotSessionState,
} from "./types";
import { BOT_DEFAULTS } from "./types";

const BOT_PORT = env.BOT_PORT;

class ExotelBotServer {
  private wss: WebSocketServer | null = null;
  private activeSessions: Map<string, BotSessionState> = new Map();
  private isShuttingDown = false;

  start(): void {
    this.wss = new WebSocketServer({ port: BOT_PORT });

    this.wss.on("listening", () => {
      logger.info({ port: BOT_PORT }, "Exotel AI Bot WebSocket server started");
      logger.info(`Connect Exotel Voicebot Applet to: ws://localhost:${BOT_PORT}`);
      logger.info(`For production, use: wss://your-domain.com:${BOT_PORT}`);
    });

    this.wss.on("connection", (exotelWs: WsClient, req: IncomingMessage) => {
      if (this.isShuttingDown) {
        exotelWs.close(1001, "Server shutting down");
        return;
      }

      if (this.activeSessions.size >= BOT_DEFAULTS.MAX_CONCURRENT_CALLS) {
        logger.warn({ active: this.activeSessions.size }, "Max concurrent calls reached, rejecting");
        exotelWs.close(1013, "Too many concurrent calls");
        return;
      }

      this.handleConnection(exotelWs, req);
    });

    this.wss.on("error", (err) => {
      logger.error({ error: err.message }, "Bot WebSocket server error");
    });
  }

  private handleConnection(exotelWs: WsClient, req: IncomingMessage): void {
    const clientIp = req.socket.remoteAddress || "unknown";
    const connectionId = `${clientIp}-${Date.now()}`;

    logger.info({ ip: clientIp, connectionId }, "New Exotel AgentStream connection");

    const session: BotSessionState = {
      streamSid: null,
      sampleRate: 24000,
      openaiConnected: false,
      audioBuffer: [],
      orderCtx: null,
      fullTranscript: "",
      resultSent: false,
      startedAt: Date.now(),
    };

    let openai: OpenAIClient | null = null;

    if (!env.OPENAI_API_KEY) {
      logger.error("OPENAI_API_KEY not configured");
      this.sendError(exotelWs, "Bot configuration error - OPENAI_API_KEY missing");
      return;
    }

    openai = new OpenAIClient();

    if (env.EXOTEL_AUDIO_FORMAT === "g711_ulaw" || env.EXOTEL_AUDIO_FORMAT === "g711_alaw") {
      openai.setInputAudioFormat(env.EXOTEL_AUDIO_FORMAT);
    }

    openai.connect(env.OPENAI_API_KEY, {
      onAudioDelta: (chunk: string) => {
        if (exotelWs.readyState === WsClient.OPEN && session.streamSid) {
          const msg: BotMediaMessage = {
            event: "media",
            stream_sid: session.streamSid,
            media: { chunk },
          };
          exotelWs.send(JSON.stringify(msg));
        }
      },

      onTranscript: (text: string, role: "customer" | "ai") => {
        const label = role === "customer" ? "Customer" : "AI";
        session.fullTranscript += `[${label}]: ${text}\n`;
        logger.info({ role: label, text }, `[${label}]: ${text}`);
      },

      onResult: (result: { confirmed: boolean; customerResponse: string }) => {
        if (session.resultSent || !session.orderCtx?.callRecordId) return;
        session.resultSent = true;

        this.sendResultToBackend({
          callRecordId: session.orderCtx.callRecordId,
          result: result.confirmed ? "CONFIRMED" : "DENIED",
          transcript: session.fullTranscript,
          summary: result.customerResponse,
        });
      },

      onError: (error: Error) => {
        logger.error({ error: error.message, connectionId }, "OpenAI client error");
        if (!session.resultSent && session.orderCtx?.callRecordId) {
          session.resultSent = true;
          this.sendResultToBackend({
            callRecordId: session.orderCtx.callRecordId,
            result: "ERROR",
            transcript: session.fullTranscript,
            summary: `OpenAI error: ${error.message}`,
          });
        }
      },

      onClose: () => {
        session.openaiConnected = false;
        logger.info("OpenAI connection closed");
      },
    });

    const callTimeout = setTimeout(() => {
      logger.warn({ connectionId, duration: Date.now() - session.startedAt }, "Call timeout reached, terminating");
      this.closeSession(exotelWs, openai, session, "Call timeout");
    }, BOT_DEFAULTS.MAX_CALL_DURATION_MS);

    exotelWs.on("message", (raw: Buffer) => {
      try {
        const msg: ExotelSessionEvent = JSON.parse(raw.toString());

        switch (msg.event) {
          case "Connected":
            logger.info({ connectionId }, "Exotel AgentStream connected");
            break;

          case "Start":
            session.streamSid = msg.start?.stream_sid || null;
            session.sampleRate = msg.start?.sample_rate || 24000;
            this.activeSessions.set(connectionId, session);

            if (msg.custom_parameters) {
              session.orderCtx = this.parseOrderContext(msg.custom_parameters);
              if (session.orderCtx) {
                logger.info({ orderCtx: session.orderCtx, connectionId }, "Order context received from Exotel");
              }
            }

            logger.info({
              streamSid: session.streamSid,
              sampleRate: session.sampleRate,
              hasOrderContext: !!session.orderCtx,
              connectionId,
            }, "Exotel stream started");

            exotelWs.send(JSON.stringify({
              event: "connected",
              stream_sid: session.streamSid,
            }));

            setTimeout(() => {
              if (openai?.isConnected) {
                session.openaiConnected = true;
                if (session.orderCtx) {
                  openai.injectOrderDetails(
                    session.orderCtx.orderNumber,
                    session.orderCtx.customerName,
                    session.orderCtx.items,
                    session.orderCtx.total,
                    session.orderCtx.paymentMethod,
                  );
                } else {
                  openai.triggerResponse();
                }
              }
            }, BOT_DEFAULTS.OPENAI_CONNECT_DELAY_MS);
            break;

          case "Media":
            if (msg.media?.chunk) {
              if (session.openaiConnected && openai?.isConnected) {
                openai.sendAudio(msg.media.chunk);
              } else {
                session.audioBuffer.push(msg.media.chunk);
              }
            }
            break;

          case "DTMF":
            logger.info({ digit: msg.dtmf?.digit, connectionId }, "DTMF received");
            break;

          case "Stop":
            logger.info({ streamSid: session.streamSid, reason: msg.reason }, "Exotel stream stopped");
            clearTimeout(callTimeout);
            this.closeSession(exotelWs, openai, session, msg.reason || "Stream stopped");
            break;

          case "Clear":
            logger.info("Exotel stream cleared");
            clearTimeout(callTimeout);
            this.closeSession(exotelWs, openai, session, "Stream cleared");
            break;

          default:
            logger.warn({ event: msg.event, connectionId }, "Unknown event from Exotel");
        }
      } catch (err) {
        logger.error({ error: err, raw: raw.toString().substring(0, 200), connectionId }, "Failed to parse Exotel message");
      }
    });

    const bufferFlushTimer = setInterval(() => {
      if (session.openaiConnected && openai?.isConnected && session.audioBuffer.length > 0) {
        logger.info({ count: session.audioBuffer.length, connectionId }, "Flushing audio buffer to OpenAI");
        for (const chunk of session.audioBuffer) {
          openai.sendAudio(chunk);
        }
        session.audioBuffer = [];
      }
    }, BOT_DEFAULTS.AUDIO_FLUSH_INTERVAL_MS);

    setTimeout(() => clearInterval(bufferFlushTimer), BOT_DEFAULTS.AUDIO_FLUSH_TIMEOUT_MS);

    exotelWs.on("close", () => {
      logger.info({ connectionId }, "Exotel AgentStream connection closed");
      clearTimeout(callTimeout);
      clearInterval(bufferFlushTimer);
      this.cleanupSession(connectionId, exotelWs, openai, session);
    });

    exotelWs.on("error", (err) => {
      logger.error({ error: err.message, connectionId }, "Exotel AgentStream connection error");
      clearTimeout(callTimeout);
      clearInterval(bufferFlushTimer);
      this.cleanupSession(connectionId, exotelWs, openai, session);
    });
  }

  private closeSession(
    exotelWs: WsClient,
    openai: OpenAIClient | null,
    session: BotSessionState,
    reason: string,
  ): void {
    if (!session.resultSent && session.orderCtx?.callRecordId) {
      session.resultSent = true;
      this.sendResultToBackend({
        callRecordId: session.orderCtx.callRecordId,
        result: "ERROR",
        transcript: session.fullTranscript,
        summary: `Call ended: ${reason}`,
      });
    }

    if (openai) {
      openai.disconnect();
    }

    try {
      if (exotelWs.readyState === WsClient.OPEN) {
        exotelWs.close();
      }
    } catch {
      // ignore close errors
    }
  }

  private cleanupSession(
    connectionId: string,
    exotelWs: WsClient,
    openai: OpenAIClient | null,
    session: BotSessionState,
  ): void {
    this.activeSessions.delete(connectionId);

    if (!session.resultSent && session.orderCtx?.callRecordId) {
      session.resultSent = true;
      this.sendResultToBackend({
        callRecordId: session.orderCtx.callRecordId,
        result: "ERROR",
        transcript: session.fullTranscript,
        summary: "Connection closed unexpectedly",
      });
    }

    if (openai) {
      openai.disconnect();
    }
  }

  private sendResultToBackend(payload: BotResultPayload): void {
    const url = `${env.APP_URL}/api/v1/ai-calls/bot-result`;

    logger.info({ payload }, "Sending bot result to backend");

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          logger.error({ status: res.status, statusText: res.statusText }, "Backend returned error for bot result");
        } else {
          logger.info({ callRecordId: payload.callRecordId, result: payload.result }, "Bot result sent successfully");
        }
      })
      .catch((err) => {
        logger.error({ error: err.message, url }, "Failed to send bot result to backend");
      });
  }

  private sendError(ws: WsClient, message: string): void {
    try {
      ws.send(JSON.stringify({ event: "error", message }));
      ws.close();
    } catch {
      // ignore
    }
  }

  private parseOrderContext(params: Record<string, string>): OrderContext | null {
    try {
      // Direct bot — params come as individual query params from streamurl (cr = callRecordId)
      const callRecordId = params.cr || params.callRecordId;
      if (callRecordId) {
        const pending = getPendingOrder(callRecordId);
        if (pending) {
          logger.info({ callRecordId, orderNumber: pending.orderNumber }, "Order context resolved from memory");
          return {
            orderId: pending.orderId,
            callRecordId: pending.callRecordId,
            orderNumber: pending.orderNumber,
            customerName: pending.customerName,
            items: pending.items,
            total: pending.total,
            paymentMethod: pending.paymentMethod,
            attemptNumber: 1,
          };
        }
        logger.warn({ callRecordId }, "No pending order found in memory");
      }

      // Fallback: old flow-based CustomField JSON
      const raw = params.CustomField || params.custom_field || params.data;
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return {
        orderId: parsed.orderId || "",
        callRecordId: parsed.callRecordId || "",
        orderNumber: parsed.orderNumber || "",
        customerName: parsed.customerName || "Customer",
        items: parsed.items || "",
        total: parsed.total || "0",
        paymentMethod: parsed.paymentMethod || "",
        attemptNumber: parseInt(parsed.attemptNumber || "1", 10),
      };
    } catch {
      logger.warn({ params }, "Failed to parse order context from Exotel parameters");
      return null;
    }
  }

  stop(): void {
    this.isShuttingDown = true;

    logger.info({ activeSessions: this.activeSessions.size }, "Shutting down Exotel AI Bot server");

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    logger.info("Exotel AI Bot WebSocket server stopped");
  }

  get activeCallCount(): number {
    return this.activeSessions.size;
  }
}

export const exotelBotServer = new ExotelBotServer();
