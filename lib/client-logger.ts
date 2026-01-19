export const serverLog = (message: string, data?: any) => {
    // Log to browser console as well
    console.log(message, data || '');

    // Send to server
    fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, data }),
    }).catch(err => {
        // Silently fail if log server is unreachable to avoid noise
        console.warn('Failed to send log to server:', err);
    });
};
