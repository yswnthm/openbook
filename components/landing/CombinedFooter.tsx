import { BookOpen, Mail, MapPin, Phone, Github, Twitter, MessagesSquare, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import css from './footer.module.css';

export default function CombinedFooter() {
  return (
    <footer className={`${css.footer} border-t border-border/40 bg-background relative`}>
      {/* Background text and overlays */}
      <span className={css['footer-text']}>OpenBook</span>
      <div className={css['footer-grid']} />
      <div className={css['footer-gradient']} />

      {/* Inline footer content */}
      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* First column - OpenBook info with more width */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="OpenBook Logo" width={24} height={24} className="h-6 w-6 dark:invert" />
              <span className="text-xl font-bold">OpenBook</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Your smart Notebook. Personalized learning that adapts to your needs—accessible anytime, anywhere.
            </p>
            <div className="flex space-x-4">
              <a href="https://discord.com/users/810347349418573825" target="_blank" className="text-muted-foreground hover:text-foreground">
                <MessagesSquare className="h-5 w-5" />
              </a>
              <a href="https://x.com/GoOpenBook" target="_blank" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/yeswanth49/openbook" target="_blank" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://substack.com/@yeshh49" target="_blank" className="text-muted-foreground hover:text-foreground">
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Empty column for spacing */}
          <div className="md:col-span-2"></div>

          {/* Resources column */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="https://github.com/yeswanth49/openbook"
                  target="_blank"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/GoOpenBook"
                  target="_blank"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.com/users/810347349418573825"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <MessagesSquare className="h-4 w-4" />
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <MessageCircleIcon className="h-4 w-4" />
                  Try Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-2 md:ml-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Empty column for spacing at the end */}
          <div className="md:col-span-1"></div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} OpenBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 