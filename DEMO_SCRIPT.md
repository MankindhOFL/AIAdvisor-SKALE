# Demo Video Script - DeFi Advisor Agent

**Target Length**: 2-3 minutes  
**Goal**: Show the complete workflow from request to recommendation with x402 payments

---

## Scene 1: Introduction (15 seconds)

**[Screen: Title slide with logo/branding]**

**Narrator**:
> "Introducing the DeFi Advisor Agent - an AI-powered trading advisor that provides professional recommendations with built-in risk controls, powered by x402 payments on SKALE."

---

## Scene 2: The Problem (20 seconds)

**[Screen: Split screen showing overwhelming data sources]**

**Narrator**:
> "DeFi traders face information overload from dozens of sources, struggle with risk management, and often don't know whether to execute a trade. Our AI agent solves this by aggregating data, analyzing market conditions, and providing clear recommendations with automatic guardrails."

---

## Scene 3: Architecture Overview (25 seconds)

**[Screen: Architecture diagram animation]**

**Narrator**:
> "Here's how it works: A user agent sends a trade request and pays 0.1 USDC via x402. The advisor agent aggregates data from CoinGecko and DefiLlama, analyzes it using Claude AI, generates risk-appropriate guardrails, and returns an actionable recommendation. Everything is logged for complete auditability."

---

## Scene 4: Live Demo - Starting the Server (20 seconds)

**[Screen: Terminal 1 - Starting server]**

**Commands shown**:
```bash
cd defi-advisor-agent
npm run dev:server
```

**Narrator**:
> "Let's see it in action. First, we start the Advisor Agent server. It initializes with x402 payment protection, connects to Claude AI, and is ready to provide advice."

**[Highlight key server startup messages]**:
- "✅ AI Advisor initialized with Claude Sonnet 4"
- "✅ x402 payment middleware configured"
- "✅ Ready to accept requests"

---

## Scene 5: Live Demo - Client Request (45 seconds)

**[Screen: Split screen - Terminal 2 (client) on left, Server logs on right]**

**Commands shown**:
```bash
npm run dev:client
```

**Narrator**:
> "Now we run the user agent client, which sends three example trade requests."

**[Show first request]**:

**Client terminal**:
```
EXAMPLE 1: ETH -> USDC Swap
📤 Sending trade request...
[UserAgent] Payment required, processing...
[UserAgent] ✅ Payment settled! Tx: 0xabc123...
```

**Server terminal** (simultaneously):
```
[Server] Processing advice request: SWAP ETH -> USDC
[DataAggregator] Aggregating data...
[AIAdvisor] Analyzing trade...
[AIAdvisor] Recommendation: EXECUTE (confidence: 0.85)
```

**Narrator**:
> "The client automatically handles the x402 payment. The server aggregates market data, Claude analyzes the trade, and returns a recommendation."

**[Show detailed recommendation output]**:

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
  Market conditions favor swap to USDC.
```

**Narrator**:
> "Notice the AI provides a clear decision with confidence score and detailed reasoning."

---

## Scene 6: Risk Controls (25 seconds)

**[Screen: Zoom in on guardrails section]**

```
🛡️  GUARDRAILS:
  Max Slippage: 1.00%
  Max Amount: 100000000000000000
  Min Output: 324567890
  Deadline: 2024-12-16T15:30:00.000Z
  Requires Approval: NO
