import MainNavbar from "@/components/global/MainNavbar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { projects } from "@/data/project.data"
import { AlertCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectsProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: ProjectsProps) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <section className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-4 py-24 text-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Project not found</AlertTitle>
          <AlertDescription>
            <p className="mb-4 text-muted-foreground">
              The project with ID &quot;{id}&quot; does not exist in our
              records.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to Home</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  return (
    <>
      <MainNavbar />
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border bg-muted/30 shadow-sm transition-all duration-300 hover:shadow-md">
              <ScrollArea className="h-[500px] w-full md:h-[600px]">
                <div className="p-1">
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={1200}
                    height={2400}
                    className="h-auto w-full object-cover object-top"
                    unoptimized
                  />
                </div>
              </ScrollArea>
            </div>
            <p className="mt-4 text-center text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase opacity-50">
              Scroll to explore
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="sticky top-24 flex flex-col">
              <div className="mb-8">
                <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {project.name}
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>

              <Separator className="mb-8" />

              <div className="mb-8 space-y-8">
                <div>
                  <h3 className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="rounded-md px-3 py-0.5 text-[11px] font-medium"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                    Highlights
                  </h3>
                  <ul className="space-y-3">
                    {project.details.map((detail, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                        <span className="leading-snug">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button asChild size="lg" className="w-full shadow-sm">
                <a
                  href={project.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
