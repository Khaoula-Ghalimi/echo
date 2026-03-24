import { ROUTES } from "@/constants/routes";
import {
    LayoutDashboard,
    BarChart2,
    MessageSquare,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

export const sidebarItems = [
    {
        title: 'Menu',
        items: [
            { name: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
            { name: 'Analytics', icon: BarChart2, path: ROUTES.ANALYTICS },
            { name: 'Chat', icon: MessageSquare, path: ROUTES.CHAT },
        ]
    },
    {
        title: 'Others',
        items: [
            { name: 'Settings', icon: Settings, path: ROUTES.SETTINGS },
            { name: 'Get Help', icon: HelpCircle, path: ROUTES.GETHELP },
            { name: 'Logout', icon: LogOut, path: ROUTES.LOGOUT },
        ]
    }
]