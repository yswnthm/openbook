"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import AnimateInView from "./animate-in-view"
import SectionHeading from "./section-heading"
import { ChatInput } from "@/components/features/spaces/input/input-content-box"
import { SearchGroupId } from "@/lib/utils"

export function ChatDemoSection() {
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
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading
                    title="Talk to Your Notebook"
                    description="Ask questions, summarize notes, and generate study guides using natural language."
                />

                <div className="mt-12 max-w-4xl mx-auto">
                    <AnimateInView>
                        <Card className="p-1 bg-gradient-to-br from-border/50 to-border/10 rounded-2xl border-none shadow-2xl">
                            <div className="bg-card rounded-xl overflow-hidden p-6 md:p-10 min-h-[400px] flex flex-col">
                                {/* Chat Header */}
                                <div className="flex items-center space-x-3 mb-8 border-b border-border/40 pb-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                    <span className="ml-4 text-xs text-muted-foreground font-mono">OpenBook AI</span>
                                </div>

                                {/* Chat Messages */}
                                <div className="space-y-6 flex-grow">
                                    {/* User Message */}
                                    <div className="flex justify-end">
                                        <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                                            <p>Explain quantum computing for beginners</p>
                                        </div>
                                    </div>

                                    {/* AI Response */}
                                    <div className="flex justify-start">
                                        <div className="bg-muted px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] space-y-2">
                                            <p className="text-sm text-foreground">
                                                Quantum computing uses <span className="font-semibold text-primary">qubits</span> instead of classical bits. While bits are 0 or 1, qubits can be both at once due to <strong>superposition</strong>.
                                            </p>
                                            <p className="text-sm text-foreground">
                                                This allows quantum computers to solve complex problems much faster than traditional computers.
                                            </p>
                                        </div>
                                    </div>

                                    {/* User Message */}
                                    <div className="flex justify-end">
                                        <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                                            <p>Create a quiz based on my notes about this.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="mt-8 relative z-10">
                                    <div className="bg-background rounded-2xl border border-border shadow-sm">
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
                        </Card>
                    </AnimateInView>
                </div>
            </div>
        </section>
    )
}
