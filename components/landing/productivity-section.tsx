"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Clock, Sparkles, Zap, Repeat, Layers } from "lucide-react"
import AnimateInView from "./animate-in-view"
import { ChatInput } from "@/components/features/spaces/input/input-content-box"
import { SearchGroupId } from "@/lib/utils"

export function ProductivitySection() {
    const router = useRouter()
    const [input, setInput] = useState("")
    const [selectedModel, setSelectedModel] = useState("openai-gpt-5-mini")
    const [attachments, setAttachments] = useState<any[]>([])
    const [selectedGroup, setSelectedGroup] = useState<SearchGroupId>('chat')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = () => {
        if (!input.trim()) return

        // Redirect to chat with the query
        const encodedQuery = encodeURIComponent(input)
        router.push(`/chat?query=${encodedQuery}`)
    }

    return (
        <section className="pt-24 pb-6">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimateInView>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full mb-6">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Productivity Benefits</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                            Learn smarter, not harder.
                        </h2>

                        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Automate repetitive study tasks with smart templates, scheduled reviews, and memory-optimized learning paths.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                            <div className="flex flex-col items-center p-6 bg-background rounded-2xl shadow-sm border border-border/40 hover:border-primary/20 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                                    <Repeat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium text-foreground">Spaced Repetition</span>
                            </div>

                            <div className="flex flex-col items-center p-6 bg-background rounded-2xl shadow-sm border border-border/40 hover:border-primary/20 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-3">
                                    <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="font-medium text-foreground">Active Recall</span>
                            </div>

                            <div className="flex flex-col items-center p-6 bg-background rounded-2xl shadow-sm border border-border/40 hover:border-primary/20 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3">
                                    <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-foreground">Concept Mapping</span>
                            </div>

                            <div className="flex flex-col items-center p-6 bg-background rounded-2xl shadow-sm border border-border/40 hover:border-primary/20 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-3">
                                    <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="font-medium text-foreground">Knowledge Synthesis</span>
                            </div>
                        </div>

                        <div className="mt-12 w-full">
                            <div className="relative z-10 w-full">
                                <div className="bg-background rounded-2xl border border-border shadow-2xl p-6">
                                    <ChatInput
                                        value={input}
                                        onChange={setInput}
                                        onSubmit={handleSubmit}
                                        onStop={() => { }}
                                        selectedModel={selectedModel}
                                        onModelChange={setSelectedModel}
                                        selectedGroup={selectedGroup}
                                        onGroupChange={setSelectedGroup}
                                        attachments={attachments}
                                        onAttachmentsChange={setAttachments}
                                        fileInputRef={fileInputRef}
                                        status="ready"
                                        pickerPlacement="top"
                                    />
                                </div>
                            </div>
                        </div>
                    </AnimateInView>
                </div>
            </div>
        </section>
    )
}
