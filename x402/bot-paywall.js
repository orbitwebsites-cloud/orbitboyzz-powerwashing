// x402 bot paywall: humans browse free, AI crawlers / scrapers pay per request.
//
// Called from the Vercel Routing Middleware in /middleware.js. Non-bot requests
// only pay for a User-Agent substring check; the x402 libraries are loaded
// lazily the first time a paying-bot request arrives. Any error fails open
// (the page is served normally) so the site can never break because of this.

/** Bots that must pay. Case-insensitive User-Agent substrings. */
export const BOT_UA_PATTERNS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "CCBot",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "Google-Extended",
  "Meta-ExternalAgent",
  "meta-externalfetcher",
  "FacebookBot",
  "Diffbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "YouBot",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "Timpibot",
  "ImagesiftBot",
  "omgili",
  "PetalBot",
  "Scrapy",
  "python-requests",
  "aiohttp",
  "Go-http-client",
  "curl",
  "wget",
  "HeadlessChrome",
  "PhantomJS",
];

/** Never charged (checked first): search engines, link previews, platform + uptime monitors. */
export const FREE_BOT_UA_PATTERNS = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Slurp",
  "Applebot", // plain Applebot only; Applebot-Extended is excluded in isFreeBot()
  "Twitterbot",
  "facebookexternalhit",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "WhatsApp",
  "TelegramBot",
  "Vercel",
  "UptimeRobot",
  "Pingdom",
  "StatusCake",
  "Better Uptime",
  "BetterStack",
  "Site24x7",
  "Checkly",
  "DatadogSynthetics",
  "Uptime-Kuma",
  "uptime",
];

const BOT_LC = BOT_UA_PATTERNS.map((p) => p.toLowerCase());
const FREE_LC = FREE_BOT_UA_PATTERNS.map((p) => p.toLowerCase());

function isFreeBot(ua) {
  return FREE_LC.some((p) =>
    p === "applebot" ? /applebot(?!-extended)/.test(ua) : ua.includes(p),
  );
}

/** True when this User-Agent should be asked to pay. */
export function isChargeableBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  if (isFreeBot(ua)) return false;
  return BOT_LC.some((p) => ua.includes(p));
}

const STATIC_EXT =
  /\.(?:css|js|mjs|cjs|map|json|webmanifest|png|jpe?g|gif|svg|webp|avif|ico|bmp|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|pdf|zip|txt|xml)$/i;

/** Paths that are always free, even for chargeable bots. */
export function isFreePath(pathname) {
  const p = pathname.toLowerCase();
  return (
    p === "/robots.txt" ||
    p === "/llms.txt" ||
    /^\/sitemap[^/]*\.xml$/.test(p) ||
    p.startsWith("/favicon") ||
    p.startsWith("/.well-known/") ||
    p.startsWith("/assets/") || // Vite build output
    p.startsWith("/images/") ||
    p.startsWith("/fonts/") ||
    p.startsWith("/_next/static/") ||
    p.startsWith("/api/") || // webhooks / checkout routes must never break
    STATIC_EXT.test(p)
  );
}

export function getConfig(env = process.env) {
  return {
    enabled: String(env.X402_ENABLED ?? "true").toLowerCase() !== "false",
    payTo: env.X402_PAY_TO || "0x0ba3b8796ce61ef8Cbd11A7F33Be31F1Fd4A03B3",
    price: env.X402_PRICE || "$0.001",
    network: env.X402_NETWORK || "eip155:8453",
    facilitatorUrl: env.X402_FACILITATOR_URL || "https://x402.org/facilitator",
    cdpKeyId: env.CDP_API_KEY_ID,
    cdpKeySecret: env.CDP_API_KEY_SECRET,
  };
}

const FACILITATOR_TIMEOUT_MS = 15_000;
const INIT_RETRY_MS = 60_000;

let paywallPromise = null;
let initFailedAt = 0;

async function createPaywall(cfg) {
  const [{ HTTPFacilitatorClient, x402ResourceServer, x402HTTPResourceServer, withPrivateCacheControl }, { ExactEvmScheme }, { decodePaymentRequiredHeader }] =
    await Promise.all([
      import("@x402/core/server"),
      import("@x402/evm/exact/server"),
      import("@x402/core/http"),
    ]);

  let facilitatorConfig;
  if (cfg.cdpKeyId && cfg.cdpKeySecret) {
    // Coinbase CDP facilitator (authenticated, supports Base mainnet).
    const { createFacilitatorConfig } = await import("@coinbase/x402");
    facilitatorConfig = createFacilitatorConfig(cfg.cdpKeyId, cfg.cdpKeySecret);
  } else {
    facilitatorConfig = { url: cfg.facilitatorUrl };
  }

  const facilitatorClient = new HTTPFacilitatorClient({
    ...facilitatorConfig,
    timeoutMs: FACILITATOR_TIMEOUT_MS,
  });
  const resourceServer = new x402ResourceServer(facilitatorClient).register(
    cfg.network,
    new ExactEvmScheme(),
  );
  const httpServer = new x402HTTPResourceServer(resourceServer, {
    "*": {
      accepts: [
        { scheme: "exact", price: cfg.price, network: cfg.network, payTo: cfg.payTo },
      ],
      description: "Paid access for automated agents",
      mimeType: "text/html",
    },
  });
  // Fetches facilitator capabilities and validates the route config.
  await httpServer.initialize();
  return { httpServer, withPrivateCacheControl, decodePaymentRequiredHeader };
}

