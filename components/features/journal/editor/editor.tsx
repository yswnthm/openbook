'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SlashCommandMenu from './slash-command-menu';
import EditorContent from './editor-content';
import EmptyState from './empty-state';
import { BlockType, type Block } from '@/lib/types';
import { TopBar } from '@/components/layout/top-bar';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface EditorProps {
    initialBlocks?: Block[];
    onBlocksChange?: (blocks: Block[]) => void;
    title?: string;
    onTitleChange?: (title: string) => void;
}

export default function Editor({ initialBlocks, onBlocksChange, title, onTitleChange }: EditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(
        () => initialBlocks ?? [{ id: Date.now().toString(), type: BlockType.Text, content: '', isFocused: true }],
    );

    // Create a more descriptive default title
    const defaultTitle = 'Untitled';
    const [currentTitle, setCurrentTitle] = useState(title || defaultTitle);

    const [showSlashMenu, setShowSlashMenu] = useState(false);
    const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
    const [currentBlockId, setCurrentBlockId] = useState<string>(blocks[0]?.id || '');
    const [isLoading, setIsLoading] = useState(true);

    const editorRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        // Initialize loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Sync initial blocks
    useEffect(() => {
        if (initialBlocks) {
            setBlocks(initialBlocks);
            setCurrentBlockId(initialBlocks[0]?.id || '');
        }
    }, [initialBlocks]);

    // Sync title from props
    useEffect(() => {
        if (title && title !== currentTitle) {
            setCurrentTitle(title);
        }
    }, [title, currentTitle]);

    const updateBlocks = (updated: Block[]) => {
        setBlocks(updated);
        onBlocksChange?.(updated);
    };

    const handleTitleChange = (newTitle: string) => {
        setCurrentTitle(newTitle);
        onTitleChange?.(newTitle);
    };

    // Handle pasting markdown: insert parsed HTML inline
    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        // Get plain markdown text
        const markdown = e.clipboardData.getData('text/plain');
        // Parse to HTML
        const rawHtml = await marked.parse(markdown);
        // Sanitize HTML to prevent XSS
        const html = DOMPurify.sanitize(rawHtml);

        // Insert HTML at the current cursor position using Range APIs
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const fragment = range.createContextualFragment(html);
        range.insertNode(fragment);
    };

    const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
        const blockIndex = blocks.findIndex((b) => b.id === blockId);
        if (blockIndex === -1) return;
        const block = blocks[blockIndex];

        if (e.key === '/') {
            e.preventDefault();
            setCurrentBlockId(blockId);
            setShowSlashMenu(true);
            const blockElement = document.getElementById(`block-${blockId}`);
            if (blockElement) {
                const rect = blockElement.getBoundingClientRect();
                setSlashMenuPosition({ top: rect.bottom, left: rect.left });
            }
        } else if (e.key === 'Escape' && showSlashMenu) {
            setShowSlashMenu(false);
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newBlock: Block = {
                id: Date.now().toString(),
                type: BlockType.Text,
                content: '',
                isFocused: true,
            };
            const updated = [...blocks];
            updated[blockIndex] = { ...updated[blockIndex], isFocused: false };
            updated.splice(blockIndex + 1, 0, newBlock);
            updateBlocks(updated);
            setCurrentBlockId(newBlock.id);
        } else if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
            e.preventDefault();
            const withoutCurrent = blocks.filter((_, idx) => idx !== blockIndex);
            const newFocus = Math.max(0, blockIndex - 1);
            const focusedBlocks = withoutCurrent.map((blk, idx) => ({
                ...blk,
                isFocused: idx === newFocus,
            }));
            updateBlocks(focusedBlocks);
            setCurrentBlockId(focusedBlocks[newFocus].id);
        } else if (e.key === 'ArrowUp' && !e.shiftKey) {
            // Only handle arrow up if at the start of the text
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            const container = range?.startContainer;
            const offset = range?.startOffset;

            if (offset === 0 && blockIndex > 0) {
                e.preventDefault();
                const updated = blocks.map((blk, idx) => ({
                    ...blk,
                    isFocused: idx === blockIndex - 1,
                }));
                updateBlocks(updated);
                setCurrentBlockId(updated[blockIndex - 1].id);
            }
        } else if (e.key === 'ArrowDown' && !e.shiftKey) {
            // Only handle arrow down if at the end of the text
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            const container = range?.startContainer;
            const offset = range?.startOffset;
            const length = container?.textContent?.length || 0;

            if (offset === length && blockIndex < blocks.length - 1) {
                e.preventDefault();
                const updated = blocks.map((blk, idx) => ({
                    ...blk,
                    isFocused: idx === blockIndex + 1,
                }));
                updateBlocks(updated);
                setCurrentBlockId(updated[blockIndex + 1].id);
            }
        } else if (block.content === '#' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.H1, content: '' } : blk)));
        } else if (block.content === '##' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.H2, content: '' } : blk)));
        } else if (block.content === '###' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.H3, content: '' } : blk)));
        } else if (block.content === '-' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(
                blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.BulletList, content: '' } : blk)),
            );
        } else if (block.content === '1.' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(
                blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.NumberedList, content: '' } : blk)),
            );
        } else if (block.content === '[]' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(
                blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.TodoList, content: '' } : blk)),
            );
        } else if (block.content === '>' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(
                blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.Quote, content: '' } : blk)),
            );
        } else if (block.content === '---' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(
                blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.Divider, content: '' } : blk)),
            );
        } else if (block.content === '```' && e.key === ' ') {
            e.preventDefault();
            updateBlocks(
                blocks.map((blk) => (blk.id === blockId ? { ...blk, type: BlockType.Code, content: '' } : blk)),
            );
        }
    };

    const handleBlockChange = (id: string, content: string) => {
        updateBlocks(blocks.map((blk) => (blk.id === id ? { ...blk, content } : blk)));
    };

    const handleBlockFocus = (id: string) => {
        updateBlocks(blocks.map((blk) => ({ ...blk, isFocused: blk.id === id })));
        setCurrentBlockId(id);
    };

    const handleDeleteBlock = (id: string) => {
        const updated = blocks.filter((block) => block.id !== id);

        if (updated.length === 0) {
            // If we deleted the last block, add a new empty one and focus it
            const newBlock = {
                id: Date.now().toString(),
                type: BlockType.Text,
                content: '',
                isFocused: true,
            };
            updateBlocks([newBlock]);
            setCurrentBlockId(newBlock.id);
            return;
        }

        // Focus the previous block or the next one if we deleted the first
        const index = blocks.findIndex((block) => block.id === id);
        const newFocusIndex = Math.max(0, index > 0 ? index - 1 : 0);
        const focusedBlocks = updated.map((blk, idx) => ({
            ...blk,
            isFocused: idx === newFocusIndex,
        }));

        updateBlocks(focusedBlocks);
        setCurrentBlockId(focusedBlocks[newFocusIndex].id);
    };

    const handleDuplicateBlock = (id: string) => {
        const blockToDuplicate = blocks.find((block) => block.id === id);
        if (!blockToDuplicate) return;

        const index = blocks.findIndex((block) => block.id === id);
        const duplicatedBlock = {
            ...blockToDuplicate,
            id: Date.now().toString(),
            isFocused: true,
        };

        const updated = blocks.flatMap((blk, idx) => {
            if (idx === index) {
                return [
                    {
                        ...blk,
                        isFocused: false,
                    },
                    duplicatedBlock,
                ];
            }
            return [{ ...blk, isFocused: false }];
        });

        updateBlocks(updated);
        setCurrentBlockId(duplicatedBlock.id);
    };

    const handleCommandSelect = (type: BlockType) => {
        setShowSlashMenu(false);
        updateBlocks(blocks.map((blk) => (blk.id === currentBlockId ? { ...blk, type } : blk)));
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-white text-black dark:bg-black dark:text-white">
                <div className="flex flex-col items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-black dark:border-white"></div>
                    <p className="mt-4 text-sm font-light">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white text-black dark:bg-neutral-900 dark:text-white">
            <TopBar className="bg-transparent pt-8">
                <div className="flex items-center space-x-2 w-full max-w-2xl mx-auto px-4 sm:px-0">
                    <input
                        type="text"
                        className="text-xl sm:text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full opacity-90 focus:opacity-100 px-8"
                        value={currentTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder={defaultTitle}
                    />
                </div>
            </TopBar>

            <div ref={editorRef} className="flex-1 overflow-y-auto py-8 px-8 pt-24" onPaste={handlePaste}>
                <div className="max-w-2xl mx-auto">
                    {blocks.length === 0 ? (
                        <EmptyState
                            onCreateBlock={() =>
                                updateBlocks([
                                    { id: Date.now().toString(), type: BlockType.Text, content: '', isFocused: true },
                                ])
                            }
                        />
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                            <EditorContent
                                blocks={blocks}
                                onKeyDown={handleKeyDown}
                                onChange={handleBlockChange}
                                onFocus={handleBlockFocus}
                                onDeleteBlock={handleDeleteBlock}
                                onDuplicateBlock={handleDuplicateBlock}
                                onBlocksChange={updateBlocks}
                            />
                        </motion.div>
                    )}
                    {showSlashMenu && (
                        <SlashCommandMenu
                            position={slashMenuPosition}
                            onSelect={handleCommandSelect}
                            onClose={() => setShowSlashMenu(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}