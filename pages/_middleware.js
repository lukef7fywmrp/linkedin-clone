// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   // Token will exist if the user is logged in
//   const token = await getToken({ req, secret: process.env.JWT_SECRET });

//   const { pathname } = req.nextUrl;
//   // Allow the requests if the following is true...
//   // 1) Its a request for next-auth session & provider fetching
//   // 2) the token exist
//   if (pathname.includes("/api/auth") || token) {
//     return NextResponse.next();
//   }

//   // Redirect them to login if they dont have token AND are requesting a protected route
//   if (!token && pathname !== "/home") {
//     return NextResponse.redirect("/home");
//   }
// }

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/** @param {import("next/server").NextRequest} req */
export async function middleware(req) {
  if (req.nextUrl.pathname === "/") {
    const session = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
    if (!session) return NextResponse.redirect("/home");
    // If user is authenticated, continue.
  }
}
