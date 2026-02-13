import { writeFile, appendFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import type { AuditLogEntry, TradeRequest, AdviceResponse } from "../shared/types";

/**
 * Audit logger for tracking all agent interactions
 */
export class AuditLogger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = join(process.cwd(), "logs");
    this.logFile = join(this.logDir, `audit-${new Date().toISOString().split("T")[0]}.jsonl`);

    this.initializeLogDirectory();
    console.log("[AuditLogger] Initialized - logging to:", this.logFile);
  }

  /**
   * Ensure log directory exists
   */
  private async initializeLogDirectory(): Promise<void> {
    if (!existsSync(this.logDir)) {
      await mkdir(this.logDir, { recursive: true });
      console.log("[AuditLogger] Created log directory:", this.logDir);
    }
  }

  /**
   * Write log entry
   */
  private async writeLog(entry: AuditLogEntry): Promise<void> {
    try {
      const logLine = JSON.stringify(entry) + "\n";
      await appendFile(this.logFile, logLine);
    } catch (error) {
      console.error("[AuditLogger] Failed to write log:", error);
    }
  }

  /**
   * Log advice request
   */
  async logAdviceRequest(request: TradeRequest): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      type: "ADVICE_REQUEST",
      tradeRequest: request,
    };

    await this.writeLog(entry);
  }

  /**
   * Log advice response
   */
  async logAdviceResponse(request: TradeRequest, response: AdviceResponse): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      type: "ADVICE_REQUEST",
      tradeRequest: request,
      advice: response,
    };

    await this.writeLog(entry);
  }

  /**
   * Log payment
   */
  async logPayment(txHash: string, amount: string, token: string): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      type: "PAYMENT",
      paymentTxHash: txHash,
    };

    await this.writeLog(entry);
    console.log(`[AuditLogger] Payment logged: ${txHash}`);
  }

  /**
   * Log trade execution
   */
  async logTradeExecution(
    request: TradeRequest,
    advice: AdviceResponse,
    executionTxHash: string,
    gasUsed?: string
  ): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      type: "TRADE_EXECUTION",
      tradeRequest: request,
      advice,
      executionTxHash,
      gasUsed,
    };

    await this.writeLog(entry);
    console.log(`[AuditLogger] Trade execution logged: ${executionTxHash}`);
  }

  /**
   * Log error
   */
  async logError(type: string, error: string): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: Date.now(),
      type: "ERROR",
      error: `${type}: ${error}`,
    };

    await this.writeLog(entry);
    console.error(`[AuditLogger] Error logged: ${error}`);
  }

  /**
   * Export logs as JSON array (for analysis)
   */
  async exportLogs(): Promise<AuditLogEntry[]> {
    try {
      const { readFile } = await import("fs/promises");
      const content = await readFile(this.logFile, "utf-8");
      const lines = content.trim().split("\n");
      return lines.map((line) => JSON.parse(line));
    } catch (error) {
      console.error("[AuditLogger] Failed to export logs:", error);
      return [];
    }
  }

  /**
   * Get summary statistics
   */
  async getSummary() {
    const logs = await this.exportLogs();

    const summary = {
      total: logs.length,
      byType: {
        adviceRequests: logs.filter((l) => l.type === "ADVICE_REQUEST").length,
        payments: logs.filter((l) => l.type === "PAYMENT").length,
        executions: logs.filter((l) => l.type === "TRADE_EXECUTION").length,
        errors: logs.filter((l) => l.type === "ERROR").length,
      },
      decisions: {
        execute: logs.filter((l) => l.advice?.recommendation.decision === "EXECUTE").length,
        hold: logs.filter((l) => l.advice?.recommendation.decision === "HOLD").length,
        reduce: logs.filter((l) => l.advice?.recommendation.decision === "REDUCE_AMOUNT").length,
        reject: logs.filter((l) => l.advice?.recommendation.decision === "REJECT").length,
      },
      avgConfidence:
        logs.filter((l) => l.advice).reduce((sum, l) => sum + (l.advice?.recommendation.confidence || 0), 0) /
        logs.filter((l) => l.advice).length || 0,
    };

    return summary;
  }
}
