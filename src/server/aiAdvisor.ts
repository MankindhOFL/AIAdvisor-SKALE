import Anthropic from "@anthropic-ai/sdk";
import type {
  TradeRequest,
  MarketData,
  DeFiMetrics,
  SentimentData,
  AdvisorRecommendation,
  TradeGuardrails,
} from "../shared/types.ts";
import { aiConfig, riskConfig } from "../shared/config";

/**
 * AI Advisor using Claude for trade analysis
 */
export class AIAdvisor {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: aiConfig.anthropicApiKey,
    });
    console.log("[AIAdvisor] Initialized with Claude Sonnet 4");
  }

  /**
   * Generate trade advice using Claude
   */
  async analyzeTradeRequest(
    request: TradeRequest,
    marketData: {
      priceData: MarketData[];
      defiMetrics: DeFiMetrics[];
      sentiment: SentimentData;
    }
  ): Promise<AdvisorRecommendation> {
    console.log(`[AIAdvisor] Analyzing ${request.action} trade: ${request.fromToken} -> ${request.toToken}`);

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(request, marketData);

    try {
      const response = await this.client.messages.create({
        model: aiConfig.model,
        max_tokens: 2048,
        temperature: aiConfig.temperature,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Parse the JSON response
      const advice = JSON.parse(content.text) as AdvisorRecommendation;

      console.log(`[AIAdvisor] Recommendation: ${advice.decision} (confidence: ${advice.confidence})`);

      return advice;
    } catch (error) {
      console.error("[AIAdvisor] Error analyzing trade:", error);

      // Return conservative fallback recommendation
      return {
        decision: "HOLD",
        confidence: 0,
        reasoning: "Failed to analyze trade due to technical error. Recommending HOLD for safety.",
        riskLevel: "high",
        warnings: ["AI analysis failed", "Manual review required"],
      };
    }
  }

  /**
   * Generate risk-appropriate guardrails
   */
  generateGuardrails(
    request: TradeRequest,
    recommendation: AdvisorRecommendation
  ): TradeGuardrails {
    const amount = BigInt(request.amount);

    // Calculate maximum trade amount based on risk level
    let tradePercentage = riskConfig.maxTradePercentage;

    if (recommendation.riskLevel === "high") {
      tradePercentage *= 0.5; // 50% of max for high risk
    } else if (recommendation.riskLevel === "medium") {
      tradePercentage *= 0.75; // 75% of max for medium risk
    }

    const maxAmount = (amount * BigInt(Math.floor(tradePercentage * 100))) / BigInt(100);

    // Calculate minimum output with slippage protection
    const slippage = riskConfig.maxSlippage;
    const minOutput = (maxAmount * BigInt(Math.floor((1 - slippage) * 10000))) / BigInt(10000);

    // Set deadline
    const deadline = Math.floor(Date.now() / 1000) + riskConfig.tradeTimeoutSeconds;

    // Determine if human approval is required
    const requiresApproval =
      recommendation.riskLevel === "high" ||
      recommendation.confidence < 0.7 ||
      recommendation.decision === "REDUCE_AMOUNT";

    const guardrails: TradeGuardrails = {
      maxSlippage: riskConfig.maxSlippage,
      maxAmount: maxAmount.toString(),
      minOutput: minOutput.toString(),
      deadline,
      spendCap: request.amount,
      allowedTokens: [request.fromToken, request.toToken],
      requiresApproval,
    };

    console.log(`[AIAdvisor] Generated guardrails: maxAmount=${maxAmount}, requiresApproval=${requiresApproval}`);

    return guardrails;
  }

  /**
   * Build system prompt for Claude
   */
  private buildSystemPrompt(): string {
    return `You are an expert DeFi trading advisor AI. Your role is to analyze trading requests and provide actionable recommendations with clear reasoning.

When analyzing a trade, consider:
1. Market conditions (price trends, volatility, volume)
2. DeFi protocol health (TVL, APY, volume)
3. Market sentiment (bullish/bearish indicators)
4. User's risk profile (conservative/moderate/aggressive)
5. Trade size relative to market liquidity

You MUST respond with ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "decision": "EXECUTE" | "HOLD" | "REDUCE_AMOUNT" | "REJECT",
  "confidence": 0.0 to 1.0,
  "reasoning": "Clear explanation of your decision",
  "riskLevel": "low" | "medium" | "high",
  "expectedReturn": "optional estimate",
  "warnings": ["optional", "array", "of", "warnings"]
}

Decision Guidelines:
- EXECUTE: Trade looks favorable, market conditions good, acceptable risk
- HOLD: Wait for better conditions, but not rejecting outright
- REDUCE_AMOUNT: Trade is viable but risk is high, recommend smaller size
- REJECT: Poor market conditions, high risk, or unfavorable setup

Confidence Guidelines:
- 0.9-1.0: Very strong conviction, multiple positive signals
- 0.7-0.9: Good conviction, mostly positive signals
- 0.5-0.7: Moderate conviction, mixed signals
- 0.3-0.5: Low conviction, more negatives than positives
- 0.0-0.3: Very low conviction, mostly negative signals

Risk Level Guidelines:
- low: Stable market, good liquidity, established tokens
- medium: Some volatility, moderate liquidity, some uncertainty
- high: High volatility, low liquidity, or significant negative indicators`;
  }

  /**
   * Build user prompt with trade data
   */
  private buildUserPrompt(
    request: TradeRequest,
    marketData: {
      priceData: MarketData[];
      defiMetrics: DeFiMetrics[];
      sentiment: SentimentData;
    }
  ): string {
    const { priceData, defiMetrics, sentiment } = marketData;

    return `Analyze this DeFi trade request:

TRADE REQUEST:
- Action: ${request.action}
- From: ${request.fromToken}
- To: ${request.toToken}
- Amount: ${request.amount}
- User Risk Profile: ${request.userRiskProfile || "moderate"}

MARKET DATA:
${priceData.map((data) => `
${data.token}:
- Current Price: $${data.currentPrice.toFixed(2)}
- 24h Change: ${data.priceChange24h.toFixed(2)}%
- 24h Volume: $${(data.volume24h / 1_000_000).toFixed(2)}M
- Market Cap: $${(data.marketCap / 1_000_000).toFixed(2)}M
`).join("\n")}

DEFI METRICS:
${defiMetrics.map((metric) => `
${metric.protocol}:
- TVL: $${(metric.tvl / 1_000_000).toFixed(2)}M
- 24h Volume: $${(metric.volume24h / 1_000_000).toFixed(2)}M
`).join("\n")}

MARKET SENTIMENT:
- Overall: ${sentiment.sentiment.toUpperCase()}
- Score: ${sentiment.score.toFixed(2)} (-1 to +1)
- Fear & Greed Index: ${sentiment.indicators.fearGreedIndex || "N/A"}

Based on this data, provide your recommendation as a JSON object.`;
  }
}
