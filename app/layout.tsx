import { Geist_Mono, Inter } from "next/font/google"

import MainNavbar from "@/components/global/MainNavbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "JC | Portfolio",
  description: "Frontend portfolio of JC",
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
        inter.variable
      )}
    >
      <body>
        <MainNavbar />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
