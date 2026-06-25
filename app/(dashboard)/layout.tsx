import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar />
                <div className="w-full my-2">
                    {children}
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}