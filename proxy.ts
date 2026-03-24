import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function proxy(request: NextRequest) {
    const authRes = await auth0.middleware(request);
    const pathname = request.nextUrl.pathname;

    // Allow auth routes, home, and static/public files
    const isPublicFile = /\.(.*)$/.test(pathname);

    if (
        pathname.startsWith("/auth") ||
        pathname === "/" ||
        isPublicFile
    ) {
        return authRes;
    }

    const { origin } = new URL(request.url);
    const session = await auth0.getSession(request);

    if (!session) {
        return NextResponse.redirect(`${origin}/auth/login`);
    }

    return authRes;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};