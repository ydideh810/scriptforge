interface RateLimitResult {
  success: boolean;
  timeRemaining: number;
}

class RateLimit {
  private requests: number[] = [];
  private readonly maxRequests: number = 10;
  private readonly timeWindow: number = 60000; // 1 minute

  async check(): Promise<RateLimitResult> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const timeRemaining = this.timeWindow - (now - oldestRequest);
      return { success: false, timeRemaining };
    }

    this.requests.push(now);
    return { success: true, timeRemaining: 0 };
  }
}

export const rateLimit = new RateLimit();