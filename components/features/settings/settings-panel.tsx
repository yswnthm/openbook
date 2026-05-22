'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';

import { getGroupConfig } from '@/app/(config)/actions';
import { toast } from 'sonner';

interface SettingsPanelProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function SettingsPanel({ open, onOpenChange, children }: SettingsPanelProps) {
    const { systemPrompt, setSystemPrompt } = useSettings();
    const [defaultPrompt, setDefaultPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [draftPrompt, setDraftPrompt] = useState('');
    const [internalOpen, setInternalOpen] = useState(false);

    // Handle open state whether controlled or uncontrolled
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = (newOpen: boolean) => {
        setInternalOpen(newOpen);
        onOpenChange?.(newOpen);
    };

    // Load default prompt on mount
    useEffect(() => {
        const loadDefaultPrompt = async () => {
            try {
                const config = await getGroupConfig('chat');
                if (config && config.instructions) {
                    setDefaultPrompt(config.instructions);
                }
            } catch (error) {
                console.error('Failed to load default prompt:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDefaultPrompt();
    }, []);

    // Sync draft with stored prompt when opening or when default loads
    useEffect(() => {
        if (isOpen) {
            setDraftPrompt(systemPrompt || defaultPrompt);
        }
    }, [isOpen, systemPrompt, defaultPrompt]);

    const handleSave = () => {
        setSystemPrompt(draftPrompt);
        toast.success('Settings saved', {
            description: 'Your new system prompt is now active.',
        });
        setIsOpen(false);
    };

    const handleReset = () => {
        setDraftPrompt(defaultPrompt);
        toast.info('Reset to default', {
            description: 'Click Save to apply these changes.',
        });
    };

    const isUsingDefault = !systemPrompt;
    const hasUnsavedChanges = draftPrompt !== (systemPrompt || defaultPrompt);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-1">
                    <DialogTitle className="text-2xl">Settings</DialogTitle>
                    <DialogDescription>
                        Configure your AI assistant preferences. These settings are saved in your browser.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium">System Prompt</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Override the default behavior and persona of the AI.
                                    </p>
                                    {isUsingDefault && !isLoading && !hasUnsavedChanges && (
                                        <p className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                                            Currently using default system prompt
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    disabled={isLoading || draftPrompt === defaultPrompt}
                                >
                                    Reset to Default
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center h-[400px] border rounded-md border-input bg-transparent">
                                    <div className="animate-spin h-6 w-6 border-2 border-neutral-400 rounded-full border-t-transparent"></div>
                                </div>
                            ) : (
                                <textarea
                                    className="flex min-h-[400px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono resize-none"
                                    placeholder="Loading default prompt..."
                                    value={draftPrompt}
                                    onChange={(e) => setDraftPrompt(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-1 py-2 border-t mt-auto">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
