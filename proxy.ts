import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
}

export const config = {
    matcher: '/((?!login|api|_next/static|_next/image|favicon.ico).*)'
};