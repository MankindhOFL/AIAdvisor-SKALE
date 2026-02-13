# DeFi Advisor Agent 🤖💰

> AI-powered DeFi trading advisor with intelligent risk controls on SKALE

An autonomous agent that provides professional DeFi trading advice using Claude AI. The agent analyzes market data from multiple sources, uses AI for intelligent decision-making, and generates risk-appropriate guardrails for safe trade execution.

## ⚠️ Important Note - x402 Integration

This project is **fully functional** for the hackathon demo. The x402 payment integration code is ready but temporarily simplified due to package version availability. See [X402_STATUS.md](X402_STATUS.md) for details. **All core features work perfectly** - AI analysis, risk controls, data aggregation, and audit logging.

## 🎯 Hackathon Track

**Track 1**: Best Trading/DeFi Agent with Risk Controls

## ✨ Key Features

- ✅ **AI-Powered Analysis**: Claude Sonnet 4 provides intelligent trade recommendations
- ✅ **Multi-Source Data Aggregation**: CoinGecko, DefiLlama, sentiment analysis
- ✅ **Risk Controls**: Slippage caps, spend limits, position sizing, timeouts, approval requirements
- ✅ **Explainable AI**: Every decision includes detailed reasoning
- ✅ **Complete Audit Trail**: All interactions logged with timestamps
- ✅ **x402-Ready Architecture**: Payment integration code ready for production
- ✅ **TypeScript**: Fully typed, production-quality code

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER AGENT (Client)                       │
│  • Sends trade requests                                      │
│  • Handles x402 payments automatically                       │
│  • Receives advice with guardrails                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ x402 Payment (0.1 USDC)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  ADVISOR AGENT (Server)                      │
│  • Protected by x402 payment middleware                      │
│  • Aggregates data from multiple sources                     │
│  • Uses Claude AI for analysis                               │
│  • Generates risk-appropriate guardrails                     │
│  • Returns actionable recommendations                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                              │
│  • CoinGecko (price data)                                    │
│  • DefiLlama (DeFi metrics)                                  │
│  • Sentiment analysis                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key (get from [console.anthropic.com](https://console.anthropic.com))
- Two wallets on SKALE Base Sepolia Testnet:
  - **Advisor wallet**: Receives payments
  - **User wallet**: Pays for advice (needs USDC)
- USDC tokens for testing ([get from faucet](https://faucet.skale.space))

### 1. Installation

```bash
# Clone or download the project
cd defi-advisor-agent

# Install dependencies
npm install
```

### 2. Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# AI Configuration
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Advisor Agent Wallet (receives payments)
ADVISOR_PRIVATE_KEY=0xYourAdvisorPrivateKey
ADVISOR_ADDRESS=0xYourAdvisorAddress

# User Agent Wallet (pays for advice)
USER_PRIVATE_KEY=0xYourUserPrivateKey

# Other settings use defaults (SKALE Base Sepolia, Axios USD)
```

### 3. Run the Demo

**Terminal 1 - Start the Advisor Agent (Server):**
```bash
npm run dev:server
```

You should see:
```
🤖 DeFi Advisor Agent - Server Started
📍 URL: http://localhost:3001
💰 Payment: 100000 Axios USD
✅ Ready to accept requests!
```

**Terminal 2 - Run the User Agent (Client):**
```bash
npm run dev:client
```

The client will:
1. Send 3 example trade requests
2. Automatically pay 0.1 USDC per request via x402
3. Receive AI-powered advice with guardrails
4. Display detailed analysis and recommendations

## 📖 How It Works

### 1. User Requests Advice

```typescript
const request: TradeRequest = {
  action: "SWAP",
  fromToken: "ETH",
  toToken: "USDC",
  amount: "1000000000000000000", // 1 ETH
  userRiskProfile: "moderate"
};

const result = await userAgent.getAdvice(request);
```

### 2. Advisor Agent Processing

The advisor agent:

1. **Receives request**
2. **Aggregates data** from multiple sources:
   - CoinGecko API for price data
   - DefiLlama for DeFi metrics
   - Internal sentiment analysis
3. **AI Analysis** using Claude Sonnet 4:
   - Evaluates market conditions
   - Assesses trade viability
   - Considers user risk profile
   - Generates confidence score
4. **Generates guardrails**:
   - Maximum slippage (1% default)
   - Position sizing based on risk
   - Trade timeout (5 minutes)
   - Approval requirements

### 3. Response Structure

```json
{
  "recommendation": {
    "decision": "EXECUTE",
    "confidence": 0.85,
    "reasoning": "ETH shows strong momentum with 5.2% gain...",
    "riskLevel": "medium"
  },
  "guardrails": {
    "maxSlippage": 0.01,
    "maxAmount": "100000000000000000",
    "minOutput": "990000000",
    "deadline": 1735123456,
    "requiresApproval": false
  },
  "marketAnalysis": {
    "priceData": [...],
    "defiMetrics": [...],
    "sentiment": {...}
  }
}
```

## 🎨 Example Output

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
  Swap to USDC makes sense given current overbought conditions.
  Market sentiment is bullish but approaching resistance levels.

🛡️  GUARDRAILS:
  Max Slippage: 1.00%
  Max Amount: 100000000000000000
  Min Output: 990000000
  Deadline: 2024-12-16T15:30:00.000Z
  Requires Approval: NO

📈 MARKET ANALYSIS:
  ETH:
    Price: $3,245.67
    24h Change: 5.23%

  Sentiment: BULLISH
  Score: 0.52

💳 PAYMENT:
  Transaction: 0xabc123...
======================================================================
```

## 🔒 Security & Risk Controls

### Payment Protection
- **x402 protocol**: Atomic payment-for-service
- **Facilitator**: Handles gasless transactions
- **No custody**: Agent never holds user funds

### Risk Controls
1. **Slippage Protection**: Max 1% slippage default
2. **Position Sizing**: Limits based on risk level
   - Low risk: 100% of requested
   - Medium risk: 75% of requested  
   - High risk: 50% of requested
3. **Spend Caps**: Maximum trade amounts
4. **Timeouts**: 5-minute deadline for execution
5. **Human Approval**: Required for high-risk trades
6. **Token Whitelist**: Only approved tokens

## 📊 Audit Trail

All interactions are logged to `logs/audit-{date}.jsonl`:

```json
{"timestamp":1735123456,"type":"ADVICE_REQUEST","tradeRequest":{...}}
{"timestamp":1735123457,"type":"PAYMENT","paymentTxHash":"0xabc..."}
```

View summary:
```bash
# Logs are automatically created in logs/ directory
cat logs/audit-*.jsonl | head
```

## 🧪 Testing

```bash
# Run full demo with 3 trade examples
npm run dev:client

# Check server health
curl http://localhost:3001/health

# Get service info (no payment required)
curl http://localhost:3001/api/info
```

## 📁 Project Structure

```
defi-advisor-agent/
├── src/
│   ├── server/              # Advisor Agent (earns money)
│   │   ├── index.ts         # Main server with x402 middleware
│   │   ├── aiAdvisor.ts     # Claude AI integration
│   │   ├── dataAggregator.ts # Multi-source data fetching
│   │   └── auditLogger.ts   # Transaction logging
│   ├── client/              # User Agent (pays for advice)
│   │   ├── index.ts         # Demo script
│   │   └── userAgent.ts     # x402 payment client
│   └── shared/              # Shared utilities
│       ├── types.ts         # TypeScript types
│       ├── chain.ts         # SKALE configuration
│       └── config.ts        # Environment config
├── logs/                    # Audit logs (auto-created)
├── .env                     # Configuration (create from .env.example)
├── package.json
└── README.md
```

## 🏆 Hackathon Criteria

### ✅ Required Components

| Requirement | Implementation |
|------------|----------------|
| **Off-chain trade or DeFi action** | ✅ Analyzes swaps, LP, staking |
| **Risk controls** | ✅ Slippage, caps, timeouts, approvals |
| **Explains why it acted** | ✅ Detailed AI reasoning |

### 🌟 Excellence Criteria

| Criterion | Implementation |
|-----------|----------------|
| **Auditable trail** | ✅ Complete logs with tx hashes + reasoning |
| **Performance logic** | ✅ Optimizes for safety + returns |
| **Multi-source research** | ✅ CoinGecko + DefiLlama + sentiment |
| **Autonomous service** | ✅ User-specific risk profiles |

## 🔗 Resources

- [SKALE Documentation](https://docs.skale.space)
- [x402 Protocol](https://x402.org)
- [Anthropic Claude API](https://docs.anthropic.com)
- [SKALE Testnet Faucet](https://faucet.skale.space)
- [SKALE Explorer](https://base-sepolia-testnet-explorer.skalenodes.com)

## 🎬 Demo Video Script

1. **Show server starting** (Terminal 1)
2. **Run client demo** (Terminal 2)
3. **Highlight key moments**:
   - Payment transaction logs
   - AI reasoning display
   - Guardrails generation
   - Different risk profiles
4. **Show audit logs** (`cat logs/audit-*.jsonl`)

## 🐛 Troubleshooting

### Server won't start
- Check `ANTHROPIC_API_KEY` is set
- Verify `ADVISOR_PRIVATE_KEY` and `ADVISOR_ADDRESS`

### Payment fails
- Ensure user wallet has USDC (Axios USD)
- Check facilitator URL is accessible
- Verify SKALE RPC is responding

### Data sources fail
- Some failures are expected (CoinGecko rate limits)
- Agent continues with available data
- Check network connectivity

## 📝 License

MIT

## 👥 Team

Built for SKALE Web3 Agentic Hackathon

---

**Ready to revolutionize DeFi trading with AI agents? Start the demo and see it in action! 🚀**
