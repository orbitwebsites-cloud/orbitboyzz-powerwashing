# Systems Stack — The $0 Tool Kit

Every tool Orbit PowerWash runs on is free and works from your phone. This doc lists each one, how to set it up, and — most important — **what it is the system of record for**, so you always know where the real answer lives.

Business facts (name, phone, email, service area) live in `company-onepager.md`. Use them exactly.

**System-of-record cheat sheet:**

| Question | Where the truth lives |
|---|---|
| Did we get a new lead? | Email inbox (quote@orbitpowerwash.com) |
| Every lead, its status, every job | Google Sheets (lead tracker + job log) |
| When/where is the next job? | Google Calendar |
| What's our reputation / how do people find us? | Google Business Profile |
| What did the surface look like before/after? | Google Photos or Drive, folder per job |
| Who paid, how much, how? | Wave invoices + the money sheet (`money-and-policies.md`) |
| What did we say to the customer? | Phone texts |

---

## 1. Google Business Profile — reviews + local search

**System of record for:** your reputation and how customers in Plainsboro/West Windsor find you on Google Maps and Search.

**Setup (one time):**
1. Go to google.com/business, sign in with the Orbit Gmail account.
2. Create the profile: **Orbit PowerWash**, category "Pressure Washing Service."
3. Set it as a **service-area business** (you go to them) — add Plainsboro and West Windsor as service areas. Don't publish a home address if you don't want it public.
4. Add phone (609) 297-7412, website orbitpowerwash.com, services, and hours.
5. Request verification. It can take a few days — start this **today** so it's live during week one.

**Ongoing:** After every finished job, text the customer your review link and ask. Reviews are the single biggest free lever for a new local business. Reply to every review, good or bad, in the brand voice.

---

## 2. Website quote form → inbox — lead capture

**System of record for:** the raw first contact from a web lead.

**How it works:** The quote form on orbitpowerwash.com posts through **FormSubmit** (a free form-to-email service) and emails the lead to your inbox. No server, no monthly fee.

**Setup (one time):**
1. After the site is live, submit the form once yourself. FormSubmit sends a one-time **activation email** — click the link or the form stays inactive and you lose leads silently.
2. Send a real test lead and confirm it lands in the inbox.

> **VERIFY BEFORE LAUNCH — real issue:** The canonical inbox is **quote@orbitpowerwash.com** (see `company-onepager.md`). The current site code submits to `quotes@orbitpowerwash.com` (**with an "s"**). These don't match. Confirm which mailbox actually exists and make the form and the mailbox agree **exactly** before you rely on the form — otherwise web leads bounce or vanish. (Fixing the site is outside this admin doc; flagging it here so it doesn't get missed.)

**Ongoing:** Every form lead gets copied into the lead tracker (below) the moment you see it. The inbox is where a lead *arrives*; the tracker is where it *lives*.

---

## 3. Google Sheets — lead tracker + job log

**System of record for:** every lead and every job, start to finish. This is the spreadsheet you look at to answer "who owes me a call?" and "what did I make this week?"

**Do not redefine the columns here.** The lead-tracker schema is defined once in **`../growth/lead-tracker.md`** — that file is the source of truth for the columns and statuses. Build the Google Sheet to match it exactly, and if the schema changes, change it there.

**Setup (one time):**
1. New Google Sheet named "Orbit — Leads & Jobs."
2. Tab 1 = **Leads/Jobs**, columns per `../growth/lead-tracker.md`.
3. Tab 2 = **Money in/out** (columns defined in `money-and-policies.md`).
4. Install the Google Sheets app on your phone so you can update it from the driveway.

---

## 4. Google Calendar — scheduling

**System of record for:** where you need to be and when.

**Rules — every booked job is a calendar event:**
- **Title:** `[Service] — [Customer last name]` (e.g., "Driveway — Rivera").
- **Location field:** the full service address. This makes the event tap-to-navigate from your phone.
- **Time = arrival window,** not a single minute. Tell customers a window ("between 9 and 10"), and block it that way.
- **Travel buffer:** add 20–30 min before and after each job as its own block or padding, so back-to-back jobs across Plainsboro/West Windsor don't collide. Never book two jobs so tight you have to rush the first.
- Put your phone number and the quoted price in the event notes so everything's in one tap.

---

## 5. Phone texts — primary customer channel

**System of record for:** what you actually told the customer.

Texting is the main way you talk to customers — quotes, confirmations, "on my way," review requests. It's fast, it's free, and people read it. Rules:
- Reply fast (see brand voice rule 3). A quick text now beats a polished one tomorrow.
- Confirm the day before every job by text.
- Send an "on my way" text when you leave for the job.
- Keep it in the brand voice: local, plain, human.
- If a decision matters (price, date, redo), get it **in the text thread** so there's a record. Don't rely on memory or phone calls alone.

---

## 6. Google Photos or Drive — before/after photos, folder per job

**System of record for:** proof of the work.

**Setup:** One folder **per job**, named `[Date] — [Customer last name] — [Service]` (e.g., "2026-07-21 — Rivera — Driveway").

**Every job, no exceptions:**
- Shoot **before** photos the moment you arrive, before you touch anything.
- Shoot **after** photos from the same angles.
- Same angle before/after is what makes the pair worth anything — for the customer, for your Google profile, and for social posts.
- Back them up to the cloud that night (see the evening routine) so a lost phone doesn't lose your best marketing.

---

## 7. Invoicing & payment — free path

**System of record for:** who paid, how much, and how.

**The path:** **Wave** (waveapps.com) for free invoicing and receipts — it emails a clean, professional invoice and lets you record payments; **default to Zelle** (bank-to-bank, **no fees**), or cash/Venmo on the spot. Only take card through a free-tier tool when a customer insists, because **card takes a percentage cut** off every job — on thin week-one margins, steer people to Zelle or cash first.

- **Zelle — no fees.** Best option. Money lands in your bank, you keep 100%.
- **Cash** — fine, give a receipt (template in `money-and-policies.md`).
- **Venmo** — easy, fee-free for standard personal transfers; confirm the payment clears before you leave.
- **Card (last resort)** — only if the customer can't do the above. A free-tier processor takes a % of the total. Never eat that on every job by default.

Full payment policy, the invoice/receipt template, and the money-tracking sheet all live in **`money-and-policies.md`**.

---

## Daily 10-Minute Admin Routine

Twice a day, ten minutes total. Do it from your phone. This is the whole back office.

**Morning (5 min) — get pointed the right way:**
1. Check the **inbox** (quote@orbitpowerwash.com) for new form leads.
2. Scan the **lead tracker** — who still needs a reply or a quote? Reply to those first.
3. Check the **calendar** — where am I today, what are the addresses and windows, is my travel buffer real?

**Evening (5 min) — close the loop:**
1. Update the **lead tracker**: new leads in, statuses moved, today's jobs marked done and paid.
2. Send **follow-ups**: quotes you owe, review requests to today's finished customers, next-day confirmations.
3. **Back up photos**: push today's before/after folders to Google Photos/Drive. Never let job photos live only on the phone.
