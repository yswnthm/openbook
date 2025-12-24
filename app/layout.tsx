import { GeistSans } from 'geist/font/sans';
import 'katex/dist/katex.min.css';
import './globals.css';

import { Metadata, Viewport } from 'next';
import { Syne, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';

export const metadata: Metadata = {
    metadataBase: new URL('https://goopenbook.in'),
    title: 'OpenBook',
    description: 'Your learning, your way.',
    openGraph: {
        url: 'https://goopenbook.in',
        siteName: 'OpenBook',
        title: 'OpenBook - Your learning, your way.',
        description:
            'An AI-powered knowledge exploration platform for information search, AI conversations, and academic research.',
        images: [
            {
                url: '/screenshots/main-interface.png',
                width: 1200,
                height: 630,
                alt: 'OpenBook Interface',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'OpenBook - Your learning, your way.',
        description:
            'An AI-powered knowledge exploration platform for information search, AI conversations, and academic research.',
        images: ['/screenshots/main-interface.png'],
        creator: '@OpenBook',
        site: '@OpenBook',
    },
    keywords: ['OpenBook', 'openbook', 'Open Book', 'AI Integrated Book'],
    icons: {
        icon: [
            { url: '/logo.svg', type: 'image/svg+xml' },
        ],
        apple: [{ url: '/logo.svg', type: 'image/svg+xml' }],
        other: [
            {
                rel: 'mask-icon',
                url: '/logo.svg',
                color: '#000000',
            },
        ],
    },
    appleWebApp: {
        capable: true,
        title: 'OpenBook',
        statusBarStyle: 'black-translucent',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    ],
};

const instrumentSerif = Instrument_Serif({
    subsets: ['latin'],
    variable: '--font-instrument-serif',
    weight: '400',
    display: 'swap',
});

const syne = Syne({
    subsets: ['latin'],
    variable: '--font-syne',
    preload: true,
    display: 'swap',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {process.env.NODE_ENV === "development" && (
                    <Script
                        src="//unpkg.com/react-grab/dist/index.global.js"
                        crossOrigin="anonymous"
                        strategy="beforeInteractive"
                        data-enabled="true"
                    />
                )}
            </head>
            <body className={`${GeistSans.variable} ${syne.variable} ${instrumentSerif.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}