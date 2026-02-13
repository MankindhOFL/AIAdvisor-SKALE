// Configuration
const API_URL = 'http://localhost:3001';

// DOM Elements
const form = document.getElementById('adviceForm');
const submitBtn = document.getElementById('submitBtn');
const status = document.getElementById('status');
const results = document.getElementById('results');
const emptyState = document.getElementById('emptyState');

// Form inputs
const actionInput = document.getElementById('action');
const fromTokenInput = document.getElementById('fromToken');
const toTokenInput = document.getElementById('toToken');
const amountInput = document.getElementById('amount');
const riskProfileInput = document.getElementById('riskProfile');

// Result elements
const decisionEl = document.getElementById('decision');
const confidenceEl = document.getElementById('confidence');
const riskBadgeEl = document.getElementById('riskBadge');
const reasoningEl = document.getElementById('reasoning');
const warningsContainer = document.getElementById('warningsContainer');
const guardrailsContent = document.getElementById('guardrailsContent');
const marketData = document.getElementById('marketData');

/**
 * Show status message
 */
function showStatus(message, type = 'loading') {
    status.className = `status show ${type}`;
    
    if (type === 'loading') {
        status.innerHTML = `<span class="spinner"></span>${message}`;
    } else {
        status.textContent = message;
    }
}

/**
 * Hide status message
 */
function hideStatus() {
    status.className = 'status';
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency
 */
function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(num);
}

/**
 * Format percentage
 */
function formatPercent(num) {
    const value = (num * 100).toFixed(2);
    return `${value}%`;
}

/**
 * Display recommendation
 */
