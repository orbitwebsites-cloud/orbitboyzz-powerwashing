# Orbit PowerWash

Responsive React marketing site for Orbit PowerWash, serving Plainsboro and West Windsor, New Jersey.

## Local development

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Analytics

PostHog is enabled in production for the Orbit PowerWash US project. These optional environment variables can override the project configuration in the hosting provider:

```bash
VITE_POSTHOG_PROJECT_TOKEN=phc_your_project_token
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

Copy `.env.example` to `.env.local` if you need to test locally, then set `VITE_POSTHOG_ENABLE_DEV=true`. Local analytics are disabled by default so development traffic does not pollute production reports.

The site records page views and these privacy-safe conversion events without names, emails, phone numbers, or addresses:

| Event | Trigger |
| --- | --- |
| `quote_cta_clicked` | Visitor opens the quote section from a tracked CTA |
| `phone_cta_clicked` | Visitor clicks a call or text link |
| `quote_request_attempted` | A valid quote form submission begins |
| `quote_request_submitted` | FormSubmit accepts the quote request |
| `quote_request_failed` | The quote request cannot be delivered |
| `quote_request_validation_failed` | The visitor submits an incomplete form |

Autocapture and session recording are disabled to avoid collecting form content. Anonymous page and conversion analytics remain enabled.

## x402 bot paywall

`middleware.js` (Vercel Routing Middleware, Node runtime) charges AI crawlers and scrapers per request using [x402](https://github.com/coinbase/x402). Humans and search engines browse free.

- **Charged** User-Agents (`BOT_UA_PATTERNS` in `x402/bot-paywall.js`): GPTBot, ClaudeBot, PerplexityBot, CCBot, Bytespider, curl, python-requests, HeadlessChrome, and similar. They get HTTP `402` with x402 payment requirements (JSON body plus a `PAYMENT-REQUIRED` header). A valid payment is verified and settled through the facilitator, then the page is served with a settlement response header.
- **Never charged:** Googlebot, Bingbot, DuckDuckBot, plain Applebot, link-preview bots (Slack, Discord, X, LinkedIn, WhatsApp, Telegram, Facebook), Vercel, and uptime monitors.
- **Always free paths:** `/robots.txt`, `/sitemap*.xml`, `/favicon*`, `/llms.txt`, `/.well-known/*`, `/assets/*`, `/images/*`, static files, and `/api/*`.
- **Fails open:** if the facilitator is down or anything throws, the page is served normally.

Configuration (see `.env.example`): `X402_ENABLED`, `X402_PAY_TO`, `X402_PRICE` (default `$0.001`), `X402_NETWORK` (default `eip155:8453`, Base mainnet USDC), `CDP_API_KEY_ID` + `CDP_API_KEY_SECRET` (Coinbase CDP facilitator), and `X402_FACILITATOR_URL` (fallback, default `https://x402.org/facilitator`).

**Set the CDP keys in Vercel for production.** The public x402.org facilitator only supports testnets, so on Base mainnet without CDP keys the paywall fails open and bots read the site for free.

## Launch checklist

- The quote form sends leads to `quotes@orbitpowerwash.com` through FormSubmit. Submit it once on the production site and confirm the activation email before accepting leads.
- Replace the licensed stock photography with original Orbit PowerWash project photos when they are available.

## Temporary stock photography

- Suburban exterior by Osmany M Leyva Aldana on Unsplash.
- Pressure-washing photo by Kyle E on Unsplash.
- Neighborhood aerial photo by Alex Reynolds on Unsplash.

These images are used under the Unsplash License. The before-and-after graphic is an illustrative marketing asset, not a customer job photo.
