"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

export function TeamHero() {
  const [currentAge, setCurrentAge] = useState<string>("");

  useEffect(() => {
    const updateAge = () => {
      const birthDate = new Date("2006-01-02T00:00:00Z");
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birthDate.getTime());
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      setCurrentAge(diffYears.toFixed(9));
    };

    updateAge(); // Initial calculation
    const interval = setInterval(updateAge, 100); // Update every 100ms for smooth counting

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="flex items-center justify-center px-8 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-6 md:gap-y-0 md:gap-x-8 lg:gap-x-12">
          {/* Profile Image - Left Side */}
          <div className="flex-shrink-0 row-span-1 md:row-span-2 self-start md:self-center">
            <div className="opacity-0 animate-fade-in-up">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-border/20 shadow-lg">
                <Image
                  src="/pfp.webp"
                  alt="Yeswanth's profile picture"
                  fill
                  className="object-cover object-[50%_60%]"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Title & Age - Right Side (Top) */}
          <div className="text-left max-w-2xl self-center md:self-end">
            <div className="opacity-0 animate-fade-in-up animate-delay-200">
              <h1
                className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl mb-1 md:mb-3 font-bold leading-none font-league-spartan"
              >
                hi, i'm yswnth.
              </h1>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 leading-relaxed text-pretty">
                been here for {currentAge} years
              </p>
              <div className="mb-4 md:mb-6"></div>
            </div>
          </div>

          {/* Remaining Content - Bottom (Mobile: Full Width, Desktop: Right Side Bottom) */}
          <div className="col-span-2 md:col-span-1 text-left max-w-2xl md:w-full self-start">
            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-0 leading-relaxed text-pretty">
                trying to learn everything, by breaking everything.
              </p>
            </div>
            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-0 leading-relaxed text-pretty">
                <a
                  href="https://yswnth.bearblog.dev/things-i-admire-the-most/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline transition-colors duration-200 cursor-pointer"
                >
                  things i admire the most.
                </a>
              </p>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-300">
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed text-pretty">
                <a
                  href="https://yswnth.bearblog.dev/things-i-learnt-in-meanwhile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline transition-colors duration-200 cursor-pointer"
                >
                  things i learnt meanwhile.
                </a>
              </p>
            </div>

            <div className="opacity-0 animate-fade-in-up animate-delay-400">
              <div className="flex flex-wrap items-center justify-start gap-4 md:gap-6 mb-8">
                <a
                  href="https://x.com/Yeshh49"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X profile"
                  className="group flex items-center text-muted-foreground transition-all duration-300 ease-in-out"
                >
                  <XIcon className="w-4 h-4 group-hover:text-foreground transition-colors group-hover:drop-shadow-lg" />
                  <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs text-muted-foreground group-hover:text-foreground/50">
                    <span className="pl-2">@yswnth</span>
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/in/yeswanth49"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="group flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <Linkedin className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
                <a
                  href="https://github.com/yeswanth49"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="group flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <Github className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
                <a
                  href="mailto:work.yeswanth@gmail.com"
                  aria-label="Send email"
                  className="group flex items-center text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300 ease-in-out"
                >
                  <Mail className="w-5 h-5 group-hover:drop-shadow-lg" />
                </a>
              </div>
              
              {/* CTA Button */}
              <div className="mb-4">
                <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold">
                  <a href="mailto:work.yeswanth@gmail.com">
                    Get in Touch
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
