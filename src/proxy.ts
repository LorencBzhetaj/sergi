import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// Suspicious patterns to block (path traversal, XSS, SQLi in URL)
const SUSPICIOUS_PATTERNS = [
  /\.\.\//,
  /<script/i,
  /union\s+select/i,
  /eval\(/i,
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block suspicious requests
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(req.url)) {
      return new NextResponse("Bad Request", { status: 400 });
    }
  }

  // Inject pathname header so server layouts can read current path
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken =
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Add security headers to all responses
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
