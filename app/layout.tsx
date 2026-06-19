import { Geist_Mono, Outfit } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import "./globals.css"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Json | Portfolio",
  description: "Frontend portfolio of Json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body>
          <TooltipProvider>
            <ThemeProvider>
              {children}
              <Toaster
                position="top-right"
                theme="system"
                className="border-border bg-background text-foreground"
                toastOptions={{
                  classNames: {
                    toast:
                      "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                      "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                      "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                  },
                }}
              />
            </ThemeProvider>
          </TooltipProvider>
      </body>
    </html>
  )
}
