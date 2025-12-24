import AnimateInView from "./animate-in-view"
import { StyledText } from "./styled-text"
import { AnimatedHeading } from "./animated-heading"

interface SectionHeadingProps {
  title: string
  description?: string
  centered?: boolean
  className?: string
  highlightWords?: {
    word: string
    className: string
  }[]
}

export default function SectionHeading({ 
  title, 
  description, 
  centered = true, 
  className = "",
  highlightWords = [] 
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${centered ? "text-center" : ""} ${className}`}>
      <AnimateInView>
        {highlightWords.length > 0 ? (
          <AnimatedHeading
            title={title}
            highlightWords={highlightWords}
            className="gradient-text"
          />
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{title}</h2>
        )}
        {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
      </AnimateInView>
    </div>
  )
}
