"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { CalendarCheckIcon, FileTextIcon, LayoutDashboardIcon, MapIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const data = {
  

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Tours",
      url: "/tours",
      icon: (
        <MapIcon
        />
      ),
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: (
        <CalendarCheckIcon
        />
      ),
    },
    {
      title: "Team",
      url: "/team",
      icon: (
        <UsersIcon
        />        
      ),
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: (
        <FileTextIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ user, ...props }: {user: {name: string; email: string; avatar: string;}} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
              <Image src="/cedro-cheetah.svg" width={20} height={20} alt="Cedro Adventures cheetah mascot" />
                <span className="text-base font-semibold">Cedro Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
