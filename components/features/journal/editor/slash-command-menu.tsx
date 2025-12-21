'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BlockType } from '@/lib/types';
import {
    Type,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    ChevronRight,
    Quote,
    Minus,
    Code,
    Image,
    Table,
    Link,
    CalendarDays,
    ExternalLink,
} from 'lucide-react';

interface SlashCommandMenuProps {
    position: { top: number; left: number };
    onSelect: (blockType: BlockType) => void;
    onClose: () => void;
}

interface CommandOption {
    type: BlockType;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    category: 'basic' | 'advanced' | 'media';
    description?: string;
}

export default function SlashCommandMenu({ position, onSelect, onClose }: SlashCommandMenuProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLDivElement>(null);

    const commands: CommandOption[] = [
        {
            type: BlockType.Text,
            label: 'Text',
            icon: <Type className="w-4 h-4" />,
            category: 'basic',
            description: 'Just start writing with plain text',
        },
        {
            type: BlockType.H1,
            label: 'Heading 1',
            icon: <Heading1 className="w-4 h-4" />,
            shortcut: '#',
            category: 'basic',
            description: 'Big section heading',
        },
        {
            type: BlockType.H2,
            label: 'Heading 2',
            icon: <Heading2 className="w-4 h-4" />,
            shortcut: '##',
            category: 'basic',
            description: 'Medium section heading',
        },
        {
            type: BlockType.H3,
            label: 'Heading 3',
            icon: <Heading3 className="w-4 h-4" />,
            shortcut: '###',
            category: 'basic',
            description: 'Small section heading',
        },
        {
            type: BlockType.BulletList,
            label: 'Bulleted list',
            icon: <List className="w-4 h-4" />,
            shortcut: '-',
            category: 'basic',
            description: 'Create a simple bulleted list',
        },
        {
            type: BlockType.NumberedList,
            label: 'Numbered list',
            icon: <ListOrdered className="w-4 h-4" />,
            shortcut: '1.',
            category: 'basic',
            description: 'Create a numbered list',
        },
        {
            type: BlockType.TodoList,
            label: 'To-do list',
            icon: <CheckSquare className="w-4 h-4" />,
            shortcut: '[]',
            category: 'basic',
            description: 'Create a to-do checklist',
        },
        {
            type: BlockType.ToggleList,
            label: 'Toggle list',
            icon: <ChevronRight className="w-4 h-4" />,
            shortcut: '>',
            category: 'basic',
            description: 'Create a toggleable list item',
        },
        {
            type: BlockType.Quote,
            label: 'Quote',
            icon: <Quote className="w-4 h-4" />,
            category: 'basic',
            description: 'Capture a quote',
        },
        {
            type: BlockType.Divider,
            label: 'Divider',
            icon: <Minus className="w-4 h-4" />,
            shortcut: '---',
            category: 'basic',
            description: 'Visual divider between sections',
        },
        {
            type: BlockType.Code,
            label: 'Code',
            icon: <Code className="w-4 h-4" />,
            shortcut: '```',
            category: 'advanced',
            description: 'Capture a code snippet',
        },
        {
            type: BlockType.Image,
            label: 'Image',
            icon: <Image className="w-4 h-4" />,
            category: 'media',
            description: 'Upload or embed an image',
        },
        {
            type: BlockType.Table,
            label: 'Table',
            icon: <Table className="w-4 h-4" />,
            category: 'advanced',
            description: 'Add a table',
        },
        {
            type: BlockType.Link,
            label: 'Link',
            icon: <Link className="w-4 h-4" />,
            category: 'advanced',
            description: 'Add a web link',
        },
        {
            type: BlockType.Date,
            label: 'Date',
            icon: <CalendarDays className="w-4 h-4" />,
            category: 'advanced',
            description: 'Insert a date or reminder',
        },
        {
            type: BlockType.Embed,
            label: 'Embed',
            icon: <ExternalLink className="w-4 h-4" />,
            category: 'media',
            description: 'Embed from a link',
        },
    ];

    // Filter commands based on search term and shortcut
    const filteredCommands = searchTerm
        ? commands.filter(
            (command) =>
                command.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                command.shortcut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                command.description?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        : commands;

    // Group commands by category
    const groupedCommands = filteredCommands.reduce(
        (acc, command) => {
            if (!acc[command.category]) {
                acc[command.category] = [];
            }
            acc[command.category].push(command);
            return acc;
        },
        {} as Record<string, CommandOption[]>,
    );

    useEffect(() => {
        // Scroll selected item into view
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    useEffect(() => {
        const currentMenu = menuRef.current;
        if (!currentMenu) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onSelect(filteredCommands[selectedIndex].type);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            } else if (e.key.length === 1) {
                // Update search term for filtering
                setSearchTerm((prev) => prev + e.key);
                setSelectedIndex(0);
            } else if (e.key === 'Backspace') {
                setSearchTerm((prev) => prev.slice(0, -1));
                setSelectedIndex(0);
            }
        };

        currentMenu.addEventListener('keydown', handleKeyDown);

        // Focus the menu so it receives keyboard events
        currentMenu.focus();

        return () => currentMenu.removeEventListener('keydown', handleKeyDown);
    }, [onSelect, onClose, selectedIndex, filteredCommands]);

    useEffect(() => {
        // Close the menu when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Function to render a category
    const renderCategory = (category: string, commands: CommandOption[], startIndex: number) => {
        let currentIndex = startIndex;

        const categoryLabels: Record<string, string> = {
            basic: 'Basic blocks',
            advanced: 'Advanced blocks',
            media: 'Media',
        };

        return (
            <div key={category} className="mb-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 px-2 py-1 font-medium">
                    {categoryLabels[category] || category}
                </div>
                {commands.map((command) => {
                    const isSelected = currentIndex === selectedIndex;
                    const itemIndex = currentIndex++;

                    return (
                        <div
                            key={command.type}
                            role="menuitem"
                            ref={isSelected ? selectedRef : null}
                            className={`flex items-center px-2 py-1.5 cursor-pointer rounded-md menu-item ${isSelected ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                                }`}
                            onClick={() => onSelect(command.type)}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                        >
                            <div className="w-6 h-6 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                                {command.icon}
                            </div>
                            <div className="ml-2 flex-1">
                                <div className="text-sm">{command.label}</div>

                            </div>
                            {command.shortcut && (
                                <div className="text-xs text-neutral-400 dark:text-neutral-500 px-2 font-mono">
                                    {command.shortcut}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Calculate starting index for each category
    const getCategoryStartIndex = (categoryKey: string) => {
        let startIndex = 0;
        for (const category in groupedCommands) {
            if (category === categoryKey) break;
            startIndex += groupedCommands[category].length;
        }
        return startIndex;
    };

    return (
        <motion.div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            className="absolute z-50 bg-white dark:bg-neutral-950 rounded-xl shadow-2xl w-60 overflow-hidden outline-none ring-0 border border-neutral-200 dark:border-neutral-800"
            style={{ top: position.top + 5, left: position.left }}
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
        >


            <div className="max-h-64 overflow-y-auto p-1">
                {Object.keys(groupedCommands).length > 0 ? (
                    Object.keys(groupedCommands).map((category) =>
                        renderCategory(category, groupedCommands[category], getCategoryStartIndex(category)),
                    )
                ) : (
                    <div className="p-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                        No commands found
                    </div>
                )}
            </div>


        </motion.div>
    );
}
