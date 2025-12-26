"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Menu, X, Github, MessageCircleIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

import Image from "next/image"

const XIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
  >
    <title>X</title>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
  >
    <title>Discord</title>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

// Animation variants for hover effects
const hoverAnimation = {
  scale: 1.03,
  transition: { duration: 0.2 }
}

const buttonHoverAnimation = {
  y: -2,
  transition: { duration: 0.2 }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Handle hover for dropdown menus
  const handleMouseEnter = (item: string) => {
    setActiveItem(item)
  }

  const handleMouseLeave = () => {
    setActiveItem(null)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 header-layer w-full"
    >
      <nav className="border-input/50 bg-popover/95 backdrop-blur-lg flex w-full max-w-3xl mx-auto items-center justify-between gap-2 rounded-xl border p-2 px-4 mt-4 mb-2">
        <div className="flex items-center gap-6">
          <Link className="relative cursor-pointer flex items-center gap-2" href="/">
            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 400 }}>
              <Image src="/logo.svg" alt="OpenBook Logo" width={22} height={22} className="h-[22px] w-[22px] dark:invert" />
            </motion.div>
            <span className="text-lg font-bold tracking-tight">OpenBook</span>
          </Link>

          <div className="hidden md:block">
            <div className="flex items-center space-x-1 gap-1">
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => handleMouseEnter('company')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="inline-flex h-9 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/20 focus:bg-accent/20">
                  Company
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeItem === 'company' ? 'rotate-180' : ''}`} />
                </div>

                {activeItem === 'company' && (
                  <div
                    className="absolute top-full left-0 pt-2 w-[400px] z-50"
                  >
                    <div className="dropdown-layer bg-popover/95 backdrop-blur-lg rounded-lg border shadow-lg p-4 grid gap-3">
                      <motion.div whileHover={hoverAnimation}>
                        <Link href="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                          <div className="text-sm font-medium">About</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Learn about our mission and values</div>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={hoverAnimation}>
                        <Link href="/team" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                          <div className="text-sm font-medium">Team</div>
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Meet the people behind OpenBook</div>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => handleMouseEnter('resources')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="inline-flex h-9 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/20 focus:bg-accent/20">
                  Resources
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeItem === 'resources' ? 'rotate-180' : ''}`} />
                </div>

                {activeItem === 'resources' && (
                  <div
                    className="absolute top-full left-0 pt-2 w-[400px] z-50"
                  >
                    <div className="dropdown-layer bg-popover/95 backdrop-blur-lg rounded-lg border shadow-lg p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div whileHover={hoverAnimation}>
                          <Link href="https://github.com/yeswanth49/openbook" target="_blank" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Github className="h-4 w-4" />
                              GitHub
                            </div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Check out our repo</div>
                          </Link>
                        </motion.div>
                        <motion.div whileHover={hoverAnimation}>
                          <Link href="https://x.com/Yeshh49" target="_blank" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <XIcon className="h-4 w-4" />
                              Twitter
                            </div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Follow for updates</div>
                          </Link>
                        </motion.div>
                        <motion.div whileHover={hoverAnimation}>
                          <Link href="https://discord.com/users/810347349418573825" target="_blank" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <DiscordIcon className="h-4 w-4" />
                              Discord
                            </div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Join our community</div>
                          </Link>
                        </motion.div>
                        <motion.div whileHover={hoverAnimation}>
                          <Link href="/chat" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <MessageCircleIcon className="h-4 w-4" />
                              Try Now
                            </div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">Experience our chat</div>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <motion.div whileHover={buttonHoverAnimation}>
                <Link target="_blank" href="https://x.com/Yeshh49">
                  <Button variant="ghost" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground px-3 py-1.5 h-7">
                    Twitter
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <motion.div whileHover={buttonHoverAnimation}>
            <ThemeToggle />
          </motion.div>
          <motion.div whileHover={buttonHoverAnimation}>
            <Link target="_blank" href="https://cal.com/yeshh49">
              <Button variant="ghost" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground px-4 py-2 h-8">
                Contact Us
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={buttonHoverAnimation}>
            <Link href="/chat">
              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-8">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-popover border-t border-input/50 mx-4 rounded-xl mb-4"
        >
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="font-medium mb-1">Company</div>
              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href="/about"
                  className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href="/team"
                  className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Team
                </Link>
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="font-medium mb-1">Resources</div>
              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href="https://github.com/yeswanth49/openbook"
                  target="_blank"
                  className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href="https://x.com/Yeshh49"
                  target="_blank"
                  className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <XIcon className="h-4 w-4" />
                  Twitter
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href="https://discord.com/users/810347349418573825"
                  target="_blank"
                  className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DiscordIcon className="h-4 w-4" />
                  Discord
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 2 }}>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  Try Now
                </Link>
              </motion.div>
            </div>

            <div className="pt-4 border-t border-input/50 flex flex-col space-y-3">
              <div className="flex items-center justify-center mb-2">
                <ThemeToggle />
              </div>
              <motion.div whileHover={buttonHoverAnimation}>
                <Button variant="ghost" size="sm" className="justify-center rounded-none">
                  Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={buttonHoverAnimation}>
                <Button size="sm" className="justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
                  Contact Us
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
