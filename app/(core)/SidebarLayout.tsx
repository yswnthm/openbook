'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import Sidebar from '@/components/layout/sidebar';

const SIDEBAR_WIDTH = 256;

export default function SidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isOpen, setIsOpen } = useSidebar();

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div
                className="flex-1 min-h-screen transition-all duration-300 ease-out flex flex-col"
                style={{ marginLeft: isOpen ? SIDEBAR_WIDTH : 0 }}
            >
                {children}
            </div>
        </div>
    );
}
