import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    };

    const { user } = session;
    const initials = user.name.split(' ').map(name => name[0]).reduce((prev, curr) => {
        return prev + curr
    }, '');

    const loggedInUser = {
        name: user.name,
        email: user.email,
        avatar: initials
    };

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
                <AppSidebar user={loggedInUser} />
                <div className="w-full my-2">
                    {children}
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}