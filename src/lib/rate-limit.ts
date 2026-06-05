// Dual-mode rate limiter: Upstash Redis in production, in-memory Map in dev

type RateLimitResult = { success: boolean; remaining: number; reset: number };

const LIMITS = {
  login:         { requests: 5,  windowMs: 15 * 60 * 1000 },
  contact:       { requests: 3,  windowMs: 60 * 60 * 1000 },
  newsletter:    { requests: 3,  windowMs: 60 * 60 * 1000 },
  upload:        { requests: 20, windowMs: 60 * 60 * 1000 },
  productMutate: { requests: 60, windowMs: 60 * 60 * 1000 },
  orderIntent:   { requests: 10, windowMs: 10 * 60 * 1000 },
  publicApi:     { requests: 60, windowMs: 60 * 1000 },
} as const;

export type RateLimitName = keyof typeof LIMITS;

// In-memory fallback store
const memStore = new Map<string, { count: number; resetAt: number }>();

async function checkUpstash(key: string, requests: number, windowMs: number): Promise<RateLimitResult> {
  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const windowSeconds = Math.floor(windowMs / 1000);
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    });

    const result = await ratelimit.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // Fall back to in-memory if Upstash fails
    return checkInMemory(key, requests, windowMs);
  }
}

function checkInMemory(key: string, requests: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const record = memStore.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    memStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: requests - 1, reset: resetAt };
  }

  if (record.count >= requests) {
    return { success: false, remaining: 0, reset: record.resetAt };
  }

  record.count++;
  return { success: true, remaining: requests - record.count, reset: record.resetAt };
}

export async function checkRateLimit(key: string, limitName: RateLimitName): Promise<RateLimitResult> {
  const config = LIMITS[limitName];
  const fullKey = `ratelimit:${limitName}:${key}`;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return checkUpstash(fullKey, config.requests, config.windowMs);
  }

  return checkInMemory(fullKey, config.requests, config.windowMs);
}

// Legacy sync function for backward compatibility
export function rateLimit(identifier: string, limit = 10, windowMs = 60_000): boolean {
  const result = checkInMemory(identifier, limit, windowMs);
  return result.success;
}
