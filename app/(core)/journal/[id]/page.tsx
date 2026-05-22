'use client';

import { useParams } from 'next/navigation';


import Editor from '@/components/features/journal/editor/editor';
import { useJournal } from '@/hooks/useJournal';



export default function JournalEntryPage() {
    const params = useParams();
    const idParam = params.id;
    const { getEntry, updateEntry, initialized } = useJournal();


    if (!initialized) {
        return null;
    }

    if (typeof idParam !== 'string') {
        return <div>Invalid journal ID</div>;
    }

    const entry = getEntry(idParam);
    if (!entry) {
        return <div>Journal entry not found</div>;
    }

    return (
        <div className="flex font-sans min-h-screen bg-background text-foreground transition-all duration-500">
            <main
                className="flex-1 min-h-screen transition-all duration-300"
            >
                <Editor
                    initialBlocks={entry.blocks}
                    title={entry.title}
                    onBlocksChange={(blocks) =>
                        updateEntry(idParam, {
                            blocks,
                        })
                    }
                    onTitleChange={(newTitle) => {
                        if (newTitle !== entry.title) {
                            updateEntry(idParam, { title: newTitle });
                        }
                    }}
                />
            </main>
        </div>
    );
}
