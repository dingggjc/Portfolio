"use client"

import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { animate } from "motion/react"

import { Button } from "@/components/ui/button"
import { Navbar, NavbarLeft, NavbarRight } from "@/components/ui/navbar"
import Navigation from "@/components/ui/navigation"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { title: "Home", href: "#hero" },
  { title: "Projects", href: "#projects" },
  { title: "Experience", href: "#experience" },
  { title: "Contact", href: "#contact" },
]

function smoothScrollTo(href: string) {
  const targetId = href.replace("#", "")
  const target = document.getElementById(targetId)
  if (!target) return
  const navbarHeight = 84
  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - navbarHeight
  window.dispatchEvent(new Event("scroll-start"))
  animate(window.scrollY, targetPosition, {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (latest: number) => window.scrollTo(0, latest),
    onComplete: () => window.dispatchEvent(new Event("scroll-end")),
  })
}

export default function MainNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <Navbar>
          <NavbarLeft>
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Json | Portfolio
            </Link>
          </NavbarLeft>

          <NavbarRight>
            <Navigation
              menuItems={navLinks.map((link) => ({
                title: link.title,
                isLink: true,
                href: link.href,
              }))}
            />

            <Button asChild size="sm" variant="default" className="hidden md:inline-flex">
              <a href="/others/Resume.pdf" target="_blank" rel="noopener noreferrer">
                View CV
              </a>
            </Button>

            <AnimatedThemeToggler className="h-9 w-9 rounded-md" />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Json | Portfolio</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-4 px-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => smoothScrollTo(link.href)}
                      className="text-left text-sm font-medium text-foreground hover:text-primary"
                    >
                      {link.title}
                    </button>
                  ))}
                  <Button asChild size="sm" className="mt-4 w-full">
                    <a href="/others/Resume.pdf" target="_blank" rel="noopener noreferrer">
                      View CV
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </Navbar>
      </div>
    </header>
  )
}
