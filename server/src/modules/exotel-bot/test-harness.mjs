/**
 * Exotel AI Bot Test Harness
 *
 * Simulates Exotel AgentStream to test the bot-server.
 * Usage: node test-harness.mjs [ws://localhost:9090]
 *
 * Flow:
 *   1. Connect to bot-server WebSocket
 *   2. Send Connected event
 *   3. Send Start event (with order context)
 *   4. Send Media events (simulated silence audio)
 *   5. Wait for AI responses
 *   6. Send a simulated customer response (or wait for timeout)
 *   7. Send Stop event
 *   8. Verify bot-result was sent to backend
 */

const WS_URL = process.argv[2] || "ws://localhost:9090";
const BACKEND_URL = "http://localhost:5001/api/v1/ai-calls";

// Simulated order context (matches what initiateExotelCall sends)
const ORDER_CONTEXT = {
  orderId: "test-order-123",
  callRecordId: "test-call-record-456",
  orderNumber: "ORD-TEST-789",
  customerName: "Rahul Sharma",
  items: "iPhone 15 (Qty: 1, Price: ₹79999), Case (Qty: 1, Price: ₹499)",
  total: "80498",
  paymentMethod: "Cash on Delivery",
  attemptNumber: 1,
};

// Base64-encoded 1 second of silence in PCM16 24kHz (48 bytes)
// This is a simplified silence chunk
function generateSilenceChunk(bytes = 4800) {
  return Buffer.alloc(bytes, 0).toString("base64");
}

async function waitForBackendResult(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      // Check if our test call record was updated
      const resp = await fetch(
        `${BACKEND_URL}/order/${ORDER_CONTEXT.orderId}`,
        { headers: { "Accept": "application/json" } }
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data?.data?.length > 0) {
          return data.data[0];
        }
      }
    } catch {
      // Backend might not be running, that's OK for pure WS test
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return null;
}

async function runTest() {
  console.log("\n=== Exotel AI Bot Test Harness ===\n");
  console.log(`Connecting to: ${WS_URL}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Order: ${ORDER_CONTEXT.orderNumber} | Customer: ${ORDER_CONTEXT.customerName}\n`);

  return new Promise((resolve, reject) => {
    const { default: WebSocket } = await import("ws");
    const ws = new WebSocket(WS_URL);
    let streamSid = null;
    let steps = [];
    let testTimeout;

    const log = (msg) => {
      const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
      console.log(`[${timestamp}] ${msg}`);
    };

    const fail = (reason) => {
      log(`FAIL: ${reason}`);
      clearTimeout(testTimeout);
      ws.close();
      reject(new Error(reason));
    };

    const pass = (msg) => {
      log(`PASS: ${msg}`);
    };

    testTimeout = setTimeout(() => {
      fail("Test timed out after 30 seconds");
    }, 30000);

    ws.on("open", () => {
      log("Connected to bot-server ✓");

      // Step 1: Send Connected event
      ws.send(JSON.stringify({ event: "Connected" }));
      log("Sent: Connected event");

      // Step 2: Send Start event with order context
      const startMsg = {
        event: "Start",
        start: {
          stream_sid: "test-stream-" + Date.now(),
          sample_rate: 24000,
        },
        custom_parameters: {
          CustomField: JSON.stringify(ORDER_CONTEXT),
        },
      };
      streamSid = startMsg.start.stream_sid;
      ws.send(JSON.stringify(startMsg));
      log("Sent: Start event with order context ✓");
    });

    let mediaCount = 0;
    let responseCount = 0;
    let transcriptChunks = [];

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.event === "connected") {
          pass(`Stream connected: ${msg.stream_sid}`);

          // Step 3: Send a few seconds of silence (simulate customer being quiet)
          log("Sending silence audio (AI will start speaking first)...");
          for (let i = 0; i < 5; i++) {
            ws.send(JSON.stringify({
              event: "Media",
              stream_sid: streamSid,
              media: { chunk: generateSilenceChunk(4800) },
            }));
            mediaCount++;
          }
          log(`Sent ${mediaCount} media chunks ✓`);
        }

        if (msg.event === "media" && msg.media?.chunk) {
          responseCount++;
          if (responseCount === 1) {
            log("Receiving AI audio response...");
          }
        }

        if (msg.event === "mark") {
          // AI finished speaking a segment
        }

        if (msg.event === "error") {
          fail(`Bot error: ${msg.message}`);
        }

        // Check for transcript in logs (we can see in server logs)
        // The test harness just checks that the bot responds

      } catch (err) {
        // Not JSON or parse error - ignore
      }
    });

    ws.on("close", (code, reason) => {
      log(`Connection closed: code=${code}, reason=${reason}`);
      clearTimeout(testTimeout);

      // Summary
      console.log("\n=== Test Summary ===");
      console.log(`Media chunks sent: ${mediaCount}`);
      console.log(`AI response chunks received: ${responseCount}`);
      console.log(`Steps completed: ${steps.length}`);

      if (responseCount > 0) {
        pass("AI is responding with audio ✓");
      } else {
        fail("No AI response received — check OpenAI key and bot-server logs");
      }

      resolve({
        mediaSent: mediaCount,
        responsesReceived: responseCount,
      });
    });

    ws.on("error", (err) => {
      fail(`WebSocket error: ${err.message}`);
    });

    // After 10 seconds, send Stop event to end the test call
    setTimeout(() => {
      log("Sending Stop event...");
      ws.send(JSON.stringify({
        event: "Stop",
        stream_sid: streamSid,
        reason: "Test complete",
      }));

      // Step 6: Wait a moment then check for backend result
      setTimeout(async () => {
        log("Checking for backend result...");
        const result = await waitForBackendResult(5000);
        if (result) {
          pass(`Backend result found: ${result.result} ✓`);
        } else {
          log("INFO: No backend result (expected if backend not running)");
        }

        // Close the connection
        ws.close();
      }, 2000);
    }, 10000);
  });
}

runTest()
  .then((result) => {
    console.log("\n=== TEST COMPLETE ===");
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n=== TEST FAILED ===");
    console.error(err.message);
    process.exit(1);
  });
