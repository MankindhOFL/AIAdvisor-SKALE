import { defineChain } from "viem";

/**
 * SKALE Base Sepolia Testnet Configuration
 * Official testnet for SKALE x402 development
 */
export const skaleBaseSepolia = defineChain({
  id: 324705682,
  name: "SKALE Base Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Credits",
    symbol: "CREDIT",
  },
  rpcUrls: {
    default: {
      http: ["https://base-sepolia-testnet.skalenodes.com/v1/base-testnet"],
    },
  },
  blockExplorers: {
    default: {
      name: "SKALE Explorer",
      url: "https://base-sepolia-testnet-explorer.skalenodes.com",
    },
  },
  testnet: true,
});

/**
 * Payment token configuration for SKALE Base Sepolia
 */
export const PAYMENT_TOKENS = {
  AXIOS_USD: {
    address: "0x61a26022927096f444994dA1e53F0FD9487EAfcf" as `0x${string}`,
    name: "Axios USD",
    symbol: "AXUSD",
    decimals: 6,
  },
  BRIDGED_USDC: {
    address: "0x2e08028E3C4c2356572E096d8EF835cD5C6030bD" as `0x${string}`,
    name: "Bridged USDC",
    symbol: "USDC",
    decimals: 6,
  },
} as const;

export const DEFAULT_PAYMENT_TOKEN = PAYMENT_TOKENS.AXIOS_USD;
