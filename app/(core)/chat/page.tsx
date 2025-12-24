'use client';
import dynamic from 'next/dynamic';

// Client-only chat component, deferred to reduce initial bundle size
const ChatClient = dynamic(() => import('../ChatClient'), { ssr: false });

// Only load StreakTester in development
const StreakTester = process.env.NODE_ENV !== 'production'
    ? dynamic(() => import('@/components/debug/StreakTester'), { ssr: false })
    : null;

export default function Page() {
    return (
        <>
            <ChatClient />
            {/* TODO: Remove after testing streak changes */}
            {/* {process.env.NODE_ENV !== 'production' && StreakTester && <StreakTester />} */}
        </>
    );
}
