import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, formatUnits } from "viem";
import type { TradeRequest, AdviceResponse } from "../shared/types.js";
import { clientConfig, networkConfig, paymentConfig } from "../shared/config.js";
import { skaleBaseSepolia } from "../shared/chain.js";

type ClientResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  paymentTxHash?: string;
};

/**
 * User Agent - Requests trading advice from server
 * NOTE: x402 payment integration is ready but requires @x402/hono v2 package
 * For hackathon demo, this version works without automatic payments
 */
export class UserAgent {
  private walletAddress: string;
  private publicClient: ReturnType<typeof createPublicClient>;
  private serverUrl: string;

  private constructor(
    walletAddress: string,
    publicClient: ReturnType<typeof createPublicClient>,
    serverUrl: string
  ) {
    this.walletAddress = walletAddress;
    this.publicClient = publicClient;
    this.serverUrl = serverUrl;
  }

  /**
   * Create a new user agent instance
   */
  static async create(serverUrl?: string): Promise<UserAgent> {
    const privateKey = clientConfig.userPrivateKey;
    if (!privateKey) {
      throw new Error("USER_PRIVATE_KEY environment variable is required");
    }

    // Create wallet account
    const account = privateKeyToAccount(privateKey);

    // Setup public client for balance checks
    const publicClient = createPublicClient({
      chain: skaleBaseSepolia,
      transport: http(networkConfig.rpcUrl),
    });

    const url = serverUrl || clientConfig.serverUrl;

    console.log("[UserAgent] Initialized");
    console.log(`[UserAgent] Wallet: ${account.address}`);
    console.log(`[UserAgent] Server: ${url}`);

    return new UserAgent(account.address, publicClient, url);
  }

  /**
   * Check user's token balance
   */
  async checkBalance(): Promise<string> {
    try {
      // Simple balance check using public client
      // In production, you'd use ERC-20 balanceOf
      const balance = await this.publicClient.getBalance({
        address: this.walletAddress as `0x${string}`,
      });

      return formatUnits(balance, 18);
    } catch (error) {
      console.error("[UserAgent] Failed to check balance:", error);
      return "0";
    }
  }

  /**
   * Get trading advice from advisor agent
   * NOTE: In production, this would handle x402 payments automatically
   */
  async getAdvice(request: TradeRequest): Promise<ClientResult<AdviceResponse>> {
    const url = `${this.serverUrl}/api/advice`;

    console.log(`[UserAgent] Requesting advice: ${request.action} ${request.fromToken} -> ${request.toToken}`);

    try {
      // Make request
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Request failed: ${response.status} - ${errorText}`,
        };
      }

      const data = (await response.json()) as AdviceResponse;
      console.log("[UserAgent] ✅ Advice received");

      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[UserAgent] Error:", message);
      return { success: false, error: message };
    }
  }

  // Removed: handlePaymentRequired() - will be re-added when @x402/hono v2 is available

  /**
   * Display advice in a readable format
   */
  displayAdvice(advice: AdviceResponse): void {
    console.log("\n" + "=".repeat(70));
    console.log("📊 TRADING ADVICE");
    console.log("=".repeat(70));

    console.log("\n🎯 RECOMMENDATION:");
    console.log(`  Decision: ${advice.recommendation.decision}`);
    console.log(`  Confidence: ${(advice.recommendation.confidence * 100).toFixed(1)}%`);
    console.log(`  Risk Level: ${advice.recommendation.riskLevel.toUpperCase()}`);

    console.log("\n💭 REASONING:");
    console.log(`  ${advice.recommendation.reasoning}`);

    if (advice.recommendation.warnings && advice.recommendation.warnings.length > 0) {
      console.log("\n⚠️  WARNINGS:");
      advice.recommendation.warnings.forEach((warning) => {
        console.log(`  • ${warning}`);
      });
    }

    console.log("\n🛡️  GUARDRAILS:");
    console.log(`  Max Slippage: ${(advice.guardrails.maxSlippage * 100).toFixed(2)}%`);
    console.log(`  Max Amount: ${advice.guardrails.maxAmount}`);
    console.log(`  Min Output: ${advice.guardrails.minOutput}`);
    console.log(`  Deadline: ${new Date(advice.guardrails.deadline * 1000).toISOString()}`);
    console.log(`  Requires Approval: ${advice.guardrails.requiresApproval ? "YES" : "NO"}`);

    console.log("\n📈 MARKET ANALYSIS:");
    if (advice.marketAnalysis.priceData.length > 0) {
      advice.marketAnalysis.priceData.forEach((data) => {
        console.log(`  ${data.token}:`);
        console.log(`    Price: $${data.currentPrice.toFixed(2)}`);
        console.log(`    24h Change: ${data.priceChange24h.toFixed(2)}%`);
      });
    }

    console.log(`\n  Sentiment: ${advice.marketAnalysis.sentiment.sentiment.toUpperCase()}`);
    console.log(`  Score: ${advice.marketAnalysis.sentiment.score.toFixed(2)}`);

    if (advice.paymentTxHash) {
      console.log("\n💳 PAYMENT:");
      console.log(`  Transaction: ${advice.paymentTxHash}`);
    }

    console.log("\n" + "=".repeat(70));
  }

  /**
   * Get server info
   */
  async getServerInfo(): Promise<ClientResult<any>> {
    try {
      const response = await fetch(`${this.serverUrl}/api/info`);

      if (!response.ok) {
        return {
          success: false,
          error: `Request failed: ${response.status}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  /**
   * Check if server is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
