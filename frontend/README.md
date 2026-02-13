# DeFi Advisor Agent - Frontend

Simple, functional web interface for the DeFi Advisor Agent.

## Features

- ✅ Clean, dark-themed UI
- ✅ Real-time server health checking
- ✅ Trade request form with validation
- ✅ AI recommendation display
- ✅ Risk controls visualization
- ✅ Market analysis cards
- ✅ Mobile responsive

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Backend Server

In the main project directory:
```bash
npm run dev:server
```

### 3. Start Frontend

```bash
npm run dev
```

The frontend will open at http://localhost:3000

## Usage

1. **Select trade parameters**:
   - Action (Swap, Add Liquidity, etc.)
   - From/To tokens
   - Amount
   - Risk profile

2. **Click "Get AI Advice"**

3. **View results**:
   - AI recommendation with confidence
   - Risk level indicator
   - Detailed reasoning
   - Risk guardrails
   - Market analysis

## Architecture

```
frontend/
├── index.html          # Main HTML with inline CSS
├── src/
│   └── main.js         # JavaScript logic
├── package.json
└── vite.config.js
```

## API Endpoint

The frontend connects to the backend at:
```
http://localhost:3001/api/advice
```

Make sure your backend server is running before using the frontend.

## Customization

### Change API URL

Edit `src/main.js`:
```javascript
const API_URL = 'http://your-server:3001';
```

### Modify Styling

All CSS is in `index.html` in the `<style>` tag for simplicity.

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory.

Deploy the `dist/` folder to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## Troubleshooting

### Server not responding
- Check backend is running: `npm run dev:server`
- Verify backend is on port 3001
- Check browser console for errors

### CORS issues
- Backend already has CORS enabled
- If issues persist, check server logs

### Port already in use
- Change port in `vite.config.js`:
  ```javascript
  server: { port: 3002 }
  ```

## Screenshots

The UI includes:
- Header with gradient title
- Two-column layout (form + results)
- Status indicators (loading, error, success)
- Formatted market data cards
- Color-coded recommendations
- Risk badges and warnings

---

**Simple. Functional. No fancy frameworks.** Just vanilla JavaScript that works.
