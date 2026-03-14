import Navbar from "@/components/sections/navbar/default"
import Navigation from "@/components/ui/navigation"

export default function MainNavbar() {
  const desktopNavigation = (
    <Navigation
      menuItems={[
        {
          title: "Home",
          isLink: true,
          href: "/",
        },
        {
          title: "Skills",
          isLink: true,
          href: "/skills",
        },
        {
          title: "Project",
          isLink: true,
          href: "/project",
        },
        {
          title: "Contact",
          isLink: true,
          href: "/contact",
        },
      ]}
    />
  )

  const mobileLinks = [
    { text: "Home", href: "/" },
    { text: "Skills", href: "/skills" },
    { text: "Project", href: "/project" },
    { text: "Contact", href: "/contact" },
  ]

  const actions = [
    {
      text: "Download CV",
      href: "/others/Resume.pdf",
      isButton: true,
      variant: "default" as const,
      download: true,
    },
  ]
  return (
    <Navbar
      name="Porfolio"
      homeUrl="/"
      customNavigation={desktopNavigation}
      mobileLinks={mobileLinks}
      actions={actions}
    />
  )
}
