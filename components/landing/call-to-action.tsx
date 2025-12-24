import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import AnimateInView from "@/components/landing/animate-in-view"
import Link from "next/link"

interface CallToActionProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  withBreak?: boolean
}

export function CallToAction({
  title,
  description,
  buttonText = "Get Started",
  buttonHref = "/",
  withBreak = true,
}: CallToActionProps) {
  return (
    <section className="py-32 md:py-40 ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateInView>
            <h2 className="inline-block cta-gradient-text text-center text-4xl font-bold text-transparent md:text-6xl lg:text-7xl" style={{ opacity: 1, transform: 'none' }}>
              {withBreak ? (
                <>
                  {title.split(' ').slice(0, -3).join(' ')} <br />
                  {title.split(' ').slice(-3).join(' ')}
                </>
              ) : title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="flex justify-center">
              <Link href={buttonHref}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                  {buttonText}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </AnimateInView>
        </div>
      </div>
    </section>
  )
} 