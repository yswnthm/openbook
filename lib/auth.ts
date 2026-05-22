import { NextRequest } from 'next/server';

/**
 * DEVELOPMENT ONLY: Simple authentication check for API endpoints.
 * This is currently NOT active in production to prevent security risks.
 * For safety, in production environments this function will always return false.
 * In development, checks for Authorization header with Bearer token matching the bypass key.
 */
export function isAuthenticated(request: NextRequest): boolean {
    if (process.env.NODE_ENV === 'production') {
        // Auth is not active/available in production
        return false;
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // In development/testing, only accept the explicit development token
    return token === 'development-token-bypass';
}

/**
 * Extract user ID from request (development placeholder).
 * In development, returns a mock user ID based on the token.
 * In production, always returns null.
 */
export function getUserId(request: NextRequest): string | null {
    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    return `dev-user-${token.substring(0, 8)}`;
}