```

**Narrator**:
> "The agent automatically generates guardrails: slippage protection, position limits, timeouts, and approval requirements. These adapt based on the trade's risk level - conservative trades get tighter limits, aggressive trades get more flexibility."

---

## Scene 7: Multiple Scenarios (20 seconds)

**[Screen: Quick montage of 2nd and 3rd examples]**

**Show**:
- Example 2: High-risk trade → "Requires Approval: YES"
- Example 3: Stable trade → "Risk Level: LOW"

**Narrator**:
> "The agent handles different scenarios intelligently. High-risk trades require human approval. Stable trades get more favorable limits. Every decision is based on real market data and AI analysis."

---

## Scene 8: Audit Trail (15 seconds)

**[Screen: Show logs directory and file]**

**Commands shown**:
```bash
cat logs/audit-2024-12-16.jsonl | head
```

**Show log entries**:
```json
{"timestamp":1735123456,"type":"ADVICE_REQUEST",...}
{"timestamp":1735123457,"type":"PAYMENT","paymentTxHash":"0xabc..."}
```

**Narrator**:
> "Every interaction is logged with timestamps, transaction hashes, and reasoning - providing a complete audit trail for transparency and accountability."

---

## Scene 9: Key Features Recap (20 seconds)

**[Screen: Animated checklist]**

**Show checkmarks appearing**:
- ✅ x402 autonomous payments
- ✅ Multi-source data aggregation
- ✅ AI-powered analysis with Claude
- ✅ Risk-adjusted guardrails
- ✅ Explainable recommendations
- ✅ Complete audit trail

**Narrator**:
> "In summary: autonomous payments via x402, multi-source data, AI-powered decisions, automatic risk controls, clear explanations, and full auditability."

---

## Scene 10: Call to Action (15 seconds)

**[Screen: Project repository and resources]**

**Show**:
- GitHub: github.com/[username]/defi-advisor-agent
- Documentation: README.md
- Try it yourself: Quick start guide

**Narrator**:
> "Want to try it yourself? Check out the repository for complete documentation and setup instructions. Built for the SKALE Web3 Agentic Hackathon. Thank you!"

**[Screen: End card with project name and logo]**

---

## Technical Setup Notes

### Recording Tips

1. **Screen Recording**:
   - Use OBS Studio or similar
   - Record at 1920x1080 resolution
   - 30 FPS minimum

2. **Terminal Setup**:
   - Use large font (16pt+)
   - Enable syntax highlighting
   - Clear terminal before recording

3. **Timing**:
   - Keep terminal commands visible for 2-3 seconds
   - Pause briefly after each command output
   - Use slow typing or pre-recorded commands

4. **Highlighting**:
   - Use colored boxes or arrows to highlight key information
   - Zoom in on important text
   - Add subtle animations for transitions

### Audio Recording

1. **Voiceover**:
   - Use quality microphone
   - Record in quiet environment
   - Speak clearly and at moderate pace
   - Add background music (subtle, non-distracting)

2. **Sound Effects** (optional):
   - Payment confirmation: "cha-ching" sound
   - Success checkmark: soft "pop"
   - Transitions: subtle "whoosh"

### Post-Production

1. **Editing**:
   - Cut dead space between commands
   - Speed up long-running processes (2x)
   - Add captions for key points
   - Include project title/branding

2. **Graphics**:
   - Architecture diagram (animated)
   - Feature checklist (animated checkmarks)
   - Transaction flow visualization

3. **Final Polish**:
   - Color grading for consistency
   - Audio leveling
   - Export at 1080p H.264

---

## Alternative: Shorter Version (90 seconds)

If you need a condensed version:

1. **Introduction** (10s): Problem + solution
2. **Architecture** (15s): Quick diagram walkthrough  
3. **Live Demo** (40s): One complete request/response cycle
4. **Key Features** (15s): Rapid checklist
5. **Call to Action** (10s): Repository + resources

---

## B-Roll Ideas

- Code snippets scrolling
- Network transaction visualization
- Data flowing through system
- AI "thinking" animation
- Guardrail shield graphic
- Audit log entries appearing

---

## Upload Checklist

- [ ] Export in 1080p
- [ ] Add thumbnail (eye-catching design)
- [ ] Write description with:
  - Project overview
  - Tech stack
  - GitHub link
  - Hackathon track
- [ ] Tags: skale, web3, ai, defi, x402, blockchain
- [ ] Enable comments
- [ ] Add to playlist (if applicable)
- [ ] Share on Twitter with demo clip
