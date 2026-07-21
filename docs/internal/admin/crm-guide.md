# Orbit PowerWash — CRM Guide (the phone app)

The **CRM** is a single web page that runs the whole back office from your phone: leads, quotes, jobs, invoices, and the money sheet. It is the digital version of the paper docs in this folder — same rules, same templates, same prices — just faster to run between doors.

- **File:** `crm/index.html` (in this repo).
- **It is 100% offline.** No login, no internet, no accounts. Everything is stored *in your phone's browser*, on your phone only.
- **It is NOT part of the public website.** It is never deployed by the Vite build, never uploaded, and not linked from orbitpowerwash.com. It is a private tool you open locally. (See "It is not on the public site" at the bottom.)

---

## 1. Open it on your phone (add to home screen)

You want this to feel like an app — one tap, no browser bar.

**iPhone (Safari):**
1. Get `crm/index.html` onto the phone (email it to yourself, save to Files, or open from a synced folder) and open it in **Safari**.
2. Tap the **Share** button → **Add to Home Screen** → name it "Orbit CRM" → **Add**.
3. Launch it from the new home-screen icon. It opens full-screen.

**Android (Chrome):**
1. Open `crm/index.html` in **Chrome**.
2. Tap the **⋮** menu → **Add to Home screen** → **Add**.
3. Launch from the icon.

**Desktop:** just double-click the file — it opens in any browser. Same app, bigger screen.

> **One phone, one browser.** The data lives in *that* browser's storage. If you open the file in a different browser or a different phone, it starts empty. Pick one and stick with it. Move data between devices with the JSON backup (below).

---

## 2. The nightly backup habit (do this every night)

Your data lives only in the browser. If you clear browsing data, delete the app, or your phone dies, **it's gone unless you have a backup.** So:

**Every night, as part of the evening routine:**
1. Tap the **gear icon** (top-right).
2. Tap **Export backup (JSON)**. A file downloads (e.g. `orbitpw-crm-backup-2026-07-21.json`).
3. Let it save to your phone / email it to yourself / drop it in Drive.

To restore (new phone, or you cleared data): gear → **Import backup** → pick the JSON file → confirm. It replaces everything with the backup.

You can also pull **Leads CSV** and **Money CSV** from the gear (or from the Leads/Money tabs) any time you want the data in a spreadsheet — e.g. for the Sunday `week-one-review.md`.

**First-time setup (do once):** gear → set **Your name** (drops into every text template as "[your name]") and your **Google review link** (drops into the review-ask text and the invoice footer). Tap **Save settings**.

---

## 3. How each tab maps to the paper docs

The app has six tabs across the bottom. Each one *is* one of your docs:

| Tab | Replaces / runs | Doc |
|---|---|---|
| **Today** | The daily 5-minute routine + the end-of-day scorecard. Shows bookings toward 10, follow-ups due, today's jobs, and the scorecard numbers (doors knocked is the only one you type — the rest are computed). | `growth/lead-tracker.md`, `growth/00-week-one-sprint.md` |
| **Leads** | The lead tracker table (Date · Name · Address · Source · Service · Status · Quote $ · Follow-up · Notes). Add/edit leads, filter by status, search, and advance the pipeline one tap at a time. | `growth/lead-tracker.md` |
| **Quote** | The pricing guide + quoting process, as a calculator. Pick services, it applies the discounts correctly, shows the math, and writes the exact text-message quote to copy/paste. | `sales/pricing-guide.md`, `sales/quoting-process.md` |
| **Jobs** | The job-day runbook's text touches. Booked jobs sorted by date, tap the address for Google Maps directions, and one-tap the day-before confirm, "on my way," and same-day review-ask texts. Mark done → capture payment. | `operations/job-day-runbook.md`, `growth/ready-to-post.md` |
| **Invoice** | The invoice/receipt template with auto-incrementing invoice numbers. | `admin/money-and-policies.md` |
| **Money** | The money sheet (Date · In/Out · Customer/Vendor · Description · Amount · Method · Invoice # · Receipt saved?) with weekly In/Out/Cleared totals and CSV export. | `admin/money-and-policies.md` |

### The rules are built in (you don't have to remember them)
- **Move to `quoted`** → it auto-sets the **24h follow-up** for tomorrow.
- **Log a follow-up** (button on quoted leads) → it pushes the next touch to **+3 days (72h)**.
- **Marking `lost`** before you've logged **2 follow-ups** → it stops you and makes you confirm ("most no's are not yet").
- **Discounts** — the Quote tab applies **founding 20%** vs **bundle (10% for 2, 15% for 3+)** as the **larger of the two, never both**, never below the **$150 minimum**, and **never on trash bins** (bins are an add-on, never a bundle service, never discounted).
- **Invoice numbers** count up (0001, 0002, …) and are **never reused** — the app keeps the sequence for you.
- **Mark done** prompts for the payment method + amount, writes the **In** row to the money sheet, and offers to make the invoice.

---

## 4. A typical day in the app

1. **Morning — Today tab.** Handle every follow-up shown as "due/overdue" (tap it to open the lead). Send day-before confirms for tomorrow's jobs from the **Jobs** tab.
2. **Knocking — Leads tab.** Tap **+ Add lead** for every door/text/DM the moment it happens. Not-home? Add it as `new` with "re-knock Sat" in Notes.
3. **A lead asks for a price — Quote tab.** Pick the services, check the math, fill name + day, **Copy quote**, paste into your text app, send. Tap **Save quote → lead** so it's logged and the follow-up clock starts.
4. **They say yes — Leads tab.** Advance the lead → **booked** (enter date + arrival window).
5. **Job day — Jobs tab.** "On my way" text → do the work → **Mark done → pay** (method + amount). Then one-tap the **review-ask** text same day.
6. **Get paid / send receipt — Invoice tab.** Load from the job, **Assign #**, then **Copy** it into a text or **Print / PDF** to save it.
7. **Night — Today tab** for the scorecard, then **gear → Export backup**.

---

## 5. It is not on the public site (important)

This CRM is a **private, local tool**. To be explicit:

- It lives at `crm/index.html` and is **not wired into the Vite build**. `npm run build` / the deployed site never include it.
- It makes **zero external requests** — no fonts, no CDNs, no analytics, no server. Nothing you type ever leaves your phone.
- There is **no login and no cloud**. That's why the **nightly JSON backup is the only safety net** — take it seriously.
- Don't paste the CRM file into the website's `public/` or `src/` folders, and don't link to it from any public page. It's yours, on your phone, only.

Questions the app can't answer (registration, insurance, NJ sales tax) are still in `admin/money-and-policies.md` under **[NOT LEGAL OR TAX ADVICE]** — verify those with a professional.
