import "dotenv/config";

/**
 * Validates that required environment variables are set
 */
function validateEnv(required: string[]): void {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please check your .env file and ensure all required variables are set.`
    );
  }
}

/**
 * Server configuration
 */
export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT || "3001"),
  host: process.env.SERVER_HOST || "localhost",
  advisorPrivateKey: process.env.ADVISOR_PRIVATE_KEY as `0x${string}`,
  advisorAddress: process.env.ADVISOR_ADDRESS as `0x${string}`,
};

// Validate server config
validateEnv(["ANTHROPIC_API_KEY", "ADVISOR_PRIVATE_KEY", "ADVISOR_ADDRESS"]);

/**
 * Client configuration
 */
export const clientConfig = {
  userPrivateKey: process.env.USER_PRIVATE_KEY as `0x${string}`,
  serverUrl: `http://${serverConfig.host}:${serverConfig.port}`,
};

// Validate client config when imported in client code
if (process.env.USER_PRIVATE_KEY) {
  validateEnv(["USER_PRIVATE_KEY"]);
}

/**
 * Network configuration
 */
export const networkConfig = {
  rpcUrl: process.env.SKALE_RPC_URL || "https://base-sepolia-testnet.skalenodes.com/v1/base-testnet",
  chainId: parseInt(process.env.SKALE_CHAIN_ID || "324705682"),
  explorerUrl: process.env.SKALE_EXPLORER_URL || "https://base-sepolia-testnet-explorer.skalenodes.com",
};

/**
 * Payment configuration
 */
export const paymentConfig = {
  tokenAddress: (process.env.PAYMENT_TOKEN_ADDRESS || "0x61a26022927096f444994dA1e53F0FD9487EAfcf") as `0x${string}`,
  tokenName: process.env.PAYMENT_TOKEN_NAME || "Axios USD",
  tokenDecimals: parseInt(process.env.PAYMENT_TOKEN_DECIMALS || "6"),
  amount: process.env.PAYMENT_AMOUNT || "100000", // 0.1 USDC
  facilitatorUrl: process.env.FACILITATOR_URL || "https://facilitator.payai.network",
};

/**
 * AI configuration
 */
export const aiConfig = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  model: "claude-sonnet-4-20250514",
  temperature: 0.7,
};

/**
 * Data source configuration
 */
export const dataSourceConfig = {
  coingeckoUrl: process.env.COINGECKO_API_URL || "https://api.coingecko.com/api/v3",
  defillamaUrl: process.env.DEFILLAMA_API_URL || "https://api.llama.fi",
};

/**
 * Risk control configuration
 */
export const riskConfig = {
  maxTradePercentage: parseFloat(process.env.MAX_TRADE_PERCENTAGE || "0.1"),
  maxSlippage: parseFloat(process.env.MAX_SLIPPAGE || "0.01"),
  tradeTimeoutSeconds: parseInt(process.env.TRADE_TIMEOUT_SECONDS || "300"),
};

/**
 * DEX configuration (optional)
 */
export const dexConfig = {
  routerAddress: process.env.DEX_ROUTER_ADDRESS as `0x${string}` | undefined,
};

/**
 * Get server URL for client
 */
export function getServerUrl(): string {
  return clientConfig.serverUrl;
}

/**
 * Get network display name
 */
export function getNetworkName(): string {
  return "SKALE Base Sepolia Testnet";
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: string, decimals: number = 6): string {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  return `${integerPart}.${fractionalPart.toString().padStart(decimals, "0")}`;
}

/**
 * Get explorer link for transaction
 */
export function getExplorerLink(txHash: string): string {
  return `${networkConfig.explorerUrl}/tx/${txHash}`;
}
