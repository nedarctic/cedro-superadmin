"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {

  const pathname = usePathname();

  const isActive = (path: string) => {

    if(path === '/' && pathname === '/') return true;

    if(path !== '/' && pathname.startsWith(path)) return true;

    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>

          {items.map((item) => (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem className="w-full">
                <SidebarMenuButton className={`${isActive(item.url) ? "bg-black text-white" : "text-black"}`} tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
