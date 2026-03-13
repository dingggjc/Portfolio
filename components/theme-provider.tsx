"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <div className="fixed top-25 right-4 z-40">
        <AnimatedThemeToggler className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-accent transition-colors shadow-md" />
      </div>
      {children}
    </NextThemesProvider>
  )
}


export { ThemeProvider }
