"use client"

import dynamic from "next/dynamic"
import { ComponentProps } from "react"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

interface LottieAnimationProps extends Omit<ComponentProps<typeof Lottie>, "animationData"> {
    animationData?: any
    placeholderText?: string
}

export default function LottieAnimation({
    animationData,
    placeholderText = "Animation Placeholder",
    className,
    ...props
}: LottieAnimationProps) {
    if (!animationData) {
        return (
            <div className={`flex items-center justify-center bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30 ${className}`}>
                <p className="text-sm text-muted-foreground font-medium">{placeholderText}</p>
            </div>
        )
    }

    return (
        <div className={className}>
            <Lottie animationData={animationData} {...props} />
        </div>
    )
}
