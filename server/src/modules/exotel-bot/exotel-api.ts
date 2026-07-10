import { env } from "../../config/env";
import { logger } from "../../config/logger";

interface ExotelCallResponse {
  call: {
    sid: string;
    status: string;
    price: number | null;
    direction: string;
    from: string;
    to: string;
    account_sid: string;
    date_created: string;
  };
  error?: string;
}

export class ExotelApiClient {
  /**
   * Make an outbound call via Exotel Connect Voice AI (Direct Bot) API
   * Customer ko call karta hai → Exotel directly WebSocket se bot server se connect hota hai
   * No flow / applet setup needed on Exotel dashboard.
   */
  async connectDirectBot(
    customerPhone: string,
    callerId: string,
    botPublicUrl: string,
    callRecordId: string,
  ): Promise<ExotelCallResponse | null> {
    const { EXOTEL_ACCOUNT_SID, EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_API_DOMAIN } = env;

    if (!EXOTEL_ACCOUNT_SID || !EXOTEL_API_KEY || !EXOTEL_API_TOKEN) {
      logger.error("Exotel credentials not configured");
      return null;
    }

    const baseUrl = `https://${EXOTEL_API_DOMAIN}`;
    const auth = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString("base64");

    // Stream URL — Exotel sends query params as custom_parameters in Start event
    // sample-rate for audio quality, cr (callRecordId) for bot to look up order
    const streamUrl = `${botPublicUrl}/?sample-rate=24000&cr=${callRecordId}`;

    const params = new URLSearchParams({
      from: customerPhone,
      callerid: callerId,
      streamurl: streamUrl,
      streamtype: "bidirectional",
      statuscallback: `${env.APP_URL}/api/v1/ai-calls/exotel-callback`,
      statuscallbackevents: "terminal",
    });

    try {
      const response = await fetch(
        `${baseUrl}/v1/Accounts/${EXOTEL_ACCOUNT_SID}/Calls/connect`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      const data = (await response.json()) as ExotelCallResponse;
      logger.info(
        { sid: data.call?.sid, status: data.call?.status, from: data.call?.from, to: data.call?.to },
        "Exotel direct bot call initiated",
      );

      return data;
    } catch (error) {
      logger.error({ error, customerPhone }, "Failed to initiate Exotel direct bot call");
      return null;
    }
  }

  /**
   * Get call details from Exotel
   */
  async getCallDetails(callSid: string): Promise<ExotelCallResponse | null> {
    const { EXOTEL_ACCOUNT_SID, EXOTEL_API_KEY, EXOTEL_API_TOKEN, EXOTEL_API_DOMAIN } = env;

    if (!EXOTEL_ACCOUNT_SID || !EXOTEL_API_KEY || !EXOTEL_API_TOKEN) {
      return null;
    }

    const baseUrl = `https://${EXOTEL_API_DOMAIN}`;
    const auth = Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString("base64");

    try {
      const response = await fetch(
        `${baseUrl}/v1/Accounts/${EXOTEL_ACCOUNT_SID}/Calls/${callSid}`,
        {
          headers: {
            "Authorization": `Basic ${auth}`,
          },
        },
      );

      const data = (await response.json()) as ExotelCallResponse;
      return data;
    } catch (error) {
      logger.error({ error, callSid }, "Failed to fetch Exotel call details");
      return null;
    }
  }
}

export const exotelApi = new ExotelApiClient();
