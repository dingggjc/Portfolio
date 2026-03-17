"use client"

import { type VariantProps } from "class-variance-authority"
import { animate } from "motion/react"
import { Menu } from "lucide-react"
import { ReactNode } from "react"

import { cn } from "@/lib/utils"

import LaunchUI from "../../logos/launch-ui"
import { Button, buttonVariants } from "../../ui/button"
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar"
import Navigation from "../../ui/navigation"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet"

interface NavbarLink {
  text: string
  href: string
}

interface NavbarActionProps {
  text: ReactNode
  href: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
  icon?: ReactNode
  iconRight?: ReactNode
  isButton?: boolean
}

interface NavbarProps {
  logo?: ReactNode
  name?: string
  homeUrl?: string
  mobileLinks?: NavbarLink[]
  actions?: NavbarActionProps[]
  showNavigation?: boolean
  customNavigation?: ReactNode
  className?: string
}

export default function Navbar({
  logo = <LaunchUI />,
  name = "Launch UI",
  homeUrl = "https://www.launchuicomponents.com/",
  mobileLinks = [
    { text: "Getting Started", href: "https://www.launchuicomponents.com/" },
    { text: "Components", href: "https://www.launchuicomponents.com/" },
    { text: "Documentation", href: "https://www.launchuicomponents.com/" },
  ],
  actions = [
    {
      text: "Sign in",
      href: "https://www.launchuicomponents.com/",
      isButton: false,
    },
    {
      text: "Get Started",
      href: "https://www.launchuicomponents.com/",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom absolute left-0 h-24 w-full bg-background/15 backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a
              href={homeUrl}
              className="flex items-center gap-2 text-xl font-bold"
            >
              {logo}
              {name}
            </a>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {actions.map((action, index) =>
              action.isButton ? (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  asChild
                >
                  <a href={action.href}>
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </a>
                </Button>
              ) : action.text === "Theme" ? (
                <div key={index} className="hidden md:block">
                  {action.icon}
                </div>
              ) : (
                <a
                  key={index}
                  href={action.href}
                  className="hidden text-sm md:block"
                >
                  {action.text}
                </a>
              )
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation links
                </SheetDescription>
                <nav className="grid gap-6 text-lg font-medium">
                  <a
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </a>
                  {mobileLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault()
                          const targetId = link.href.replace("#", "")
                          const target = document.getElementById(targetId)
                          if (target) {
                            window.dispatchEvent(new Event("scroll-start"))
                            const navbarHeight = 84
                            const targetPosition =
                              target.getBoundingClientRect().top +
                              window.scrollY -
                              navbarHeight
                            animate(window.scrollY, targetPosition, {
                              duration: 0.6,
                              ease: [0.22, 1, 0.36, 1],
                              onUpdate: (latest: number) => window.scrollTo(0, latest),
                              onComplete: () => {
                                window.dispatchEvent(new Event("scroll-end"))
                              },
                            })
                          }
                        }
                      }}
                    >
                      {link.text}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  )
}
