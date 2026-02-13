/**
 * Trade analysis request from user
 */
export interface TradeRequest {
  action: "SWAP" | "ADD_LIQUIDITY" | "REMOVE_LIQUIDITY" | "STAKE" | "UNSTAKE";
  fromToken: string;
  toToken: string;
  amount: string;
  userRiskProfile?: "conservative" | "moderate" | "aggressive";
}

/**
 * Market data from external sources
 */
export interface MarketData {
  token: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  source: string;
  timestamp: number;
}

/**
 * DeFi protocol metrics
 */
export interface DeFiMetrics {
  protocol: string;
  tvl: number;
  apy: number;
  volume24h: number;
  userCount?: number;
  source: string;
}

/**
 * Sentiment analysis result
 */
export interface SentimentData {
  sentiment: "bullish" | "bearish" | "neutral";
  score: number; // -1 to 1
  indicators: {
    fearGreedIndex?: number;
    socialVolume?: number;
    newsScore?: number;
  };
  source: string;
}

/**
 * Risk control guardrails
 */
export interface TradeGuardrails {
  maxSlippage: number; // e.g., 0.01 for 1%
  maxAmount: string; // Max amount in wei/smallest unit
  minOutput: string; // Minimum output amount
  deadline: number; // Unix timestamp
  spendCap: string; // Maximum spend cap
  allowedTokens: string[]; // Whitelist of tokens
  requiresApproval: boolean;
}

/**
 * AI advisor recommendation
 */
export interface AdvisorRecommendation {
  decision: "EXECUTE" | "HOLD" | "REDUCE_AMOUNT" | "REJECT";
  confidence: number; // 0 to 1
  reasoning: string;
  riskLevel: "low" | "medium" | "high";
  expectedReturn?: string;
  warnings?: string[];
}

/**
 * Complete advice response
 */
export interface AdviceResponse {
  recommendation: AdvisorRecommendation;
  guardrails: TradeGuardrails;
  marketAnalysis: {
    priceData: MarketData[];
    defiMetrics: DeFiMetrics[];
    sentiment: SentimentData;
  };
  timestamp: number;
  paymentTxHash?: string;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  timestamp: number;
  type: "ADVICE_REQUEST" | "PAYMENT" | "TRADE_EXECUTION" | "ERROR";
  tradeRequest?: TradeRequest;
  advice?: AdviceResponse;
  executionTxHash?: string;
  paymentTxHash?: string;
  error?: string;
  gasUsed?: string;
}

/**
 * Data source result
 */
export interface DataSourceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
  fetchedAt: number;
}
