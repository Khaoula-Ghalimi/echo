import Image from "next/image";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Auth0 placeholder home page
          </h1>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {isLoggedIn
              ? `You are connected${session?.user?.name ? ` as ${session.user.name}` : ""}.`
              : "You are not connected yet."}
          </p>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {isLoggedIn ? (
            <a
              className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 md:w-[158px]"
              href="/auth/logout"
            >
              Logout
            </a>
          ) : (
            <>
              <a
                className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 md:w-[158px]"
                href="/auth/login?returnTo=/dashboard"
              >
                Login
              </a>
            </>
          )}
        </div>
      </main>
    </div>
  );
}