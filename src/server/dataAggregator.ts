import axios from "axios";
import type {
  MarketData,
  DeFiMetrics,
  SentimentData,
  DataSourceResult,
} from "../shared/types.ts";
import { dataSourceConfig } from "../shared/config";

/**
 * Aggregates data from multiple sources for AI analysis
 */
export class DataAggregator {
  /**
   * Fetch price data from CoinGecko
   */
  async fetchPriceData(tokenSymbol: string): Promise<DataSourceResult<MarketData>> {
    try {
      // Map common token symbols to CoinGecko IDs
      const tokenMap: Record<string, string> = {
        ETH: "ethereum",
        WETH: "weth",
        USDC: "usd-coin",
        USDT: "tether",
        DAI: "dai",
        WBTC: "wrapped-bitcoin",
        BTC: "bitcoin",
      };

      const coinId = tokenMap[tokenSymbol.toUpperCase()] || tokenSymbol.toLowerCase();

      const response = await axios.get(
        `${dataSourceConfig.coingeckoUrl}/coins/${coinId}`,
        {
          params: {
            localization: false,
            tickers: false,
            community_data: false,
            developer_data: false,
          },
          timeout: 5000,
        }
      );

      const data = response.data;

      const marketData: MarketData = {
        token: tokenSymbol,
        currentPrice: data.market_data.current_price.usd,
        priceChange24h: data.market_data.price_change_percentage_24h,
        volume24h: data.market_data.total_volume.usd,
        marketCap: data.market_data.market_cap.usd,
        source: "CoinGecko",
        timestamp: Date.now(),
      };

      return {
        success: true,
        data: marketData,
        source: "CoinGecko",
        fetchedAt: Date.now(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`[DataAggregator] Failed to fetch price data for ${tokenSymbol}:`, message);

      return {
        success: false,
        error: message,
        source: "CoinGecko",
        fetchedAt: Date.now(),
      };
    }
  }

  /**
   * Fetch DeFi protocol metrics from DefiLlama
   */
  async fetchDeFiMetrics(protocol: string = "skale"): Promise<DataSourceResult<DeFiMetrics>> {
    try {
      const response = await axios.get(
        `${dataSourceConfig.defillamaUrl}/protocol/${protocol}`,
        { timeout: 5000 }
      );

      const data = response.data;

      const metrics: DeFiMetrics = {
        protocol: data.name,
        tvl: data.tvl || 0,
        apy: 0, // DefiLlama doesn't always provide APY in basic endpoint
        volume24h: data.volume24h || 0,
        source: "DefiLlama",
      };

      return {
        success: true,
        data: metrics,
        source: "DefiLlama",
        fetchedAt: Date.now(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`[DataAggregator] Failed to fetch DeFi metrics for ${protocol}:`, message);

      return {
        success: false,
        error: message,
        source: "DefiLlama",
        fetchedAt: Date.now(),
      };
    }
  }

  /**
   * Generate sentiment analysis
   * In production, this would integrate with sentiment APIs
   * For hackathon, we generate based on price movements
   */
  async analyzeSentiment(marketData: MarketData[]): Promise<DataSourceResult<SentimentData>> {
    try {
      // Simple sentiment based on 24h price change
      const avgPriceChange =
        marketData.reduce((sum, data) => sum + data.priceChange24h, 0) / marketData.length;

      let sentiment: "bullish" | "bearish" | "neutral";
      let score: number;

      if (avgPriceChange > 5) {
        sentiment = "bullish";
        score = Math.min(avgPriceChange / 10, 1);
      } else if (avgPriceChange < -5) {
        sentiment = "bearish";
        score = Math.max(avgPriceChange / 10, -1);
      } else {
        sentiment = "neutral";
        score = avgPriceChange / 10;
      }

      // Simulate fear & greed index (0-100)
      const fearGreedIndex = Math.round(((score + 1) / 2) * 100);

      const sentimentData: SentimentData = {
        sentiment,
        score,
        indicators: {
          fearGreedIndex,
          socialVolume: Math.random() * 1000, // Simulated
          newsScore: score,
        },
        source: "Internal Analysis",
      };

      return {
        success: true,
        data: sentimentData,
        source: "Internal Analysis",
        fetchedAt: Date.now(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[DataAggregator] Failed to analyze sentiment:", message);

      return {
        success: false,
        error: message,
        source: "Internal Analysis",
        fetchedAt: Date.now(),
      };
    }
  }

  /**
   * Aggregate all data sources for a trade
   */
  async aggregateTradeData(fromToken: string, toToken: string) {
    console.log(`[DataAggregator] Aggregating data for ${fromToken} -> ${toToken}`);

    // Fetch data in parallel
    const [fromPriceResult, toPriceResult, defiMetricsResult] = await Promise.all([
      this.fetchPriceData(fromToken),
      this.fetchPriceData(toToken),
      this.fetchDeFiMetrics("skale"),
    ]);

    // Collect successful price data
    const priceData: MarketData[] = [];
    if (fromPriceResult.success && fromPriceResult.data) {
      priceData.push(fromPriceResult.data);
    }
    if (toPriceResult.success && toPriceResult.data) {
      priceData.push(toPriceResult.data);
    }

    // Analyze sentiment based on price data
    const sentimentResult = await this.analyzeSentiment(priceData);

    // Collect DeFi metrics
    const defiMetrics: DeFiMetrics[] = [];
    if (defiMetricsResult.success && defiMetricsResult.data) {
      defiMetrics.push(defiMetricsResult.data);
    }

    return {
      priceData,
      defiMetrics,
      sentiment: sentimentResult.data || {
        sentiment: "neutral" as const,
        score: 0,
        indicators: {},
        source: "Fallback",
      },
      errors: [
        !fromPriceResult.success && fromPriceResult.error,
        !toPriceResult.success && toPriceResult.error,
        !defiMetricsResult.success && defiMetricsResult.error,
        !sentimentResult.success && sentimentResult.error,
      ].filter(Boolean) as string[],
    };
  }
}
