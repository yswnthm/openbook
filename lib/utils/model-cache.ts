/**
 * Utility for managing large model files in the browser's Cache API.
 * This is preferred over IndexedDB for large binary blobs as it's optimized for response-like data.
 */

const CACHE_NAME = 'openbook-models-v1';

export const modelCache = {
    /**
     * Stores a model (Blob/File) in the cache associated with a URL or unique ID.
     */
    async store(key: string, data: Blob): Promise<void> {
        if (typeof caches === 'undefined') return; // Feature guard
        try {
            const cache = await caches.open(CACHE_NAME);
            const response = new Response(data, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': data.size.toString(),
                    'X-Cache-Date': new Date().toISOString(),
                }
            });
            await cache.put(key, response);
        } catch (error: any) {
            if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22) {
                throw new Error(`Storage quota exceeded while trying to cache model ${key} (${data.size} bytes). Please clear space.`);
            }
            throw new Error(`Failed to cache model ${key}: ${error.message}`);
        }
    },

    /**
     * Retrieves a model from the cache as a Blob.
     */
    async get(key: string): Promise<Blob | null> {
        if (typeof caches === 'undefined') return null; // Feature guard
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(key);
        if (!response) return null;
        return await response.blob();
    },

    /**
     * Checks if a model exists in the cache.
     */
    async exists(key: string): Promise<boolean> {
        if (typeof caches === 'undefined') return false; // Feature guard
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(key);
        return !!response;
    },

    /**
     * Removes a model from the cache.
     */
    async delete(key: string): Promise<boolean> {
        if (typeof caches === 'undefined') return false; // Feature guard
        const cache = await caches.open(CACHE_NAME);
        return await cache.delete(key);
    },

    /**
     * Clears all models from the cache.
     */
    async clear(): Promise<void> {
        if (typeof caches === 'undefined') return; // Feature guard
        await caches.delete(CACHE_NAME);
    }
};
