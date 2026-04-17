import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/* Routes that require a signed-in user */
const isProtected = createRouteMatcher([
  "/sanctuary(.*)",
  "/community(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();   // redirects to /sign-in if not authenticated
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
