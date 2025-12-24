"use client"

import Header from "./header"
import { BackButton } from "./back-button"

interface NavLayoutProps {
  children: React.ReactNode
}

export default function NavLayout({ children }: NavLayoutProps) {
  return (
    <>
      <Header />
      <BackButton />
      {children}
    </>
  )
} 