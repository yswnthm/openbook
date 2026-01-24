import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ success: false, error: 'Logging disabled in production' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { message, data } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ success: false, error: 'Invalid message format' }, { status: 400 });
        }

        // Sanitize message: limit length and strip control characters
        const sanitizedMessage = message.slice(0, 1000).replace(/[\x00-\x1F\x7F]/g, '');

        // Print to server terminal with a distinctive prefix
        const timestamp = new Date().toISOString(); // UTC
        console.log(`\x1b[36m[CLIENT-LOG] ${timestamp}\x1b[0m ${sanitizedMessage}`, data ? JSON.stringify(data).slice(0, 500) : '');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
