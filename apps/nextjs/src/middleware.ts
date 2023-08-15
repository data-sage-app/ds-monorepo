import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],

  afterAuth(auth, req, evt) {
    // Reditect to stores selection page on sign up or sign in if already logged in

    if (auth.userId && ["/sign-in", "/sign-up"].includes(req.nextUrl.pathname)) {
      const path = new URL('/stores', req.url)
      return NextResponse.redirect(path);
    }
    

    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    
    // redirect them to organization selection page
    if(auth.userId && !auth.orgId && req.nextUrl.pathname !== "/stores"){
      const orgSelection = new URL('/stores', req.url)
      return NextResponse.redirect(orgSelection)
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
