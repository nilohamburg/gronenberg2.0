// Simple rate limiter for client-side requests
class RateLimiter {
  private tokens: number
  private maxTokens: number
  private refillRate: number // tokens per millisecond
  private lastRefill: number

  constructor(maxTokens: number, refillRatePerSecond: number) {
    this.tokens = maxTokens
    this.maxTokens = maxTokens
    this.refillRate = refillRatePerSecond / 1000
    this.lastRefill = Date.now()
  }

  async acquire(cost = 1): Promise<boolean> {
    // Refill tokens based on time elapsed
    this.refill()

    if (this.tokens >= cost) {
      this.tokens -= cost
      return true
    }

    // If not enough tokens, wait and try again
    const waitTime = Math.ceil((cost - this.tokens) / this.refillRate)
    await new Promise((resolve) => setTimeout(resolve, waitTime))

    // Refill again after waiting
    this.refill()

    if (this.tokens >= cost) {
      this.tokens -= cost
      return true
    }

    return false
  }

  private refill(): void {
    const now = Date.now()
    const elapsed = now - this.lastRefill
    const newTokens = elapsed * this.refillRate

    if (newTokens > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens)
      this.lastRefill = now
    }
  }
}

// Create a global rate limiter instance (5 requests per second)
export const globalRateLimiter = new RateLimiter(5, 5)

