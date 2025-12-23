import React from 'react';
import { MessageSquare, AppWindowMac, Trash2, Settings } from 'lucide-react';
import { SettingsPanel } from '@/components/features/settings/settings-panel';

interface SidebarFooterProps {
    onClearStorage: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ onClearStorage }) => {
    return (
        <div className="border-t border-neutral-100 dark:border-neutral-800 py-3 px-4">
            <div className="space-y-1">
                <a
                    href="https://x.com/GoOpenBook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                    <MessageSquare className="h-4 w-4 text-neutral-400" />
                    <span>Follow on X</span>
                </a>
                <a
                    href="https://openbook.featurebase.app/roadmap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                    <AppWindowMac className="h-4 w-4 text-neutral-400" />
                    <span>Feedback</span>
                </a>
                {/* Add Clear Storage button */}
                <button
                    id="sidebar-clear-storage-trigger"
                    onClick={onClearStorage}
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                    <Trash2 className="h-4 w-4 text-neutral-400" />
                    <span>Clear Storage</span>
                </button>
                {/* Settings Button (Wraps the button with the SettingsPanel Trigger) */}
                <SettingsPanel>
                    <button id="sidebar-settings-trigger" className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                        <Settings className="h-4 w-4 text-neutral-400" />
                        <span>Settings</span>
                    </button>
                </SettingsPanel>
            </div>
        </div>
    );
};
