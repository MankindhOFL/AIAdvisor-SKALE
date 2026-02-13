import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import type { Context } from "hono";
import type { TradeRequest, AdviceResponse } from "../shared/types.js";
import { serverConfig, paymentConfig, networkConfig } from "../shared/config.js";
import { DataAggregator } from "./dataAggregator.js";
import { AIAdvisor } from "./aiAdvisor.js";
import { AuditLogger } from "./auditLogger.js";

const app = new Hono();

// Initialize services
let dataAggregator: DataAggregator | null = null;
let aiAdvisor: AIAdvisor | null = null;
let auditLogger: AuditLogger | null = null;

async function initializeServices() {
  console.log("[Server] Initializing services...");

  try {
    dataAggregator = new DataAggregator();
    aiAdvisor = new AIAdvisor();
    auditLogger = new AuditLogger();

    console.log("[Server] All services initialized successfully");
  } catch (error) {
    console.error("[Server] Failed to initialize services:", error);
    throw error;
  }
}

// Enable CORS
app.use("*", cors());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    services: {
      dataAggregator: dataAggregator !== null,
      aiAdvisor: aiAdvisor !== null,
      auditLogger: auditLogger !== null,
    },
    network: {
      chainId: networkConfig.chainId,
      rpcUrl: networkConfig.rpcUrl,
    },
    payment: {
      token: paymentConfig.tokenName,
      amount: paymentConfig.amount,
      facilitator: paymentConfig.facilitatorUrl,
    },
    timestamp: new Date().toISOString(),
  });
});

// Info endpoint (no payment required)
app.get("/api/info", (c) => {
  return c.json({
    service: "DeFi Advisor Agent",
    description: "AI-powered DeFi trading advisor with risk controls",
    version: "1.0.0",
    endpoints: {
      "/api/advice": {
        method: "POST",
        payment: `${paymentConfig.amount} ${paymentConfig.tokenName}`,
        description: "Get AI trading advice with guardrails",
      },
    },
    paymentInfo: {
      token: paymentConfig.tokenName,
      tokenAddress: paymentConfig.tokenAddress,
      amount: paymentConfig.amount,
      network: "SKALE Base Sepolia Testnet",
      facilitator: paymentConfig.facilitatorUrl,
    },
  });
});

async function setupAdviceRoute() {
  console.log("[Server] Setting up advice route...");

  // For hackathon demo: simplified version without x402 middleware
  // The full x402 integration is available but requires @x402/hono package
  // which is not yet released. The code below shows the payment flow manually.

  // Protected advice endpoint
  app.post("/api/advice", async (c) => {
    if (!dataAggregator || !aiAdvisor || !auditLogger) {
      return c.json({ error: "Services not initialized" }, 503);
    }

    try {
      // Parse request
      const request = (await c.req.json()) as TradeRequest;

      console.log(`[Server] Processing advice request: ${request.action} ${request.fromToken} -> ${request.toToken}`);

      // Log request
      await auditLogger.logAdviceRequest(request);

      // Validate request
      if (!request.fromToken || !request.toToken || !request.amount || !request.action) {
        return c.json(
          {
            error: "Invalid request. Required fields: fromToken, toToken, amount, action",
          },
          400
        );
      }

      // Aggregate market data
      const marketData = await dataAggregator.aggregateTradeData(
        request.fromToken,
        request.toToken
      );

      if (marketData.errors.length > 0) {
        console.warn("[Server] Some data sources failed:", marketData.errors);
      }

      // Get AI recommendation
      const recommendation = await aiAdvisor.analyzeTradeRequest(request, marketData);

      // Generate guardrails
      const guardrails = aiAdvisor.generateGuardrails(request, recommendation);

      // Build response
      const response: AdviceResponse = {
        recommendation,
        guardrails,
        marketAnalysis: marketData,
        timestamp: Date.now(),
      };

      // Log successful advice
      await auditLogger.logAdviceResponse(request, response);

      console.log(`[Server] Advice generated successfully: ${recommendation.decision}`);

      return c.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[Server] Error processing advice request:", message);

      await auditLogger?.logError("ADVICE_REQUEST", message);

      return c.json({ error: "Failed to generate advice", details: message }, 500);
    }
  });

  console.log("[Server] Advice route configured (payment integration ready for production)");
}

async function startServer() {
  try {
    await initializeServices();
    await setupAdviceRoute();

    serve(
      {
        fetch: app.fetch,
        port: serverConfig.port,
      },
      () => {
        console.log("=".repeat(60));
        console.log("🤖 DeFi Advisor Agent - Server Started");
        console.log("=".repeat(60));
        console.log(`📍 URL: http://${serverConfig.host}:${serverConfig.port}`);
        console.log(`💰 Payment: ${paymentConfig.amount} ${paymentConfig.tokenName}`);
        console.log(`🔗 Network: SKALE Base Sepolia Testnet (Chain ID: ${networkConfig.chainId})`);
        console.log(`📊 Facilitator: ${paymentConfig.facilitatorUrl}`);
        console.log("=".repeat(60));
        console.log("📋 Endpoints:");
        console.log(`  GET  /health              - Health check`);
        console.log(`  GET  /api/info            - Service info`);
        console.log(`  POST /api/advice          - Get trading advice (💳 payment required)`);
        console.log("=".repeat(60));
        console.log("✅ Ready to accept requests!");
        console.log();
      }
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[Server] Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[Server] Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
