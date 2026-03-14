import { GlobeIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import { BentoCard, BentoGrid } from "../ui/bento-grid"

const features = [
  {
    name: "Helps Innovation ",
    description: "Web Development",
    href: "https://www.helps.com.ph/",
    cta: "View Website",
    links: [
      {
        href: "https://github.com",
        icon: <GlobeIcon className="h-6 w-6" />,
      },
    ],
    background: (
      <Image
        src="/assets/svg/HelpsLanding.svg"
        alt="Decorative background"
        unoptimized
        fill
        className="absolute inset-0 mask-[linear-gradient(to_top,transparent_10%,#000_100%)] object-cover object-top opacity-80 transition-all duration-300 ease-out group-hover:scale-105"
      />
    ),
  },
  {
    name: "Careerpoint",
    description: "Web Development",
    href: "https://icy-ocean-07773e100.4.azurestaticapps.net/",
    cta: "View Website",
    links: [
      {
        href: "https://github.com",
        icon: <GlobeIcon className="h-6 w-6" />,
      },
    ],
    background: (
      <Image
        src="/assets/svg/JobPointLandingPage.svg"
        alt="Decorative background"
        unoptimized
        fill
        className="absolute inset-0 mask-[linear-gradient(to_top,transparent_10%,#000_100%)] object-cover object-top opacity-80 transition-all duration-300 ease-out group-hover:scale-105"
      />
    ),
  },
  {
    name: "Nueropoint",
    description: "Web Development",
    href: "https://www.neuropoint.io/",
    cta: "View Website",
    links: [
      {
        href: "https://github.com",
        icon: <GlobeIcon className="h-6 w-6" />,
      },
    ],
    background: (
      <Image
        src="/assets/svg/NeuroPointLandingPage.svg"
        alt="Decorative background"
        unoptimized
        fill
        className="absolute inset-0 mask-[linear-gradient(to_top,transparent_10%,#000_100%)] object-cover object-top opacity-80 transition-all duration-300 ease-out group-hover:scale-105"
      />
    ),
  },
  {
    name: "Helps Emergency",
    description: "Mobile Development",
    href: "https://play.google.com/store/apps/details?id=com.helps_innovation_corporation.helpsmobile&pcampaignid=web_share",
    cta: "View Website",
    links: [
      {
        href: "https://github.com",
        icon: <GlobeIcon className="h-6 w-6" />,
      },
    ],
    background: (
      <Image
        src="/assets/svg/MainScreenwithSubscription.svg"
        alt="Decorative background"
        unoptimized
        fill
        className="absolute inset-0 mask-[linear-gradient(to_top,transparent_10%,#000_100%)] object-cover object-top opacity-80 transition-all duration-300 ease-out group-hover:scale-105"
      />
    ),
  },
]

export function Projects() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Featured Work
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Projects I&apos;ve Contributed To
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Explore a selection of applications and platforms I&apos;ve helped
            build, showcasing my focus on delivering elegant and scalable user
            experiences.
          </p>
        </div>
        <BentoGrid className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} showIconLink={false} />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
