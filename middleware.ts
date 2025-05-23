// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // console.log("Middleware invoked for:", request.nextUrl.pathname);

  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies: Record<string, string> = Object.fromEntries(
    cookieHeader
      .split("; ")
      .map((c: string): [string, string] | null => {
        const [name, ...rest] = c.split("=");
        if (name) {
          return [name, rest.join("=")];
        }
        return null;
      })
      .filter((entry): entry is [string, string] => entry !== null)
  );
  const token = cookies.token;
  console.log("Access token:", token);

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      console.log("No token found, redirecting...");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      console.log(`Token (${token}) found, redirecting...`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}
