const SENSITIVE_KEYS = [
    'password', 'token', 'secret', 'authorization', 'creditCard', 'ssn', 'key'
];

function sanitizeData(data: any): any {
    if (!data) return data;
    if (typeof data === 'string') return data; // Could potentially scan strings too, but might be overkill

    if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    }

    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const key in data) {
            if (SENSITIVE_KEYS.some(sensitive => key.toLowerCase().includes(sensitive))) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = sanitizeData(data[key]);
            }
        }
        return sanitized;
    }

    return data;
}

export const serverLog = (message: string, data?: any) => {
    // Log to browser console as well - check environment if needed
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, data || '');
    }

    const cleanedData = sanitizeData(data);

    // Safe serialization to handle circular references
    let safeBody: string;
    try {
        safeBody = JSON.stringify({ message, data: cleanedData });
    } catch (err) {
        // Fallback for circular references or other stringify errors
        safeBody = JSON.stringify({ message, data: '[Circular or non-serializable data]' });
    }

    // Send to server
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: safeBody,
    }).catch(err => {
        // Silently fail if log server is unreachable to avoid noise
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Failed to send log to server:', err);
        }
    });
};
