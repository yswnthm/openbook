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
        const cache = await caches.open(CACHE_NAME);
        const response = new Response(data, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': data.size.toString(),
                'X-Cache-Date': new Date().toISOString(),
            }
        });
        await cache.put(key, response);
    },

    /**
     * Retrieves a model from the cache as a Blob.
     */
    async get(key: string): Promise<Blob | null> {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(key);
        if (!response) return null;
        return await response.blob();
    },

    /**
     * Checks if a model exists in the cache.
     */
    async exists(key: string): Promise<boolean> {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(key);
        return !!response;
    },

    /**
     * Removes a model from the cache.
     */
    async delete(key: string): Promise<boolean> {
        const cache = await caches.open(CACHE_NAME);
        return await cache.delete(key);
    },

    /**
     * Clears all models from the cache.
     */
    async clear(): Promise<void> {
        await caches.delete(CACHE_NAME);
    }
};
