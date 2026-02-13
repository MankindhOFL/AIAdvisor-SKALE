# Hackathon Submission: DeFi Advisor Agent

## Project Overview

**Name**: DeFi Advisor Agent  
**Track**: Track 1 - Best agent that trades, routes, hedges, farms, or manages positions with explicit safeguards  
**Team**: [Your Team Name]  
**Demo Video**: [YouTube Link]  
**Live Demo**: [Optional - if deployed]

## Elevator Pitch

An AI-powered DeFi trading advisor that charges users 0.1 USDC per consultation via x402 payments. The agent analyzes multiple data sources, provides intelligent trade recommendations with confidence scores, and generates risk-appropriate guardrails (slippage caps, position limits, timeouts). Every decision is explained and logged for complete auditability.

## Problem Statement

DeFi traders face three critical challenges:
1. **Information Overload**: Dozens of data sources, difficult to synthesize
2. **Risk Management**: Hard to set appropriate guardrails for each trade
3. **Decision Paralysis**: Uncertain whether to execute, wait, or modify trades

Manual analysis is time-consuming and error-prone. Users need an intelligent advisor that can:
- Aggregate data from multiple sources
- Provide clear recommendations with reasoning
- Generate safety guardrails automatically
- Operate autonomously with payments

## Solution

Our **DeFi Advisor Agent** solves this by:

1. **Autonomous Service Discovery**: Users pay 0.1 USDC via x402 to access advice
2. **Multi-Source Analysis**: Aggregates CoinGecko (prices), DefiLlama (DeFi metrics), and sentiment data
3. **AI-Powered Decisions**: Claude Sonnet 4 analyzes market conditions and user risk profile
4. **Risk-Adjusted Guardrails**: Automatically generates slippage limits, position sizes, and timeouts
5. **Explainable Recommendations**: Every decision includes detailed reasoning
6. **Complete Audit Trail**: All interactions logged with timestamps and tx hashes

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AGENT (Client)                       │
│  • x402 payment client (automatic)                           │
│  • Trade request builder                                     │
│  • Advice display and execution                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP + x402 Payment
                       ↓
┌─────────────────────────────────────────────────────────────┐
│             ADVISOR AGENT (Hono Server)                      │
│  • x402 payment middleware (stateless)                       │
│  • PayAI facilitator integration                             │
│  • Multi-threaded request handling                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   ANALYSIS PIPELINE                          │
│  1. Data Aggregator                                          │
│     • CoinGecko API (price, volume, market cap)              │
│     • DefiLlama API (TVL, DeFi metrics)                      │
│     • Sentiment analyzer (based on price movements)          │
│  2. AI Advisor (Claude Sonnet 4)                             │
│     • Market condition analysis                              │
│     • Risk assessment                                        │
│     • Decision generation with confidence                    │
│  3. Guardrail Generator                                      │
│     • Risk-based position sizing                             │
│     • Slippage protection                                    │
│     • Timeout enforcement                                    │
│     • Approval requirements                                  │
│  4. Audit Logger                                             │
│     • JSONL format logs                                      │
│     • Transaction hashes                                     │
│     • Reasoning capture                                      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Server** | Hono.js | Lightweight, fast HTTP server |
| **Payment** | x402 SDK | Payment protocol integration |
| **Facilitator** | PayAI | Gasless payment settlement |
| **AI** | Claude Sonnet 4 | Trade analysis and reasoning |
| **Blockchain** | SKALE Base Sepolia | Low-cost, fast transactions |
| **Data APIs** | CoinGecko, DefiLlama | Market and DeFi data |
| **Language** | TypeScript | Type-safe development |

## Key Features

### ✅ Required Components

1. **DeFi Actions**: Analyzes SWAP, ADD_LIQUIDITY, REMOVE_LIQUIDITY, STAKE, UNSTAKE
2. **Risk Controls**:
   - ✅ Spend caps (max trade amount based on risk)
   - ✅ Slippage bounds (1% default, adjustable)
   - ✅ Position sizing (50-100% based on risk level)
   - ✅ Timeouts (5-minute deadline)
   - ✅ Human approval (required for high risk)
3. **Explanations**: Every recommendation includes detailed reasoning

### 🌟 Excellence Criteria

1. **Auditable Trail**:
   - Complete JSONL logs
   - Transaction hashes
   - Reasoning codes
   - Timestamps
   
2. **Performance Logic**:
   - Optimizes for: Safety × Expected Returns × User Risk Tolerance
   - Multi-objective function balancing risk and reward
   
3. **Multi-Source Research**:
   - CoinGecko: Real-time price data
   - DefiLlama: DeFi protocol metrics
   - Internal: Sentiment analysis
   - AI: Synthesizes all sources
   
4. **Autonomous & Customized**:
   - User risk profiles (conservative/moderate/aggressive)
   - Automatic payment handling
   - Dynamic guardrail generation

## Code Quality

