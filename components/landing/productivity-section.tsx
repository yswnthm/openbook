"use client"

import { cn } from "@/lib/utils"
import { Mic, Plus, Users, Check } from "lucide-react"
import { motion } from "framer-motion"
import { ReactNode } from "react"

// --- Component: BentoCard ---
// Matching the structure from features-section.tsx
interface BentoCardProps {
    title: string
    description: string
    className?: string
    children?: React.ReactNode
    delay?: number
    gradient?: string
}

function BentoCard({
    title,
    description,
    className = "",
    children,
    delay = 0,
    gradient = "from-primary/5 via-transparent to-transparent"
}: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className={cn(
                "group relative overflow-hidden rounded-3xl bg-card/50 border border-border/40 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 flex flex-col",
                className
            )}
        >
            <div className="p-6 md:p-8 flex flex-col h-full z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-[90%]">{description}</p>
                <div className="mt-auto w-full flex-grow flex items-center justify-center relative">
                    {children}
                </div>
            </div>

            {/* Subtle Gradient Background Effect */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", gradient)} />
        </motion.div>
    )
}

// --- Visual Components ---

function CreateTasksVisual() {
    return (
        <div className="w-full mt-4 space-y-3 relative">
            {/* Glow effect behind active item */}
            <div className="absolute top-8 left-0 right-0 h-10 bg-primary/5 blur-xl rounded-full" />

            {[
                { text: "Automated testing", checked: true, active: false },
                { text: "Initial Usability Assessment", checked: true, active: true },
                { text: "Updating the docs", checked: true, active: false }
            ].map((item, i) => (
                <div key={i} className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all",
                    item.active
                        ? "bg-card border-primary/20 shadow-sm translate-x-1"
                        : "bg-muted/30 border-transparent opacity-60"
                )}>
                    <div className={cn(
                        "w-4 h-4 rounded-[4px] border flex items-center justify-center",
                        item.checked ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                        {item.checked && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
            ))}
        </div>
    )
}

function PlannerVisual() {
    return (
        <div className="w-full relative mt-2 h-40 rounded-xl border border-border bg-muted/20 overflow-hidden p-3">
            <div className="flex gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            </div>

            {/* Calendar Event */}
            <div className="absolute top-8 left-3 right-3 p-3 rounded-lg bg-card border border-border shadow-sm z-10">
                <p className="text-xs text-muted-foreground mb-1">Discuss detailed project plans outlining tasks</p>
                <p className="text-[10px] text-muted-foreground/70 mb-2">1:00 - 01:30 pm</p>
                <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full bg-muted border border-card" />
                    ))}
                </div>
            </div>

            {/* Background dim lines */}
            <div className="space-y-4 mt-6 opacity-10">
                <div className="h-[1px] w-full bg-foreground" />
                <div className="h-[1px] w-full bg-foreground" />
                <div className="h-[1px] w-full bg-foreground" />
            </div>
        </div>
    )
}

