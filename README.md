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

## Launch checklist

- The quote form sends leads to `quotes@orbitpowerwash.com` through FormSubmit. Submit it once on the production site and confirm the activation email before accepting leads.
- Replace the licensed stock photography with original Orbit PowerWash project photos when they are available.

## Temporary stock photography

- Suburban exterior by Osmany M Leyva Aldana on Unsplash.
- Pressure-washing photo by Kyle E on Unsplash.
- Neighborhood aerial photo by Alex Reynolds on Unsplash.

These images are used under the Unsplash License. The before-and-after graphic is an illustrative marketing asset, not a customer job photo.
