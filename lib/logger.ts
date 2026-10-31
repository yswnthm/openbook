/**
 * Simple logging utility that only prints to the console when running in development mode.
 * This prevents sensitive or verbose output from cluttering production logs.
 */
export function debugLog(...args: unknown[]) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
}
