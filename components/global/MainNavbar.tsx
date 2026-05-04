import Navbar from "@/components/sections/navbar/default"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import Navigation from "@/components/ui/navigation"

export default function MainNavbar() {
  const desktopNavigation = (
    <Navigation
      menuItems={[
        { title: "Home", isLink: true, href: "#hero" },
        { title: "Skills", isLink: true, href: "#skills" },
        { title: "Projects", isLink: true, href: "#projects" },
        { title: "Experience", isLink: true, href: "#experience" },
        { title: "Contact", isLink: true, href: "#contact" },
      ]}
    />
  )

  const mobileLinks = [
    { text: "Home", href: "#hero" },
    { text: "Skills", href: "#skills" },
    { text: "Projects", href: "#projects" },
    { text: "Experience", href: "#experience" },
    { text: "Contact", href: "#contact" },
  ]

  const actions = [
    {
      text: "Download CV",
      href: "/others/Resume.pdf",
      isButton: true,
      variant: "default" as const,
      download: true,
    },
    {
      text: "Theme",
      href: "#",
      icon: <AnimatedThemeToggler className="h-9 w-9 rounded-md" />,
      isButton: false,
    },
  ]
  return (
    <Navbar
      name="Json | Portfolio"
      homeUrl="/"
      customNavigation={desktopNavigation}
      mobileLinks={mobileLinks}
      actions={actions}
    />
  )
}
