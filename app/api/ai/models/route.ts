import { NextResponse } from 'next/server';
import { MODEL_REGISTRY, getMissingApiKey } from '@/lib/ai/model-registry';

export async function GET() {
    const availability: Record<string, boolean> = {};
    for (const modelId of Object.keys(MODEL_REGISTRY)) {
        availability[modelId] = getMissingApiKey(modelId) === null;
    }
    return NextResponse.json(availability);
}
export const dynamic = 'force-dynamic';
