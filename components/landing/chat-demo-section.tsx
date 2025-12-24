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

                <div className="mt-12 max-w-2xl mx-auto">
                    <AnimateInView>
                        <div className="relative z-10 w-full">
                            <div className="bg-background rounded-2xl border border-border shadow-2xl">
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
                    </AnimateInView>
                </div>
            </div>
        </section>
    )
}
