import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons"
import { Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { InteractiveHoverButton } from "../ui/interactive-hover-button"

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <div className="px-auto py-auto mb-4 flex justify-center">
          <Avatar className="size-20">
            <AvatarImage
              alt="@myusername"
              src="/assets/jpeg/formaledited.JPG"
            />
            <AvatarFallback className="text-xl">HB</AvatarFallback>
          </Avatar>
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          Hi, I&apos;m Charles
        </h1>

        <h2 className="mb-8 text-2xl font-medium text-muted-foreground md:text-3xl">
          Junior Developer
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I build polished web and mobile experiences using React, Next.js, and
          React Native. From my time as a Frontend Intern to my role as a
          Semi-Backend Developer , I’ve focused on writing clean, efficient code
          that bridges the gap between beautiful design and robust logic.
        </p>

        <div className="mb-10 flex justify-center gap-4">
          <InteractiveHoverButton rounded="sm" showIcons={false}>
            View my work
          </InteractiveHoverButton>
          <InteractiveHoverButton rounded="sm" showIcons={false}>
            Contact Me
          </InteractiveHoverButton>
        </div>

        <div className="flex justify-center gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <GitHubLogoIcon className="h-6 w-6" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <LinkedInLogoIcon className="h-6 w-6" />
          </a>
          <a
            href="mailto:alex.morgan@email.com"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  )
}
