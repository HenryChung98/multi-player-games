import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function middleware(req) {
  const protectedPaths = ["/dashboard"];
  const loginPage = "/auth/login";

  // get path
  const { pathname } = req.nextUrl;

  // get values of session token
  const sessionToken = req.cookies.get("session_token");

  // if sessionToken undefined and path starts with protectedPath
  if (
    !sessionToken &&
    protectedPaths.some((path) => pathname.startsWith(path))
  ) {
    // redirect to /auth/login?redirect=dashboard
    const redirectUrl = `${loginPage}?redirect=${encodeURIComponent(pathname)}`; 
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // if all good
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
