import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon, Clock, User, BookOpen, Newspaper, Users, BarChart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { LucideIcon } from "lucide-react"

interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  readTime: string
  author: string
  image?: string
  icon?: LucideIcon
  iconClassName?: string
  slug: string
  category?: string
}

export default function BlogCard({ 
  title, 
  excerpt, 
  date, 
  readTime, 
  author, 
  image, 
  icon: Icon, 
  iconClassName, 
  slug,
  category = 'personal' 
}: BlogCardProps) {
  
  // Select icon based on category
  const CategoryIcon = Icon || getCategoryIcon(category);
  
  return (
    <Link href={`/blogs/${slug}`} className="block h-full">
      <Card className="overflow-hidden transition-all hover:shadow-md hover:translate-y-[-4px] h-full flex flex-col border-border/20 bg-card/80 backdrop-blur-sm cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              className="object-cover transition-transform group-hover:scale-105 opacity-80"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background/50">
              <div className="transition-transform group-hover:scale-110 group-hover:rotate-3">
                <CategoryIcon className="h-16 w-16 text-foreground/60 mb-2" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-6 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground mb-3 space-x-4">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{readTime}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 text-foreground">{title}</h3>
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{author}</span>
          </div>
          <span className="text-sm font-medium text-foreground inline-flex items-center">
            Read More
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Helper function to get appropriate icon based on category
function getCategoryIcon(category: string): LucideIcon {
  switch (category.toLowerCase()) {
    case 'personal':
      return BookOpen;
    case 'weekly':
      return BarChart;
    case 'company':
      return Users;
    default:
      return Newspaper;
  }
}
