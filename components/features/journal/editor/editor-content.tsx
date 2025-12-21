'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Block, BlockType } from '@/lib/types';
import {
    GripVertical,
    Plus,
    Trash2,
    Copy,
    MoveVertical,
    Check,
    ArrowUp,
    ArrowDown,
    Type,
    Heading1,
    Heading2,
    Code,
    List,
    CheckSquare,
    Quote,
    Minus,
    ChevronRight,
    Edit2,
    Cpu,
    Repeat,
    Square,
} from 'lucide-react';

interface EditorContentProps {
    blocks: Block[];
    onKeyDown: (e: React.KeyboardEvent, blockId: string) => void;
    onChange: (id: string, content: string) => void;
    onFocus: (id: string) => void;
    onDeleteBlock?: (id: string) => void;
    onDuplicateBlock?: (id: string) => void;
    onBlocksChange?: (blocks: Block[]) => void;
}

export default function EditorContent({
    blocks,
    onKeyDown,
    onChange,
    onFocus,
    onDeleteBlock,
    onDuplicateBlock,
    onBlocksChange,
}: EditorContentProps) {
    const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
    const [submenu, setSubmenu] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const toggleSelection = (id: string) => {
        setSelectedBlocks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setActiveMenu(null);
            }
        };

        // Handle keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Add any keyboard shortcuts here if needed in the future
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [blocks, selectedBlocks]);

    useEffect(() => {
        // Focus on the block that has isFocused set to true
        const focusedBlock = blocks.find((block) => block.isFocused);
        if (focusedBlock && blockRefs.current[focusedBlock.id]) {
            const node = blockRefs.current[focusedBlock.id];
            if (!node) return;

            // Focus the element
            node.focus();

            // Place cursor at the end of the text
            if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
                const range = document.createRange();
                range.selectNodeContents(node);
                range.collapse(false); // false means collapse to end
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    }, [blocks]);

    const handleBlockAction = (action: string, blockId: string, blockType?: BlockType) => {
        setActiveMenu(null);

        switch (action) {
            case 'delete':
                onDeleteBlock?.(blockId);
                break;
            case 'duplicate':
                onDuplicateBlock?.(blockId);
                break;
            case 'move-up':
                // Find the block's index and move it up
                const blockIndexUp = blocks.findIndex((b) => b.id === blockId);
                if (blockIndexUp > 0) {
                    const updated = [...blocks];
                    const temp = updated[blockIndexUp];
                    updated[blockIndexUp] = updated[blockIndexUp - 1];
                    updated[blockIndexUp - 1] = temp;
                    onBlocksChange?.(updated);
                }
                break;
            case 'move-down':
                // Find the block's index and move it down
                const blockIndexDown = blocks.findIndex((b) => b.id === blockId);
                if (blockIndexDown < blocks.length - 1) {
                    const updated = [...blocks];
                    const temp = updated[blockIndexDown];
                    updated[blockIndexDown] = updated[blockIndexDown + 1];
                    updated[blockIndexDown + 1] = temp;
                    onBlocksChange?.(updated);
                }
                break;
            case 'change-type':
                if (blockType) {
                    // Change the block's type while preserving content
                    const updated = blocks.map((b) => (b.id === blockId ? { ...b, type: blockType } : b));
                    onBlocksChange?.(updated);
                }
                break;
        }
    };

    const renderBlock = (block: Block, index: number) => {
        const commonProps = {
            id: `block-${block.id}`,
            key: block.id,
            contentEditable: true,
            suppressContentEditableWarning: true,
            onKeyDown: (e: React.KeyboardEvent) => onKeyDown(e, block.id),
            onInput: (e: React.FormEvent<HTMLDivElement>) => {
                onChange(block.id, (e.target as HTMLDivElement).textContent || '');
            },
            onFocus: () => onFocus(block.id),
            ref: (el: HTMLDivElement) => (blockRefs.current[block.id] = el),
            placeholder: '',
            className: 'outline-none mb-1 min-h-[1.5em]',
        };

        const blockContent = (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="group relative block-container"
            >
                {/* Add a menu indicator at the beginning of each block */}
                {/* Add a menu indicator at the beginning of each block */}
                <div
                    className={`absolute -left-10 top-1/2 transform -translate-y-1/2 transition-opacity duration-200 flex items-center justify-end ${selectedBlocks.includes(block.id) || activeMenu === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === block.id ? null : block.id);
                        }}
                        className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                </div>

                {/* Position the command palette menu next to the block buttons */}
                <AnimatePresence>
                    {activeMenu === block.id && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, transformOrigin: 'top left' }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute z-40"
                            style={{ top: '24px', left: '-10px', zIndex: 50 }}
                        >
                            <div
                                className="flex bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800"
                                onMouseLeave={() => setSubmenu(null)}
                            >
                                {/* Main commands list */}
                                <div className="w-72 max-h-[300px] overflow-y-auto">
                                    <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search actions..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none"
                                        />
                                    </div>
                                    <div className="p-1 flex flex-col">
                                        <button
                                            onClick={() => handleBlockAction('delete', block.id)}
                                            onMouseEnter={() => setSubmenu(null)}
                                            className="flex items-center justify-between w-full px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Trash2 className="h-4 w-4 text-neutral-500" />
                                                <span>Delete</span>
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleBlockAction('duplicate', block.id)}
                                            onMouseEnter={() => setSubmenu(null)}
                                            className="flex items-center justify-between w-full px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Copy className="h-4 w-4 text-neutral-500" />
                                                <span>Duplicate</span>
                                            </span>
                                        </button>
                                        <button
                                            onMouseEnter={() => setSubmenu('turn-into')}
                                            className="flex items-center justify-between w-full px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Repeat className="h-4 w-4 text-neutral-500" />
                                                <span>Turn into</span>
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-neutral-400" />
                                        </button>

                                    </div>
                                </div>
                                {/* Submenu for Turn into */}
                                {submenu === 'turn-into' && (
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="w-72 max-h-[300px] overflow-y-auto border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                                    >
                                        <div className="p-1.5">
                                            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1.5">
                                                Turn into
                                            </div>
                                            <div className="grid grid-cols-2 gap-0.5">
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.Text)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Type className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Text</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.H1)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Heading1 className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Heading 1</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.H2)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Heading2 className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Heading 2</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.BulletList)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <List className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Bullet List</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction(
                                                            'change-type',
                                                            block.id,
                                                            BlockType.NumberedList,
                                                        )
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Minus className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Numbered List</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.TodoList)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <CheckSquare className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>To-do List</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.ToggleList)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Quote className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Toggle List</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.Quote)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Quote className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Quote</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleBlockAction('change-type', block.id, BlockType.Code)
                                                    }
                                                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                                                >
                                                    <Code className="h-3.5 w-3.5 text-neutral-500" />
                                                    <span>Code</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {renderBlockContent(block, commonProps)}
                {/* Only show command hint for text blocks that are empty and focused, and when no menu is active */}
                {block.content.trim() === '' && block.isFocused && !activeMenu && block.type === BlockType.Text && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="flex items-center gap-1 text-neutral-400 select-none text-sm font-normal opacity-70">
                            Type{' '}
                            <span className="inline-block px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-medium">
                                /
                            </span>{' '}
                            for commands
                        </span>
                    </div>
                )}
            </motion.div>
        );

        return blockContent;
    };

    const renderBlockContent = (block: Block, commonProps: any) => {
        // Create a div with the content already set
        const contentProps = {
            ...commonProps,
            dangerouslySetInnerHTML: { __html: block.content || '' },
        };

        // For empty blocks, add appropriate placeholder
        if (block.content.trim() === '' && block.isFocused) {
            contentProps.dangerouslySetInnerHTML = undefined;
            contentProps.placeholder = getPlaceholderForBlockType(block.type);
        }

        switch (block.type) {
            case BlockType.H1:
                return (
                    <h1
                        {...contentProps}
                        className="text-3xl font-bold mb-4 outline-none placeholder:text-neutral-400 placeholder:opacity-60"
                    />
                );
            case BlockType.H2:
                return (
                    <h2
                        {...contentProps}
                        className="text-2xl font-semibold mb-3 outline-none placeholder:text-neutral-400 placeholder:opacity-60"
                    />
                );
            case BlockType.H3:
                return (
                    <h3
                        {...contentProps}
                        className="text-xl font-medium mb-3 outline-none placeholder:text-neutral-400 placeholder:opacity-60"
                    />
                );
            case BlockType.BulletList:
                return (
                    <div className="flex items-start mb-1 py-1">
                        <span className="mr-2 mt-1 opacity-60 text-sm">•</span>
                        <div
                            {...contentProps}
                            className="outline-none flex-1 placeholder:text-neutral-400 placeholder:opacity-60"
                        />
                    </div>
                );
            case BlockType.NumberedList:
                return (
                    <div className="flex items-start mb-1 py-1">
                        <span className="mr-2 mt-1 opacity-60 text-sm">1.</span>
                        <div
                            {...contentProps}
                            className="outline-none flex-1 placeholder:text-neutral-400 placeholder:opacity-60"
                        />
                    </div>
                );
            case BlockType.TodoList:
                return (
                    <div className="flex items-start mb-1 py-1">
                        <div
                            className={`mr-2 mt-1 h-4 w-4 rounded border border-solid border-neutral-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 ${block.metadata?.checked ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                const isChecked = !!block.metadata?.checked;
                                onChange(block.id, block.content);
                                // Update the metadata for the block
                                const updatedBlocks = blocks.map((b) =>
                                    b.id === block.id
                                        ? {
                                            ...b,
                                            metadata: {
                                                ...b.metadata,
                                                checked: !isChecked,
                                            },
                                        }
                                        : b,
                                );
                                // We need to update the blocks state in the parent component
                                // This will be picked up by the editor component
                                onBlocksChange?.(updatedBlocks);
                            }}
                        >
                            {block.metadata?.checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div
                            {...contentProps}
                            className={`outline-none flex-1 placeholder:text-neutral-400 placeholder:opacity-60 ${block.metadata?.checked ? 'line-through text-neutral-400 dark:text-neutral-500' : ''}`}
                        />
                    </div>
                );
            case BlockType.ToggleList:
                return (
                    <div className="flex items-start mb-1 py-1">
                        <span className="mr-2 mt-1 opacity-60 text-sm">▸</span>
                        <div
                            {...contentProps}
                            className="outline-none flex-1 placeholder:text-neutral-400 placeholder:opacity-60"
                        />
                    </div>
                );
            case BlockType.Quote:
                return (
                    <div className="border-l-4 border-neutral-200 dark:border-neutral-700 pl-4 mb-3 text-neutral-600 dark:text-neutral-300">
                        <div
                            {...contentProps}
                            className="outline-none placeholder:text-neutral-400 placeholder:opacity-60"
                        />
                    </div>
                );
            case BlockType.Divider:
                return (
                    <div className="relative py-6 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors">
                        <hr className="border-t border-neutral-200 dark:border-neutral-700" />
                        <div className="sr-only" {...commonProps}></div>
                    </div>
                );
            case BlockType.Code:
                return (
                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-md p-4 mb-4 font-mono text-sm">
                        <div
                            {...contentProps}
                            className="outline-none placeholder:text-neutral-400 placeholder:opacity-60"
                        />
                    </div>
                );
            default:
                return (
                    <div
                        {...contentProps}
                        className="py-1 outline-none placeholder:text-neutral-400 placeholder:opacity-60"
                    />
                );
        }
    };

    // Helper function to get appropriate placeholder text for each block type
    const getPlaceholderForBlockType = (type: BlockType): string => {
        switch (type) {
            case BlockType.H1:
                return 'Heading 1';
            case BlockType.H2:
                return 'Heading 2';
            case BlockType.H3:
                return 'Heading 3';
            case BlockType.BulletList:
                return 'List item';
            case BlockType.NumberedList:
                return 'List item';
            case BlockType.TodoList:
                return 'To-do item';
            case BlockType.ToggleList:
                return 'Toggle item';
            case BlockType.Quote:
                return 'Quote';
            case BlockType.Code:
                return 'Code';
            default:
                return "Type '/' for commands";
        }
    };

    return (
        <div className="max-w-2xl mx-auto relative">
            {blocks.map((block, index) => renderBlock(block, index))}
        </div>
    );
}
