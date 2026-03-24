import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../components/custom/app-sidebar";

export default function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <SidebarProvider>
            <AppSidebar/>
            {children}
        </SidebarProvider>
    )
}