import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, data } = body;

        // Print to server terminal with a distinctive prefix
        const timestamp = new Date().toISOString();
        console.log(`\x1b[36m[CLIENT-LOG] ${timestamp}\x1b[0m ${message}`, data ? JSON.stringify(data).slice(0, 200) : '');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
