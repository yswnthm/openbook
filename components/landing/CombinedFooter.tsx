import { Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import css from './footer.module.css';

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
              <span className="text-xl font-bold text-neutral-900 dark:text-foreground">OpenBook</span>
            </div>
            <p className="text-sm text-neutral-900 dark:text-muted-foreground max-w-md">
              Your smart Notebook. Personalized learning that adapts to your needs—accessible anytime, anywhere.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/GoOpenBook" target="_blank" className="text-neutral-900 dark:text-muted-foreground hover:text-foreground">
                <XIcon className="h-[18px] w-[18px]" />
              </a>
              <a href="https://github.com/yeswanth49/openbook" target="_blank" className="text-neutral-900 dark:text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://discord.com/users/810347349418573825" target="_blank" className="text-neutral-900 dark:text-muted-foreground hover:text-foreground">
                <DiscordIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Empty column for spacing */}
          <div className="md:col-span-2"></div>

          {/* Resources column */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="https://github.com/yeswanth49/openbook"
                  target="_blank"
                  className="block text-sm text-neutral-900 dark:text-muted-foreground hover:text-foreground"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com/GoOpenBook"
                  target="_blank"
                  className="block text-sm text-neutral-900 dark:text-muted-foreground hover:text-foreground"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.com/users/810347349418573825"
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-neutral-900 dark:text-muted-foreground hover:text-foreground"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="flex items-center gap-2 text-sm text-neutral-900 dark:text-muted-foreground hover:text-foreground"
                >
                  Try Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-2 md:ml-auto">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-900 dark:text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-sm text-neutral-900 dark:text-muted-foreground hover:text-foreground"
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
          <p className="text-sm text-neutral-900 dark:text-muted-foreground text-center">
            © {new Date().getFullYear()} OpenBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 