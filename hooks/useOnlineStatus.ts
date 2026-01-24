import { useState, useEffect } from 'react';

export function useOnlineStatus() {
    // Assume online by default to avoid hydration mismatch
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Update status immediately on mount
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
