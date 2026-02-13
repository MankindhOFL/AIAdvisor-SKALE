# Deployment Guide

## Local Development (Recommended for Hackathon)

### Quick Start

```bash
# 1. Verify setup
npx tsx verify-setup.ts

# 2. Terminal 1 - Start server
npm run dev:server

# 3. Terminal 2 - Run client
npm run dev:client
```

## Production Deployment Options

### Option 1: Vercel (Recommended for API)

**Pros**: Free tier, automatic HTTPS, easy deployment  
**Cons**: Serverless (cold starts)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "src/server/index.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

### Option 2: Railway

**Pros**: Always-on, persistent instances, databases  
**Cons**: Paid after free tier

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**railway.toml**:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start:server"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
```

### Option 3: Digital Ocean App Platform

**Pros**: Full control, $5/month  
**Cons**: Requires payment

1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start:server`
3. Add environment variables
4. Deploy

### Option 4: Self-Hosted (VPS)

**Pros**: Maximum control, cheapest long-term  
**Cons**: Requires server management

```bash
# SSH into your server
ssh user@your-server.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone [your-repo]
cd defi-advisor-agent
npm install
npm run build

# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start dist/server/index.js --name defi-advisor

# Enable startup on boot
pm2 startup
pm2 save

# Setup nginx reverse proxy (optional but recommended)
sudo apt install nginx
```

**nginx config** (`/etc/nginx/sites-available/defi-advisor`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables for Production

### Required for Server

```env
# AI
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Wallet
ADVISOR_PRIVATE_KEY=0x...
ADVISOR_ADDRESS=0x...

# Network (use mainnet values)
SKALE_RPC_URL=https://mainnet.skalenodes.com/v1/[your-endpoint]
SKALE_CHAIN_ID=1273227453

# Payment
PAYMENT_TOKEN_ADDRESS=0x...
FACILITATOR_URL=https://facilitator.payai.network

# Server
PORT=3001
NODE_ENV=production
```

### Security Best Practices

1. **Never commit secrets**:
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use environment variable services**:
   - Vercel: Use Vercel dashboard
   - Railway: Use Railway dashboard
   - VPS: Use `.env` file with restricted permissions:
     ```bash
     chmod 600 .env
     ```

3. **Rotate keys regularly**:
   - Change API keys quarterly
   - Use separate keys for dev/prod

4. **Use secrets managers** (production):
   - AWS Secrets Manager
   - HashiCorp Vault
   - Google Secret Manager

## Monitoring & Logging

### Application Monitoring

**Option 1: Built-in Logging**
```bash
# View logs directory
ls -la logs/

# Monitor in real-time
tail -f logs/audit-*.jsonl
```

**Option 2: Log Aggregation**
- [Logtail](https://logtail.com) - Free tier
- [Papertrail](https://papertrailapp.com) - Free tier
- [Datadog](https://datadoghq.com) - 14-day trial

### Health Checks

Add to your monitoring:
```bash
# Endpoint
GET https://your-domain.com/health

# Expected response
{
  "status": "ok",
  "services": {...},
  "timestamp": "2024-12-16T..."
}
```

### Uptime Monitoring

Free services:
- [UptimeRobot](https://uptimerobot.com)
- [StatusCake](https://statuscake.com)
- [Pingdom](https://pingdom.com) - Limited free

## Performance Optimization

### 1. Caching

Add Redis for caching API responses:
```typescript
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

// Cache price data for 1 minute
await redis.setEx(`price:${token}`, 60, JSON.stringify(priceData));
```

### 2. Rate Limiting

Protect against abuse:
```typescript
import { rateLimit } from 'hono-rate-limiter';

app.use('/*', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
}));
```

### 3. Database

For high volume, add PostgreSQL:
```typescript
// Store audit logs in DB instead of files
await db.auditLogs.create({
  timestamp: Date.now(),
  type: 'ADVICE_REQUEST',
  data: request
});
```

## Scaling

### Horizontal Scaling

Use load balancer (e.g., nginx):
```nginx
upstream backend {
    server server1:3001;
    server server2:3001;
    server server3:3001;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

### Serverless Alternative

Convert to serverless functions:
```typescript
// vercel/functions/advice.ts
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono();
// ... your routes

export default handle(app);
```

## Maintenance

### Regular Tasks

1. **Update dependencies** (monthly):
   ```bash
   npm outdated
   npm update
   ```

2. **Review logs** (weekly):
   ```bash
   # Check for errors
   grep "ERROR" logs/*.jsonl

   # Analyze payment success rate
   grep "PAYMENT" logs/*.jsonl | wc -l
   ```

3. **Backup data** (daily):
   ```bash
   # Backup logs
   tar -czf backup-$(date +%Y%m%d).tar.gz logs/
   ```

4. **Monitor costs**:
   - Anthropic API usage
   - Hosting costs
   - Gas fees (SKALE is free but monitor sFUEL)

### Troubleshooting

**Server won't start**:
```bash
# Check port is available
lsof -i :3001

# Check logs
pm2 logs defi-advisor

# Restart
pm2 restart defi-advisor
```

**High memory usage**:
```bash
# Check memory
pm2 monit

# Increase memory limit
pm2 start --max-memory-restart 500M
```

**Payment failures**:
1. Check facilitator is up
2. Verify wallet has funds
3. Check network connectivity
4. Review x402 SDK version

## Rollback Plan

If issues occur:

1. **Revert to previous version**:
   ```bash
   git revert HEAD
   npm run build
   pm2 restart defi-advisor
   ```

2. **Scale down temporarily**:
   ```bash
   # Disable new requests
   # Maintain /health endpoint only
   ```

3. **Communicate with users**:
   - Status page
   - Twitter/Discord
   - Email (if applicable)

## Pre-Launch Checklist

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Health check returns 200
- [ ] Logs directory is writable
- [ ] SSL certificate installed
- [ ] Monitoring configured
- [ ] Backup system in place
- [ ] Documentation updated
- [ ] Team has access credentials
- [ ] Rollback plan tested

## Support

For deployment issues:
1. Check [troubleshooting guide](README.md#troubleshooting)
2. Review server logs
3. Contact team on Discord
4. Open GitHub issue

---

**Ready to deploy? Start with local testing, then move to Railway or Vercel for quick hackathon demos!**
