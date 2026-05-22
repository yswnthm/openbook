export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

export interface RateLimiter {
    isLimitExceeded(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
}

// Simple in-memory fallback store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class MemoryRateLimiter implements RateLimiter {
    async isLimitExceeded(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
        const now = Date.now();
        const windowStart = Math.floor(now / (windowSeconds * 1000)) * (windowSeconds * 1000);
        const reset = Math.floor((windowStart + windowSeconds * 1000) / 1000);

        let data = rateLimitStore.get(key);
        if (!data || data.resetTime !== windowStart) {
            data = { count: 0, resetTime: windowStart };
        }

        data.count++;
        rateLimitStore.set(key, data);

        // Random cleanup of expired entries (1% chance)
        if (Math.random() < 0.01) {
            const cutoff = now - windowSeconds * 2 * 1000;
            for (const [k, v] of rateLimitStore.entries()) {
                if (v.resetTime < cutoff) {
                    rateLimitStore.delete(k);
                }
            }
        }

        const remaining = Math.max(0, limit - data.count);
        return {
            success: data.count <= limit,
            limit,
            remaining,
            reset,
        };
    }
}

export class UpstashRedisRateLimiter implements RateLimiter {
    private url: string;
    private token: string;
    private fallback: MemoryRateLimiter;

    constructor(url: string, token: string) {
        this.url = url.endsWith('/') ? url.slice(0, -1) : url;
        this.token = token;
        this.fallback = new MemoryRateLimiter();
    }

    async isLimitExceeded(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
        const redisKey = `ratelimit:${key}`;
        try {
            const response = await fetch(`${this.url}/pipeline`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    ['INCR', redisKey],
                    ['TTL', redisKey],
                ]),
                // Keep timeout low to fail fast and fall back to memory
                signal: AbortSignal.timeout(2000),
            });

            if (!response.ok) {
                throw new Error(`Upstash response failed with status ${response.status}`);
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length < 2) {
                throw new Error('Invalid pipeline response format');
            }

            const count = Number(data[0].result);
            let ttl = Number(data[1].result);

            if (ttl === -1) {
                // Key created without expiry, set expiration
                await fetch(`${this.url}/EXPIRE/${redisKey}/${windowSeconds}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                    signal: AbortSignal.timeout(1000),
                }).catch((e) => console.error('Failed to set rate limit expiration in Upstash Redis:', e));
                ttl = windowSeconds;
            }

            const remaining = Math.max(0, limit - count);
            const reset = Math.ceil(Date.now() / 1000) + (ttl >= 0 ? ttl : windowSeconds);

            return {
                success: count <= limit,
                limit,
                remaining,
                reset,
            };
        } catch (error) {
            console.warn('Upstash Redis rate limit failed. Falling back to MemoryRateLimiter. Error:', error);
            return this.fallback.isLimitExceeded(key, limit, windowSeconds);
        }
    }
}

export function getRateLimiter(): RateLimiter {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
        return new UpstashRedisRateLimiter(url, token);
    }
    return new MemoryRateLimiter();
}
