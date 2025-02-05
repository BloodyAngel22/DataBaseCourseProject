import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/authenticated'];

const authCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!;

export function middleware(req: NextRequest) {
	const authCookie = req.cookies.get(authCookieName);
	const mainUrl = new URL('/', req.url);

	if (!authCookie && protectedRoutes.includes(req.nextUrl.pathname)) {
		return NextResponse.redirect(mainUrl);
	}

	if (!authCookie && req.nextUrl.pathname.startsWith('/authenticated')) {
		return NextResponse.redirect(mainUrl);
	}

	if (authCookie) {
		if (req.nextUrl.pathname === '/') {
			req.nextUrl.pathname = `/authenticated${req.nextUrl.pathname}`;
			return NextResponse.rewrite(req.nextUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/authenticated/:path*'],
}