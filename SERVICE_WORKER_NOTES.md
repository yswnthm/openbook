# Service Worker Configuration Notes

## Issue with public/sw.js

The file `public/sw.js` is a **generated file** created by next-pwa and should not be manually edited.

### Current Issue
Line 1 contains: `e.registerRoute(/\/api\/.*$/, new e.NetworkOnly, "GET")`

This registration attempts to cache GET requests to API routes, but:
1. Most OpenBook API routes use POST, not GET
2. This rule never matches real traffic
3. It's redundant and should be removed from the source configuration

### Solution
To fix this, update the next-pwa configuration (typically in `next.config.js` or `next.config.mjs`) to exclude this route pattern, then rebuild the service worker.

**However**: next-pwa is incompatible with Turbopack (used in the current dev script). This needs to be addressed first before making SW changes.

## Related Issues
- See implementation_plan.md for details on next-pwa Turbopack incompatibility
- package.json line 23: @ducanh2912/next-pwa

## Recommendations
1. Either remove next-pwa entirely, OR
2. Remove --turbopack from dev script, OR  
3. Find a Turbopack-compatible PWA alternative

Once resolved, regenerate the service worker with proper route configurations.