function displayRecommendation(advice) {
    const { recommendation, guardrails, marketAnalysis } = advice;

    // Show results, hide empty state
    emptyState.style.display = 'none';
    results.classList.add('show');

    // Decision
    decisionEl.textContent = recommendation.decision;
    decisionEl.className = `decision ${recommendation.decision}`;

    // Confidence
    const confidencePercent = (recommendation.confidence * 100).toFixed(0);
    confidenceEl.textContent = `${confidencePercent}% Confidence`;

    // Risk level
    riskBadgeEl.textContent = recommendation.riskLevel.toUpperCase();
    riskBadgeEl.className = `risk-badge ${recommendation.riskLevel}`;

    // Reasoning
    reasoningEl.textContent = recommendation.reasoning;

    // Warnings
    if (recommendation.warnings && recommendation.warnings.length > 0) {
        warningsContainer.innerHTML = `
            <div class="warning">
                <h4>⚠️ Warnings</h4>
                <ul>
                    ${recommendation.warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        warningsContainer.innerHTML = '';
    }

    // Guardrails
    const deadline = new Date(guardrails.deadline * 1000).toLocaleString();
    
    guardrailsContent.innerHTML = `
        <div class="guardrail-item">
            <span class="guardrail-label">Max Slippage</span>
            <span class="guardrail-value">${formatPercent(guardrails.maxSlippage)}</span>
        </div>
        <div class="guardrail-item">
            <span class="guardrail-label">Max Amount</span>
            <span class="guardrail-value">${guardrails.maxAmount}</span>
        </div>
        <div class="guardrail-item">
            <span class="guardrail-label">Min Output</span>
            <span class="guardrail-value">${guardrails.minOutput}</span>
        </div>
        <div class="guardrail-item">
            <span class="guardrail-label">Deadline</span>
            <span class="guardrail-value">${deadline}</span>
        </div>
        <div class="guardrail-item">
            <span class="guardrail-label">Requires Approval</span>
            <span class="guardrail-value">${guardrails.requiresApproval ? 'YES' : 'NO'}</span>
        </div>
    `;

    // Market Data
    let marketHTML = '';

    // Price data
    if (marketAnalysis.priceData && marketAnalysis.priceData.length > 0) {
        marketAnalysis.priceData.forEach(data => {
            const changeClass = data.priceChange24h >= 0 ? 'positive' : 'negative';
            const changeSymbol = data.priceChange24h >= 0 ? '+' : '';

            marketHTML += `
                <div class="market-card">
                    <h4>${data.token}</h4>
                    <div class="market-stat">
                        <span class="label">Price</span>
                        <span class="value">${formatCurrency(data.currentPrice)}</span>
                    </div>
                    <div class="market-stat">
                        <span class="label">24h Change</span>
                        <span class="value ${changeClass}">${changeSymbol}${data.priceChange24h.toFixed(2)}%</span>
                    </div>
                    <div class="market-stat">
                        <span class="label">Volume</span>
                        <span class="value">${formatCurrency(data.volume24h)}</span>
                    </div>
                    <div class="market-stat">
                        <span class="label">Market Cap</span>
                        <span class="value">${formatCurrency(data.marketCap)}</span>
                    </div>
                </div>
            `;
        });
    }

    // Sentiment
    if (marketAnalysis.sentiment) {
        const sentimentColor = 
            marketAnalysis.sentiment.sentiment === 'bullish' ? 'positive' :
            marketAnalysis.sentiment.sentiment === 'bearish' ? 'negative' : '';

        marketHTML += `
            <div class="market-card">
                <h4>Market Sentiment</h4>
                <div class="market-stat">
                    <span class="label">Overall</span>
                    <span class="value ${sentimentColor}">${marketAnalysis.sentiment.sentiment.toUpperCase()}</span>
                </div>
                <div class="market-stat">
                    <span class="label">Score</span>
                    <span class="value">${marketAnalysis.sentiment.score.toFixed(2)}</span>
                </div>
                ${marketAnalysis.sentiment.indicators.fearGreedIndex ? `
                <div class="market-stat">
                    <span class="label">Fear & Greed</span>
                    <span class="value">${marketAnalysis.sentiment.indicators.fearGreedIndex}</span>
                </div>
                ` : ''}
            </div>
        `;
    }

    // DeFi Metrics
    if (marketAnalysis.defiMetrics && marketAnalysis.defiMetrics.length > 0) {
        marketAnalysis.defiMetrics.forEach(metric => {
            marketHTML += `
                <div class="market-card">
                    <h4>${metric.protocol}</h4>
                    <div class="market-stat">
                        <span class="label">TVL</span>
                        <span class="value">${formatCurrency(metric.tvl)}</span>
                    </div>
                    ${metric.volume24h ? `
                    <div class="market-stat">
                        <span class="label">24h Volume</span>
                        <span class="value">${formatCurrency(metric.volume24h)}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        });
    }

    marketData.innerHTML = marketHTML || '<p style="color: #8b92b0;">No market data available</p>';
}

/**
 * Get advice from server
 */
async function getAdvice(request) {
    try {
        const response = await fetch(`${API_URL}/api/advice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Check server health
 */
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Handle form submission
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable form
    submitBtn.disabled = true;

    // Check server
    showStatus('Checking server connection...', 'loading');
    const isHealthy = await checkServerHealth();

    if (!isHealthy) {
        showStatus('❌ Server is not responding. Please start the server first.', 'error');
        submitBtn.disabled = false;
        return;
    }

    // Prepare request
    const request = {
        action: actionInput.value,
        fromToken: fromTokenInput.value.trim(),
        toToken: toTokenInput.value.trim(),
        amount: amountInput.value.trim(),
        userRiskProfile: riskProfileInput.value
    };

    try {
        // Show loading
        showStatus('Analyzing trade request...', 'loading');

        // Get advice
        const advice = await getAdvice(request);

        // Hide status
        hideStatus();

        // Display results
        displayRecommendation(advice);

    } catch (error) {
        showStatus(`❌ Error: ${error.message}`, 'error');
        console.error('Error getting advice:', error);
    } finally {
        submitBtn.disabled = false;
    }
});

/**
 * Quick fill examples
 */
function setupExamples() {
    const examples = [
        { from: 'ETH', to: 'USDC', amount: '1000000000000000000' },
        { from: 'WBTC', to: 'ETH', amount: '50000000' },
        { from: 'USDC', to: 'DAI', amount: '100000000' }
    ];

    // You could add example buttons here if needed
}

// Initialize
setupExamples();

// Check server on load
window.addEventListener('load', async () => {
    const isHealthy = await checkServerHealth();
    
    if (!isHealthy) {
        showStatus('⚠️ Server not detected. Start server with: npm run dev:server', 'error');
    }
});
