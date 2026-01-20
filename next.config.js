/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    exclude: [/\.map$/, /middleware-manifest\.json$/],
    runtimeCaching: [
      {
        // Cache MediaPipe WASM and JS from jsdelivr
        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe\/tasks-genai/,
        handler: "CacheFirst",
        options: {
          cacheName: "mediapipe-wasm-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache Model Weights from Google Storage
        urlPattern: /^https:\/\/storage\.googleapis\.com\/mediapipe-assets/,
        handler: "CacheFirst",
        options: {
          cacheName: "ai-models-cache",
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Cache other external assets like fonts and icons
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff2?)$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-assets-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        // API routes should always be NetworkOnly or NetworkFirst with no caching if they are dynamic
        urlPattern: /\/api\/.*$/,
        handler: "NetworkOnly",
      },
    ],
  },
});

// SAFETY CONSTANT: Remove localStorage from global if it exists on server
// This fixes issues where libraries (like nuqs) crash because they detect localStorage
// but it's not a functional Storage object in the Node environment.
if (typeof global !== 'undefined' && typeof global.localStorage !== 'undefined') {
  delete global.localStorage;
}

// Bundle analyzer wraps config when ANALYZE=true
const nextConfig = {
  images: {
    // Allow external images from any host by default; adjust patterns as needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Exclude terminal-chat from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  transpilePackages: [],
  distDir: '.next',
  outputFileTracingExcludes: {
    '*': ['terminal-chat/**']
  },
  // Force production build to proceed even with errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Use CommonJS export to avoid MODULE_TYPELESS_PACKAGE_JSON warning
// Enable bundle analysis when ANALYZE environment variable is set
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withPWA(nextConfig));