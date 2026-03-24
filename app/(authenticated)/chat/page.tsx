import { auth0 } from "@/lib/auth0";
import AppChat from "../../../components/custom/app-chat";

export default async function ChatPage() {
    const session = await auth0.getSession();
    console.log("Session:", session);
    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
                <AppChat />
            </main>
        </div>
    );
}