### Project Structure
```
src/
├── server/              # Advisor agent implementation
│   ├── index.ts         # Main server with x402 middleware
│   ├── aiAdvisor.ts     # Claude AI integration
│   ├── dataAggregator.ts # Multi-source data fetching
│   └── auditLogger.ts   # Complete audit trail
├── client/              # User agent implementation
│   ├── index.ts         # Demo and testing
│   └── userAgent.ts     # x402 payment client
└── shared/              # Shared types and utilities
    ├── types.ts         # TypeScript interfaces
    ├── chain.ts         # SKALE configuration
    └── config.ts        # Environment management
```

### Code Highlights

**Type Safety**: Full TypeScript with strict mode
```typescript
export interface TradeGuardrails {
  maxSlippage: number;
  maxAmount: string;
  minOutput: string;
  deadline: number;
  spendCap: string;
  allowedTokens: string[];
  requiresApproval: boolean;
}
```

**Error Handling**: Comprehensive try-catch with fallbacks
```typescript
try {
  const advice = await aiAdvisor.analyzeTradeRequest(request, marketData);
} catch (error) {
  // Return conservative fallback
  return {
    decision: "HOLD",
    reasoning: "Failed to analyze due to technical error",
  };
}
```

**Audit Logging**: Every action is logged
```typescript
await auditLogger.logAdviceRequest(request);
await auditLogger.logAdviceResponse(request, response);
await auditLogger.logPayment(txHash, amount, token);
```

## Demo Workflow

### Step 1: Start Advisor Agent
```bash
npm run dev:server
# Server starts on port 3001
# Ready to accept payment-protected requests
```

### Step 2: Run User Agent
```bash
npm run dev:client
# Sends 3 example trade requests
# Automatically handles x402 payments
# Displays AI recommendations with guardrails
```

### Step 3: View Results
```
======================================================================
📊 TRADING ADVICE
======================================================================

🎯 RECOMMENDATION:
  Decision: EXECUTE
  Confidence: 85.0%
  Risk Level: MEDIUM

💭 REASONING:
  ETH shows strong momentum with 5.2% 24h gain and healthy volume.
  Market conditions favor swap to USDC. Recommended position size
  allows for favorable execution while managing downside risk.

🛡️  GUARDRAILS:
  Max Slippage: 1.00%
  Max Amount: 100000000000000000 (0.1 ETH)
  Min Output: 324567890 (324.56 USDC)
  Deadline: 2024-12-16T15:30:00.000Z
  Requires Approval: NO

💳 PAYMENT:
  Transaction: 0xabc123...def456
======================================================================
```

## Testing & Validation

### Functional Testing
- ✅ Server health check
- ✅ x402 payment flow (402 → payment → retry → success)
- ✅ Data aggregation from multiple sources
- ✅ AI analysis with various market conditions
- ✅ Guardrail generation for different risk profiles
- ✅ Audit log creation and formatting

### Edge Cases Handled
- ✅ API failures (graceful degradation)
- ✅ Payment rejection (clear error messages)
- ✅ Missing data (proceeds with available sources)
- ✅ High risk trades (requires approval)
- ✅ Network timeouts (appropriate error handling)

### Security Considerations
- ✅ No private keys in code (environment variables)
- ✅ Input validation on all requests
- ✅ Rate limiting via facilitator
- ✅ Spend caps prevent excessive losses
- ✅ Audit trail for accountability

## Deployment Guide

### Local Development
```bash
# 1. Clone repository
git clone [repo-url]

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your keys and addresses

# 4. Start server
npm run dev:server

# 5. Run client (in another terminal)
npm run dev:client
```

### Production Deployment
```bash
# Build
npm run build

# Start server
npm start:server

# Or deploy to cloud (Vercel, Railway, etc.)
```

## Business Model

### Revenue Streams
1. **Pay-per-advice**: 0.1 USDC per consultation
2. **Subscription tiers**: Daily/weekly advice packages
3. **Premium features**: Real-time alerts, custom strategies

### Scalability
- Stateless server design
- Horizontal scaling via load balancer
- Cached data sources to reduce API costs
- Efficient x402 facilitator usage

## Future Enhancements

1. **Advanced Features**:
   - Real DEX integration (execute trades)
   - Portfolio management (track positions)
   - Strategy backtesting
   - Custom AI models per user

2. **Multi-Chain Support**:
   - Ethereum mainnet
   - Other SKALE chains
   - L2 networks

3. **Enhanced Risk Controls**:
   - Circuit breakers
   - Position correlation analysis
   - Dynamic risk scoring

4. **Social Features**:
   - Share strategies
   - Leaderboards
   - Performance tracking

## Conclusion

Our **DeFi Advisor Agent** demonstrates the power of combining:
- **x402 payments**: Autonomous agent monetization
- **AI intelligence**: Claude's reasoning capabilities
- **Risk management**: Comprehensive guardrails
- **Transparency**: Complete audit trail

This creates a trustworthy, autonomous service that users can rely on for DeFi trading decisions while maintaining full control and understanding of every recommendation.

## Resources

- **GitHub**: [Repository Link]
- **Demo Video**: [YouTube Link]
- **Documentation**: [Link to README]
- **Deployed App**: [Optional - if deployed]

## Team Contact

- **Team Lead**: [Name] - [Email]
- **GitHub**: [Username]
- **Twitter**: [Handle]
- **Discord**: [Username#0000]

---

**Built with ❤️ for SKALE Web3 Agentic Hackathon**