function DateVisual() {
    // This is a special stand-alone visual, not inside a BentoCard in the original design, but we can wrap it if needed or leave as is.
    // The original design had it as a standalone grid item. We'll keep it as a standalone visual component that mimics BentoCard wrapper for consistency or just plain div.
    // Based on request "update according to these components", I will treat it as a special Bento entry.
    return (
        <div className="w-full aspect-square relative flex items-center justify-center h-full min-h-[300px]">
            {/* Glowing ring */}
            <div className="absolute inset-2 rounded-full border border-border bg-card overflow-hidden shadow-2xl dark:shadow-none dark:bg-muted/10">
                {/* Mesh/Grid Texture */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '10px 10px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-8xl font-bold text-foreground tracking-tighter">18</span>
                    <span className="text-lg text-muted-foreground font-medium mt-[-5px]">February</span>
                </div>

                {/* Plus Button */}
                <button className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-foreground text-background border border-border/20 flex items-center justify-center hover:scale-105 transition-transform shadow-lg z-20 group">
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
        </div>

    )
}

function TeamVisual() {
    return (
        <div className="w-full mt-4 space-y-4 flex flex-col justify-end h-full min-h-[200px]">
            {/* Message 1 */}
            <div className="self-end max-w-[90%] p-3 rounded-2xl rounded-tr-sm bg-primary/10 text-foreground text-xs font-medium shadow-sm relative group">
                <span className="text-[10px] text-muted-foreground block mb-1">@Mark</span>
                Their decision is very important.
                <div className="absolute -right-2 top-0 w-6 h-6 rounded-full bg-background border-2 border-primary/10 overflow-hidden"></div>
            </div>

            {/* Message 2 */}
            <div className="self-start max-w-[90%] p-3 rounded-2xl rounded-tl-sm bg-muted/50 border border-border text-foreground text-xs font-medium relative">
                <span className="text-[10px] text-orange-500 block mb-1">@John</span>
                Have they signed their contract yet?
            </div>

            {/* Input placeholder */}
            <div className="w-full h-8 rounded-full bg-muted/30 border border-border/50 flex items-center px-4">
                <div className="w-1 h-4 bg-muted-foreground/50 animate-pulse" />
            </div>
        </div>
    )
}

function TakeNotesVisual() {
    return (
        <div className="w-full mt-auto pt-6">
            <div className="bg-muted/20 border border-border/50 rounded-xl p-4 space-y-3">
                <div className="text-xs text-muted-foreground font-medium px-1">Basic blocks</div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors cursor-pointer group shadow-sm">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary group-hover:scale-110 transition-transform">Aa</div>
                    <div>
                        <div className="text-xs font-medium text-foreground">Text</div>
                        <div className="text-[10px] text-muted-foreground">Embed a sub-page inside</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer opacity-60">
                    <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-muted-foreground"></div>
                    </div>
                    <div>
                        <div className="text-xs font-medium text-muted-foreground">To-do list</div>
                        <div className="text-[10px] text-muted-foreground">Track tasks with a to-do list</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SyncVisual() {
    return (
        <div className="w-full h-48 flex items-center justify-center relative mt-6">
            {/* Central Mic Button */}
            <div className="relative z-20 group cursor-pointer">
                <div className="absolute inset-0 bg-background/50 blur-xl rounded-full group-hover:bg-background/80 transition-all duration-500" />
                <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Mic className="w-8 h-8 text-foreground" />
                </div>
            </div>

            {/* Floating Avatars */}
            {[
                { style: "top-10 left-20", char: "AN" },
                { style: "bottom-12 left-10", img: "https://github.com/shadcn.png" },
                { style: "top-8 right-24", char: "BM" },
                { style: "bottom-10 right-16", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
                { style: "top-1/2 right-4 -translate-y-1/2 scale-75 opacity-50", char: "JD" },
            ].map((avatar, i) => (
                <div key={i} className={cn("absolute w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center overflow-hidden shadow-md", avatar.style)}>
                    {avatar.img ? (
                        <img src={avatar.img} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-medium text-muted-foreground">{avatar.char}</span>
                    )}
                </div>
            ))}
        </div>
    )
}

function ManageProjectsVisual() {
    return (
        <div className="w-full mt-8 relative h-full min-h-[150px]">
            {/* Mock CRM/Board UI */}
            <div className="absolute right-[-20px] top-0 w-[120%] bg-card rounded-l-xl border-l border-t border-b border-border p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
                    <div className="text-xs font-bold text-foreground">Marketing</div>
                    <div className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">Active</div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 shadow-sm mb-3 border border-border/50">
                    <div className="text-[10px] font-semibold text-foreground mb-1">Strategic digital campaign</div>
                    <div className="flex items-center gap-2 mt-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">6 members</span>
                        <div className="flex -space-x-1 ml-auto">
                            <div className="w-4 h-4 rounded-full bg-muted text-[6px] flex items-center justify-center text-muted-foreground border border-card">+2</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 opacity-50">
                    <div className="h-2 w-1/2 bg-muted/50 rounded" />
                    <div className="h-2 w-3/4 bg-muted/50 rounded" />
                </div>
            </div>
        </div>
    )
}


export function ProductivitySection() {
    return (
        <section className="w-full py-20 lg:py-32 bg-transparent relative overflow-hidden">
            {/* Ambient Background Glows - Adjusted for Theme */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto auto-rows-[minmax(300px,auto)]">
                    {/* Row 1 */}

                    {/* Card 1: Create Tasks */}
                    <BentoCard
                        className="col-span-1"
                        delay={0.1}
                        title="Create tasks."
                        description="Schedule your personal events and todos."
                    >
                        <CreateTasksVisual />
                    </BentoCard>

                    {/* Card 2: Plan your work */}
                    <BentoCard
                        className="col-span-1"
                        delay={0.2}
                        title="Plan your work."
                        description="Visualize your workday in your planner."
                    >
                        <PlannerVisual />
                    </BentoCard>

                    {/* Circle Element: Date - Special Item */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="col-span-1"
                    >
                        <DateVisual />
                    </motion.div>

                    {/* Card 3: Create with team */}
                    <BentoCard
                        className="col-span-1"
                        delay={0.4}
                        title="Create with team."
                        description="Send DM and create group chat."
                    >
                        <TeamVisual />
                    </BentoCard>

                    {/* Row 2 */}

                    {/* Card 4: Take notes (Bottom Left) */}
                    <BentoCard
                        className="col-span-1 lg:row-start-2"
                        delay={0.5}
                        gradient="from-blue-500/5 via-transparent to-transparent"
                        title="Take notes."
                        description="Create documents to keep track of those documents"
                    >
                        <TakeNotesVisual />
                    </BentoCard>

                    {/* Card 5: Sync in real time (Center Bottom - Span 2) */}
                    <BentoCard
                        className="col-span-1 lg:col-span-2 lg:row-start-2 relative overflow-visible"
                        delay={0.6}
                        title="Sync in real time."
                        description="Connect with your team instantly to monitor progress and track updates."
                    >
                        {/* Glow Effect under the card content */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                        <SyncVisual />
                    </BentoCard>

                    {/* Card 6: Manage Projects (Bottom Right) */}
                    <BentoCard
                        className="col-span-1 lg:row-start-2"
                        delay={0.7}
                        title="Manage Projects."
                        description="Customize your workspace to fit the needs of your teams."
                    >
                        <ManageProjectsVisual />
                    </BentoCard>

                </div>
            </div>
        </section>
    )
}
