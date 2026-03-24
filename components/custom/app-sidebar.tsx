"use client"

import { sidebarItems } from "@/data/sidebar";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { AppNavList } from "./app-nav-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>){
    return (
        <Sidebar variant={"inset"} {...props}>
            <SidebarHeader>
                ECHO
            </SidebarHeader>
            <SidebarContent>
                {sidebarItems.map((group) => (
                <AppNavList key={group.title} title={group.title} items={group.items} />
            ))

                }
            </SidebarContent>
        </Sidebar>
    );
}