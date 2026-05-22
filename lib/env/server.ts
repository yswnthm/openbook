// https://env.t3.gg/docs/nextjs#create-your-schema
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
    server: {
        XAI_API_KEY: z.string().min(1).optional(),
        COHERE_API_KEY: z.string().min(1).optional(),
        MISTRAL_API_KEY: z.string().min(1).optional(),
        CEREBRAS_API_KEY: z.string().min(1).optional(),
        GROQ_API_KEY: z.string().min(1).optional(),
        E2B_API_KEY: z.string().min(1).optional(),
        ELEVENLABS_API_KEY: z.string().min(1).optional(),
        TAVILY_API_KEY: z.string().min(1).optional(),
        EXA_API_KEY: z.string().min(1).optional(),
        TMDB_API_KEY: z.string().min(1).optional(),
        YT_ENDPOINT: z.string().min(1).optional(),
        FIRECRAWL_API_KEY: z.string().min(1).optional(),
        OPENWEATHER_API_KEY: z.string().min(1).optional(),
        SANDBOX_TEMPLATE_ID: z.string().min(1).optional(),
        GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
        MAPBOX_ACCESS_TOKEN: z.string().min(1).optional(),
        TRIPADVISOR_API_KEY: z.string().min(1).optional(),
        AVIATION_STACK_API_KEY: z.string().min(1).optional(),
        CRON_SECRET: z.string().min(1).optional(),
        BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
        MEM0_API_KEY: z.string().min(1).optional(),
        MEM0_ORG_ID: z.string().min(1).optional(),
        MEM0_PROJECT_ID: z.string().min(1).optional(),
        SMITHERY_API_KEY: z.string().min(1).optional(),
        PROXY_IMAGE_ALLOWED_HOSTS: z.string().optional(),
        PROXY_IMAGE_SIZE_LIMIT: z.string().optional(),
        OPENAI_API_KEY: z.string().min(1).optional(),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
        OPENROUTER_API_KEY: z.string().min(1).optional(),
        HF_TOKEN: z.string().min(1).optional(),
        UPSTASH_REDIS_REST_URL: z.string().min(1).optional(),
        UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    },
    isServer: typeof window === 'undefined' || process.env.NODE_ENV === 'test',
});
