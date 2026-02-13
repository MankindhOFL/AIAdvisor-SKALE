#!/usr/bin/env tsx

/**
 * Setup verification script
 * Checks that all required configuration is present
 */

import "dotenv/config";
import { existsSync } from "fs";

interface CheckResult {
  name: string;
  status: "✅" | "❌" | "⚠️";
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, successMsg: string, failMsg: string): void {
  results.push({
    name,
    status: condition ? "✅" : "❌",
    message: condition ? successMsg : failMsg,
  });
}

function warn(name: string, message: string): void {
  results.push({
    name,
    status: "⚠️",
    message,
  });
}

console.log("🔍 DeFi Advisor Agent - Setup Verification\n");
console.log("=" .repeat(70));

// Check .env file exists
check(
  ".env file",
  existsSync(".env"),
  "Found .env file",
  "Missing .env file - copy from .env.example"
);

// Check required environment variables
const requiredVars = [
  "ANTHROPIC_API_KEY",
  "ADVISOR_PRIVATE_KEY",
  "ADVISOR_ADDRESS",
  "USER_PRIVATE_KEY",
];

for (const varName of requiredVars) {
  const value = process.env[varName];
  check(
    varName,
    !!value && value !== `your_${varName.toLowerCase()}_here` && value !== "0xYourPrivateKeyHere" && value !== "0xYourAddressHere",
    `Set: ${value?.substring(0, 10)}...`,
    `Missing or not configured`
  );
}

// Check optional but recommended vars
const optionalVars = [
  "FACILITATOR_URL",
  "PAYMENT_TOKEN_ADDRESS",
  "SKALE_RPC_URL",
];

for (const varName of optionalVars) {
  const value = process.env[varName];
  if (!value) {
    warn(varName, "Not set - using default");
  } else {
    check(
      varName,
      true,
      `Set: ${value.substring(0, 30)}...`,
      ""
    );
  }
}

// Check node_modules
check(
  "Dependencies",
  existsSync("node_modules"),
  "Installed",
  "Missing - run 'npm install'"
);

// Check TypeScript
try {
  require("typescript");
  check("TypeScript", true, "Available", "");
} catch {
  check("TypeScript", false, "", "Missing - will be installed with npm install");
}

// Check Anthropic SDK
try {
  require("@anthropic-ai/sdk");
  check("Anthropic SDK", true, "Installed", "");
} catch {
  check("Anthropic SDK", false, "", "Missing - run 'npm install'");
}

// Check x402 SDK
try {
  require("@x402/core");
  check("x402 Core", true, "Installed", "");
} catch {
  check("x402 Core", false, "", "Missing - run 'npm install'");
}

// Print results
console.log();
for (const result of results) {
  console.log(`${result.status} ${result.name.padEnd(25)} ${result.message}`);
}

// Summary
console.log("\n" + "=".repeat(70));

const failed = results.filter((r) => r.status === "❌").length;
const warnings = results.filter((r) => r.status === "⚠️").length;

if (failed === 0 && warnings === 0) {
  console.log("✅ All checks passed! You're ready to go.");
  console.log("\nNext steps:");
  console.log("  1. Start the server:  npm run dev:server");
  console.log("  2. Run the client:    npm run dev:client");
} else if (failed === 0) {
  console.log(`⚠️  ${warnings} warning(s) - using defaults. You can proceed.`);
  console.log("\nNext steps:");
  console.log("  1. Start the server:  npm run dev:server");
  console.log("  2. Run the client:    npm run dev:client");
} else {
  console.log(`❌ ${failed} check(s) failed. Please fix the issues above.`);
  console.log("\nCommon fixes:");
  console.log("  • Copy .env.example to .env:  cp .env.example .env");
  console.log("  • Install dependencies:       npm install");
  console.log("  • Configure your API keys and wallet addresses in .env");
  process.exit(1);
}

console.log("=".repeat(70) + "\n");
