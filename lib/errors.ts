/**
 * Custom error hierarchy for structured error handling.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class EtherscanApiError extends AppError {
  constructor(message: string, public readonly rawMessage?: string) {
    super(message, "ETHERSCAN_API_ERROR", 502);
    this.name = "EtherscanApiError";
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super(
      "API rate limit exceeded. Please try again in a moment.",
      "RATE_LIMIT",
      429,
    );
    this.name = "RateLimitError";
  }
}

export class WalletNotFoundError extends AppError {
  constructor(address: string) {
    super(
      `No on-chain activity found for ${address.slice(0, 10)}...`,
      "WALLET_NOT_FOUND",
      404,
    );
    this.name = "WalletNotFoundError";
  }
}

/** Type guard for MetaMask user rejection (code 4001) */
export function isUserRejection(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 4001
  );
}
