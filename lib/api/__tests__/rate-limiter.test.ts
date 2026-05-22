import { describe, expect, test, mock, spyOn } from 'bun:test';
import { getRateLimiter, MemoryRateLimiter, UpstashRedisRateLimiter } from '../rate-limiter';

describe('MemoryRateLimiter', () => {
    test('allows requests within limit and restricts when exceeded', async () => {
        const limiter = new MemoryRateLimiter();
        const key = 'test-key-memory';

        // 1st request
        const res1 = await limiter.isLimitExceeded(key, 2, 60);
        expect(res1.success).toBe(true);
        expect(res1.remaining).toBe(1);
        expect(res1.limit).toBe(2);

        // 2nd request
        const res2 = await limiter.isLimitExceeded(key, 2, 60);
        expect(res2.success).toBe(true);
        expect(res2.remaining).toBe(0);

        // 3rd request (exceeded)
        const res3 = await limiter.isLimitExceeded(key, 2, 60);
        expect(res3.success).toBe(false);
        expect(res3.remaining).toBe(0);
    });
});

describe('UpstashRedisRateLimiter', () => {
    const mockUrl = 'https://mock-redis.upstash.io';
    const mockToken = 'mock-token';

    test('calls Upstash pipeline and returns correct limits on success', async () => {
        const limiter = new UpstashRedisRateLimiter(mockUrl, mockToken);
        
        // Mock global fetch
        const originalFetch = global.fetch;
        global.fetch = mock(async (url, init) => {
            if (url.toString().endsWith('/pipeline')) {
                return new Response(
                    JSON.stringify([
                        { result: 1 }, // INCR response: current count is 1
                        { result: 59 }, // TTL response: remaining time is 59s
                    ]),
                    { status: 200 }
                );
            }
            return new Response('Not Found', { status: 404 });
        }) as any;

        try {
            const res = await limiter.isLimitExceeded('test-key-redis', 5, 60);
            expect(res.success).toBe(true);
            expect(res.remaining).toBe(4);
            expect(res.limit).toBe(5);
        } finally {
            global.fetch = originalFetch;
        }
    });

    test('sets expiration if key is new (TTL is -1)', async () => {
        const limiter = new UpstashRedisRateLimiter(mockUrl, mockToken);
        
        let expireCalled = false;
        const originalFetch = global.fetch;
        global.fetch = mock(async (url, init) => {
            const urlStr = url.toString();
            if (urlStr.endsWith('/pipeline')) {
                return new Response(
                    JSON.stringify([
                        { result: 1 }, // INCR
                        { result: -1 }, // TTL is -1 (no expire set yet)
                    ]),
                    { status: 200 }
                );
            } else if (urlStr.includes('/EXPIRE/')) {
                expireCalled = true;
                return new Response(JSON.stringify({ result: 1 }), { status: 200 });
            }
            return new Response('Not Found', { status: 404 });
        }) as any;

        try {
            const res = await limiter.isLimitExceeded('test-key-new', 5, 60);
            expect(res.success).toBe(true);
            expect(res.remaining).toBe(4);
            expect(expireCalled).toBe(true);
        } finally {
            global.fetch = originalFetch;
        }
    });

    test('falls back to MemoryRateLimiter when Upstash connection fails', async () => {
        const limiter = new UpstashRedisRateLimiter(mockUrl, mockToken);
        
        const originalFetch = global.fetch;
        global.fetch = mock(async () => {
            throw new Error('Network error connecting to Upstash');
        }) as any;

        try {
            // First call falls back to MemoryRateLimiter (which should allow it)
            const res1 = await limiter.isLimitExceeded('fallback-key', 1, 60);
            expect(res1.success).toBe(true);

            // Second call exceeds the memory fallback limit
            const res2 = await limiter.isLimitExceeded('fallback-key', 1, 60);
            expect(res2.success).toBe(false);
        } finally {
            global.fetch = originalFetch;
        }
    });
});

describe('getRateLimiter', () => {
    const originalEnv = { ...process.env };

    test('returns MemoryRateLimiter when env vars are missing', () => {
        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
        delete process.env.KV_REST_API_URL;
        delete process.env.KV_REST_API_TOKEN;

        const limiter = getRateLimiter();
        expect(limiter).toBeInstanceOf(MemoryRateLimiter);
    });

    test('returns UpstashRedisRateLimiter when UPSTASH env vars are present', () => {
        process.env.UPSTASH_REDIS_REST_URL = 'https://upstash-url.com';
        process.env.UPSTASH_REDIS_REST_TOKEN = 'upstash-token';

        const limiter = getRateLimiter();
        expect(limiter).toBeInstanceOf(UpstashRedisRateLimiter);

        delete process.env.UPSTASH_REDIS_REST_URL;
        delete process.env.UPSTASH_REDIS_REST_TOKEN;
    });

    test('returns UpstashRedisRateLimiter when KV env vars are present', () => {
        process.env.KV_REST_API_URL = 'https://kv-url.com';
        process.env.KV_REST_API_TOKEN = 'kv-token';

        const limiter = getRateLimiter();
        expect(limiter).toBeInstanceOf(UpstashRedisRateLimiter);

        delete process.env.KV_REST_API_URL;
        delete process.env.KV_REST_API_TOKEN;
    });

    // Restore environment
    for (const key in originalEnv) {
        process.env[key] = originalEnv[key];
    }
});
