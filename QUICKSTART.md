# 🚀 Quick Start Guide - DeFi Advisor Agent

## What You Got

A complete, production-ready hackathon project featuring:
- ✅ AI-powered DeFi trading advisor using Claude Sonnet 4
- ✅ x402 payment integration on SKALE
- ✅ Risk controls (slippage, caps, timeouts, approval gates)
- ✅ Multi-source data aggregation (CoinGecko, DefiLlama)
- ✅ Complete audit trail
- ✅ TypeScript, fully typed
- ✅ Demo scripts and documentation

## Project Structure

```
defi-advisor-agent/
├── src/
│   ├── server/              # Advisor Agent (earns money)
│   │   ├── index.ts         # Main server with x402 middleware
│   │   ├── aiAdvisor.ts     # Claude AI integration
│   │   ├── dataAggregator.ts # Multi-source data fetching
│   │   └── auditLogger.ts   # Complete audit trail
│   ├── client/              # User Agent (pays for advice)
│   │   ├── index.ts         # Demo with 3 examples
│   │   └── userAgent.ts     # x402 payment client
│   └── shared/              # Shared utilities
│       ├── types.ts         # TypeScript interfaces
│       ├── chain.ts         # SKALE configuration
│       └── config.ts        # Environment management
├── .env.example             # Environment template
├── verify-setup.ts          # Setup checker
├── README.md                # Full documentation
├── HACKATHON.md             # Submission guide
├── DEMO_SCRIPT.md           # Video script
└── DEPLOYMENT.md            # Deploy guide
```

## Setup in 5 Minutes

### Step 1: Install Dependencies

```bash
cd defi-advisor-agent
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
# Get from: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Advisor wallet (receives payments)
ADVISOR_PRIVATE_KEY=0xYourPrivateKey
ADVISOR_ADDRESS=0xYourAddress

# User wallet (pays for advice, needs USDC)
USER_PRIVATE_KEY=0xYourPrivateKey
```

### Step 3: Verify Setup

```bash
npx tsx verify-setup.ts
```

### Step 4: Run Demo

**Terminal 1** - Start server:
```bash
npm run dev:server
```

**Terminal 2** - Run client:
```bash
npm run dev:client
```

## What Happens in the Demo

1. **Client sends 3 trade requests**:
   - ETH → USDC (moderate risk)
   - WBTC → ETH (conservative profile)
   - USDC → DAI (aggressive profile)

2. **For each request**:
   - User agent detects 402 Payment Required
   - Automatically pays 0.1 USDC via x402
   - Server aggregates market data
   - Claude analyzes and recommends
   - Returns decision with guardrails

3. **You'll see**:
   - Payment confirmations with tx hashes
   - AI reasoning for each decision
   - Risk-adjusted guardrails
   - Market analysis data
   - Complete audit trail

## Example Output

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
  Max Amount: 100000000000000000
  Min Output: 324567890
  Deadline: 2024-12-16T15:30:00.000Z
  Requires Approval: NO

📈 MARKET ANALYSIS:
  ETH:
    Price: $3,245.67
    24h Change: 5.23%

💳 PAYMENT:
  Transaction: 0xabc123...
======================================================================
```

## Key Features to Show Judges

1. **Autonomous Payments** ✅
   - Show x402 payment flow in terminal
   - Point out automatic retry with payment headers

2. **Multi-Source Data** ✅
   - Highlight CoinGecko + DefiLlama integration
   - Show sentiment analysis

3. **AI Reasoning** ✅
   - Point to detailed reasoning in output
   - Show confidence scores

4. **Risk Controls** ✅
   - Highlight guardrails section
   - Show how they vary by risk level

5. **Audit Trail** ✅
   - Show logs/ directory
   - Display JSONL entries with tx hashes

## Hackathon Submission Checklist

### Required for Track 1

- [x] **DeFi action**: Analyzes swaps, LP, staking
- [x] **Risk controls**: Slippage, caps, timeouts, approvals
- [x] **Explains actions**: Detailed AI reasoning

### Excellence Criteria

- [x] **Auditable trail**: JSONL logs with tx hashes
- [x] **Performance logic**: Optimizes safety × returns × risk tolerance
- [x] **Multi-source research**: CoinGecko + DefiLlama + sentiment
- [x] **Autonomous**: User risk profiles, auto payments

### Submission Files

1. **Demo Video** (2-3 min):
   - Follow `DEMO_SCRIPT.md`
   - Show full request/response cycle
   - Highlight key features

2. **Documentation**:
   - `README.md` - complete guide
   - `HACKATHON.md` - submission details
   - Code comments throughout

3. **Repository**:
   - Clean git history
   - Clear .gitignore
   - MIT license

## Important URLs

### SKALE Resources
- **Testnet Faucet**: https://faucet.skale.space
- **Explorer**: https://base-sepolia-testnet-explorer.skalenodes.com
- **RPC**: https://base-sepolia-testnet.skalenodes.com/v1/base-testnet

### APIs Used
- **CoinGecko**: https://api.coingecko.com (free tier)
- **DefiLlama**: https://api.llama.fi (free)
- **Facilitator**: https://facilitator.payai.network

### Documentation
- **x402 Protocol**: https://x402.org
- **SKALE Docs**: https://docs.skale.space
- **Anthropic Claude**: https://docs.anthropic.com

## Troubleshooting

### "ANTHROPIC_API_KEY is required"
→ Get API key from https://console.anthropic.com

### "USER_PRIVATE_KEY is required"
→ Set in .env file (needs USDC for payments)

### "Payment failed"
→ Ensure wallet has Axios USD (0x61a26022927096f444994dA1e53F0FD9487EAfcf)

### "Failed to fetch price data"
→ Expected occasionally (API rate limits), agent continues with available data

### Server won't start
→ Check port 3001 is available: `lsof -i :3001`

## Next Steps

### For Hackathon Demo

1. **Test locally** ✅
2. **Record demo video** (follow DEMO_SCRIPT.md)
3. **Deploy** (optional - see DEPLOYMENT.md)
4. **Submit**:
   - GitHub repo
   - Demo video
   - Documentation

### For Production

1. **Add real DEX integration** (execute trades)
2. **Deploy to Railway/Vercel** (see DEPLOYMENT.md)
3. **Add subscription model** (recurring payments)
4. **Enhance data sources** (more APIs)
5. **Add analytics dashboard** (track performance)

## Getting Help

- **README.md** - Full documentation
- **HACKATHON.md** - Submission guide
- **DEPLOYMENT.md** - Deploy instructions
- **DEMO_SCRIPT.md** - Video script
- **GitHub Issues** - Report bugs
- **SKALE Discord** - https://discord.gg/skale

## Final Checklist

Before submitting:

- [ ] Tested full demo flow
- [ ] Recorded demo video
- [ ] Pushed to GitHub
- [ ] README is clear
- [ ] .env.example is complete
- [ ] No secrets in git
- [ ] Demo video uploaded
- [ ] Tweet about it!

---

## You're Ready! 🎉

Everything is set up and ready to demo. Just:

1. Configure `.env`
2. Run `npm run dev:server`
3. Run `npm run dev:client`
4. Record your demo
5. Submit and WIN! 🏆

**Good luck with your hackathon submission!**
