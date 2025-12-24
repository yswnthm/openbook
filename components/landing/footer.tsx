import { BookOpen, Mail, MapPin, Phone, Github, Twitter, MessagesSquare, MessageCircleIcon } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">OpenBook</span>
            </div>
            <p className="text-sm text-muted-foreground">
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

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link 
                  href="https://github.com/yeswanth49/openbook" 
                  target="_blank" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link 
                  href="https://x.com/GoOpenBook" 
                  target="_blank" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-4 w-4" />
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
                  href="https://substack.com/@yeshh49" 
                  target="_blank" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <BookOpen className="h-4 w-4" />
                  Substack
                </Link>
              </li>
            </ul>
          </div>

          <div>
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
              <li>
                <Link 
                  href="/blogs" 
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                <span className="text-sm text-muted-foreground">123 Education Street, Learning City</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                <Link href="mailto:work@goopenbook.in" className="text-sm text-muted-foreground hover:text-foreground">
                  work@goopenbook.in
                </Link>
              </li>
              <li className="flex items-center">
                <Twitter className="h-5 w-5 text-muted-foreground mr-2" />
                <Link href="https://x.com/GoOpenBook" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
                  @GoOpenBook
                </Link>
              </li>
              <li className="flex items-center">
                <MessagesSquare className="h-5 w-5 text-muted-foreground mr-2" />
                <Link href="https://discord.com/users/810347349418573825" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
                  Discord Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} OpenBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
