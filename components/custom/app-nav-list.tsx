"use client";

import { LucideIcon } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenuButton } from "../ui/sidebar";

type AppNavListProps = {
    title: string;
    items: {
        name: string;
        path: string;
        icon: LucideIcon;
    }[];
}



export function AppNavList({ title, items }: AppNavListProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            {items.map((item) => (
                <SidebarMenuButton key={item.name} asChild tooltip={item.name}>
                    <a href={item.path}>
                        <item.icon />
                        <span>{item.name}</span>
                    </a>
                </SidebarMenuButton>
            ))
            }
        </SidebarGroup>
    );
}