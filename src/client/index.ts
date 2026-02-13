import { UserAgent } from "./userAgent";
import type { TradeRequest } from "../shared/types";
import { getExplorerLink } from "../shared/config";

/**
 * Demo script showing user agent requesting advice
 */
async function main() {
  console.log("🚀 DeFi Advisor Agent - Client Demo\n");

  try {
    // Initialize user agent
    console.log("Initializing User Agent...");
    const agent = await UserAgent.create();

    // Check server health
    console.log("\nChecking server health...");
    const isHealthy = await agent.checkHealth();
    if (!isHealthy) {
      console.error("❌ Server is not responding. Please start the server first.");
      console.log("\nTo start the server, run:");
      console.log("  npm run dev:server");
      process.exit(1);
    }
    console.log("✅ Server is healthy");

    // Get server info
    const infoResult = await agent.getServerInfo();
    if (infoResult.success && infoResult.data) {
      console.log("\n📋 Server Info:");
      console.log(`  Service: ${infoResult.data.service}`);
      console.log(`  Version: ${infoResult.data.version}`);
      console.log(`  Payment: ${infoResult.data.paymentInfo.amount} ${infoResult.data.paymentInfo.token}`);
    }

    // Example 1: ETH to USDC swap
    console.log("\n" + "=".repeat(70));
    console.log("EXAMPLE 1: ETH -> USDC Swap");
    console.log("=".repeat(70));

    const request1: TradeRequest = {
      action: "SWAP",
      fromToken: "ETH",
      toToken: "USDC",
      amount: "1000000000000000000", // 1 ETH in wei
      userRiskProfile: "moderate",
    };

    console.log("\n📤 Sending trade request...");
    const result1 = await agent.getAdvice(request1);

    if (result1.success && result1.data) {
      agent.displayAdvice(result1.data);

      if (result1.paymentTxHash) {
        console.log(`\n🔗 View payment: ${getExplorerLink(result1.paymentTxHash)}`);
      }
    } else {
      console.error("\n❌ Failed to get advice:", result1.error);
    }

    // Example 2: WBTC to ETH swap (high risk)
    console.log("\n" + "=".repeat(70));
    console.log("EXAMPLE 2: WBTC -> ETH Swap (Conservative Risk Profile)");
    console.log("=".repeat(70));

    const request2: TradeRequest = {
      action: "SWAP",
      fromToken: "WBTC",
      toToken: "ETH",
      amount: "50000000", // 0.5 WBTC (8 decimals)
      userRiskProfile: "conservative",
    };

    console.log("\n📤 Sending trade request...");
    const result2 = await agent.getAdvice(request2);

    if (result2.success && result2.data) {
      agent.displayAdvice(result2.data);

      if (result2.paymentTxHash) {
        console.log(`\n🔗 View payment: ${getExplorerLink(result2.paymentTxHash)}`);
      }
    } else {
      console.error("\n❌ Failed to get advice:", result2.error);
    }

    // Example 3: Small trade (low risk)
    console.log("\n" + "=".repeat(70));
    console.log("EXAMPLE 3: Small USDC -> DAI Swap");
    console.log("=".repeat(70));

    const request3: TradeRequest = {
      action: "SWAP",
      fromToken: "USDC",
      toToken: "DAI",
      amount: "100000000", // 100 USDC (6 decimals)
      userRiskProfile: "aggressive",
    };

    console.log("\n📤 Sending trade request...");
    const result3 = await agent.getAdvice(request3);

    if (result3.success && result3.data) {
      agent.displayAdvice(result3.data);

      if (result3.paymentTxHash) {
        console.log(`\n🔗 View payment: ${getExplorerLink(result3.paymentTxHash)}`);
      }
    } else {
      console.error("\n❌ Failed to get advice:", result3.error);
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ Demo completed successfully!");
    console.log("=".repeat(70));
    console.log("\n💡 Key Features Demonstrated:");
    console.log("  ✓ Autonomous x402 payment handling");
    console.log("  ✓ Multi-source data aggregation (CoinGecko, DefiLlama)");
    console.log("  ✓ AI-powered trade analysis with Claude");
    console.log("  ✓ Risk-adjusted guardrails (slippage, caps, timeouts)");
    console.log("  ✓ Detailed reasoning and explanations");
    console.log("  ✓ Audit trail (check logs/ directory)");
    console.log("\n");
  } catch (error) {
    console.error("\n❌ Demo failed:", error);
    console.log("\nTroubleshooting:");
    console.log("  1. Check your .env file is configured correctly");
    console.log("  2. Ensure server is running: npm run dev:server");
    console.log("  3. Verify your wallet has funds for payment");
    console.log("  4. Check that ANTHROPIC_API_KEY is set");
    process.exit(1);
  }
}

// Run the demo
main().catch(console.error);
