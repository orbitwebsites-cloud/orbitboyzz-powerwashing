// Vercel Routing Middleware: x402 bot paywall.
// Humans pass through untouched; AI crawlers / scrapers get HTTP 402 with
// x402 payment requirements unless they pay. See x402/bot-paywall.js.
import { next } from "@vercel/functions";
import { handleBotPaywall } from "./x402/bot-paywall.js";

export const config = {
  runtime: "nodejs",
  // Skip static assets and always-free paths entirely (also re-checked in code).
  matcher: [
    "/((?!assets/|images/|fonts/|api/|_next/static/|\\.well-known/|robots\\.txt|llms\\.txt|favicon|sitemap).*)",
  ],
};

export default async function middleware(request) {
  const result = await handleBotPaywall(request);
  if (result.action === "respond") return result.response;
  return result.headers ? next({ headers: result.headers }) : next();
}
