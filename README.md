# Orbit PowerWash

Responsive single-page marketing site for Orbit PowerWash, serving Plainsboro and West Windsor, New Jersey.

## Local development

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Before launch

- **Re-activate FormSubmit for the new address.** The quote form now posts to `quote@orbitpowerwash.com` (the canonical address — note: **no "s"**; it previously pointed at `quotes@orbitpowerwash.com`). FormSubmit activation is per-address, so the old activation does **not** carry over. Submit the live form once, then open the confirmation email FormSubmit sends to `quote@orbitpowerwash.com` and click the activation link. **Until that is done, every lead silently fails** — no error is shown to the visitor. Verify by submitting a real test and confirming it lands in the inbox.
- Replace the temporary project photos, social links, and Google review link placeholder.

## Temporary stock photography

- Suburban exterior by Osmany M Leyva Aldana on Unsplash.
- Pressure-washing photo by Kyle E on Unsplash.
- Neighborhood aerial photo by Alex Reynolds on Unsplash.

Both are used under the Unsplash License and should be replaced with original Orbit PowerWash project photography when available.
