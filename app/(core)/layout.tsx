import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from '../(config)/providers';
import { SpacesProvider } from '@/contexts/SpacesContext';
import { NotebookProvider } from '@/contexts/NotebookContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { JournalProvider } from '@/contexts/JournalContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import SidebarLayout from './SidebarLayout';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { OnboardingOverlay, TooltipCard } from '@/components/features/onboarding';

export default function CoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NuqsAdapter>
            <Providers>
                <NotebookProvider>
                    <SettingsProvider>
                        <SpacesProvider>
                            <JournalProvider>
                                <Toaster position="top-center" />
                                <SidebarProvider>
                                    <OnboardingProvider>
                                        <SidebarLayout>
                                            {children}
                                        </SidebarLayout>
                                        <OnboardingOverlay />
                                        <TooltipCard />
                                    </OnboardingProvider>
                                </SidebarProvider>
                            </JournalProvider>
                        </SpacesProvider>
                    </SettingsProvider>
                </NotebookProvider>
            </Providers>
            <Analytics />
            <SpeedInsights />
        </NuqsAdapter>
    );
}