function getPaywall(cfg) {
  if (!paywallPromise) {
    if (initFailedAt && Date.now() - initFailedAt < INIT_RETRY_MS) {
      const skip = new Error("x402 init recently failed; skipping");
      skip.quiet = true;
      return Promise.reject(skip);
    }
    paywallPromise = createPaywall(cfg).catch((err) => {
      paywallPromise = null;
      initFailedAt = Date.now();
      throw err;
    });
  }
  return paywallPromise;
}

function makeAdapter(request, url) {
  return {
    getHeader: (name) => request.headers.get(name) ?? undefined,
    getMethod: () => request.method,
    getPath: () => url.pathname,
    getUrl: () => request.url,
    getAcceptHeader: () => request.headers.get("accept") || "",
    getUserAgent: () => request.headers.get("user-agent") || "",
    getQueryParams: () => {
      const params = {};
      url.searchParams.forEach((value, key) => {
        const prev = params[key];
        if (prev === undefined) params[key] = value;
        else if (Array.isArray(prev)) prev.push(value);
        else params[key] = [prev, value];
      });
      return params;
    },
    getQueryParam: (name) => {
      const all = url.searchParams.getAll(name);
      if (all.length === 0) return undefined;
      return all.length === 1 ? all[0] : all;
    },
  };
}

function safeDecode(path) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** Builds a JSON 402 response carrying the x402 payment requirements in body + PAYMENT-REQUIRED header. */
function paymentRequiredResponse(instructions, decodePaymentRequiredHeader) {
  const headers = new Headers(instructions.headers);
  let body = instructions.isHtml ? {} : (instructions.body ?? {});
  const encoded = headers.get("payment-required");
  if (encoded) {
    try {
      body = decodePaymentRequiredHeader(encoded);
    } catch {
      /* keep library body */
    }
  }
  headers.set("Content-Type", "application/json");
  headers.set("Vary", "User-Agent");
  return new Response(JSON.stringify(body), { status: instructions.status, headers });
}

/**
 * Decide what to do with a request.
 * @returns {Promise<
 *   | { action: "pass" }
 *   | { action: "pass", headers: Record<string, string> }
 *   | { action: "respond", response: Response }
 * >}
 */
export async function handleBotPaywall(request, env = process.env) {
  try {
    const cfg = getConfig(env);
    if (!cfg.enabled || request.method === "OPTIONS") return { action: "pass" };
    if (!isChargeableBot(request.headers.get("user-agent"))) return { action: "pass" };

    const url = new URL(request.url);
    if (isFreePath(url.pathname)) return { action: "pass" };

    const { httpServer, withPrivateCacheControl, decodePaymentRequiredHeader } =
      await getPaywall(cfg);

    const adapter = makeAdapter(request, url);
    const context = {
      adapter,
      path: url.pathname,
      decodedPath: safeDecode(url.pathname),
      method: request.method,
      paymentHeader: adapter.getHeader("payment-signature") || adapter.getHeader("x-payment"),
    };

    const result = await httpServer.processHTTPRequest(context);

    if (result.type === "no-payment-required") return { action: "pass" };
    if (result.type === "payment-error") {
      return {
        action: "respond",
        response: paymentRequiredResponse(result.response, decodePaymentRequiredHeader),
      };
    }

    // payment-verified: settle via the facilitator, then serve the page.
    const settle = await httpServer.processSettlement(
      result.paymentPayload,
      result.paymentRequirements,
      result.declaredExtensions,
      { request: context },
      undefined,
      result.beforeHandlerSettlement,
    );
    if (!settle.success) {
      return {
        action: "respond",
        response: paymentRequiredResponse(settle.response, decodePaymentRequiredHeader),
      };
    }
    return {
      action: "pass",
      headers: {
        ...settle.headers,
        "Cache-Control": withPrivateCacheControl(null),
      },
    };
  } catch (err) {
    // FAIL OPEN: never break the site because of the paywall.
    if (!err?.quiet) console.warn("[x402-bot-paywall] failing open:", err?.message || err);
    return { action: "pass" };
  }
}
