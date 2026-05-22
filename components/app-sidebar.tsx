"use client"

import { useUserProfile } from "@/app/hooks/useUserProfile"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CalendarDaysIcon,
  Fan,
  LayoutDashboardIcon,
  Settings2Icon,
  TimerIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "lucide-react"

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/clients/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Attendance",
      url: "/clients/attendance",
      icon: <TimerIcon />,
    },
    {
      title: "Calendar",
      url: "/clients/calendar",
      icon: <CalendarDaysIcon />,
    },
    {
      title: "Goals & Progress",
      url: "/clients/progress",
      icon: <TrendingUpIcon />,
    },
    {
      title: "DT Form 001",
      url: "/clients/report",
      icon: <FileTextIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/clients/settings",
      icon: <Settings2Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userProfile } = useUserProfile()

  const user = userProfile || {
    name: "Loading...",
    email: "",
    avatar: "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Fan className="size-5!" />
                <span className="text-base font-semibold">
                  Json | Portfolio
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />

        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
