import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { getRateLimiter } from '@/lib/api/rate-limiter';

export const config = {
    matcher: ['/api/:path*'],
};

const rateLimiter = getRateLimiter();

// Rate limit configurations
const LIMITS = {
    chat: { limit: 10, window: 60 },
    compact: { limit: 5, window: 60 },
    default: { limit: 60, window: 60 },
};

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}

function logRequest(
    ip: string,
    userAgent: string,
    path: string,
    status: number,
    duration: number,
    rateLimitRemaining: number,
) {
    const logData = {
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
        path,
        status,
        duration,
        rateLimitRemaining,
        type: 'api_request',
    };

    console.log(JSON.stringify(logData));
}

export default async function middleware(request: NextRequest) {
    const startTime = Date.now();
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const path = request.nextUrl.pathname;

    // Determine rate limit group based on path
    let limitGroup: 'chat' | 'compact' | 'default' = 'default';
    if (path.startsWith('/api/chat/compact')) {
        limitGroup = 'compact';
    } else if (path.startsWith('/api/chat') || path.startsWith('/api/study/')) {
        limitGroup = 'chat';
    }

    const { limit, window } = LIMITS[limitGroup];

    // Determine rate limit key
    const userId = getUserId(request);
    const key = userId 
        ? `user:${userId}:${limitGroup}` 
        : `ip:${ip}:${limitGroup}`;

    // Call the rate limiter
    const rateLimitResult = await rateLimiter.isLimitExceeded(key, limit, window);
    const remaining = rateLimitResult.remaining;

    // Check if rate limit exceeded
    if (!rateLimitResult.success) {
        const duration = Date.now() - startTime;
        logRequest(ip, userAgent, path, 429, duration, remaining);

        return NextResponse.json(
            { error: 'Too many requests', message: `Rate limit exceeded for group ${limitGroup}.` },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                    'Retry-After': window.toString(),
                },
            },
        );
    }

    // Continue to the API route
    const response = await NextResponse.next();

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    // Log the request
    const duration = Date.now() - startTime;
    const status = response.status;
    logRequest(ip, userAgent, path, status, duration, remaining);

    return response;
}
