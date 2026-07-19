# Lead Tracker — Run It From Your Phone

One list. Every lead goes in it the moment it exists — a door, a text, a Nextdoor DM, a referral. If it's not in the tracker, it doesn't exist and you *will* forget to follow up. Following up is where half your bookings come from.

**Where to keep it:** a **Google Sheet** (opens on your phone, syncs everywhere, free) is best. A Markdown note or the Notes app works too. Use whatever you'll actually update between doors.

---

## The table (columns, in order)

| Date | Name | Address / Street | Source | Service | Status | Quote $ | Follow-up date | Notes |
|------|------|------------------|--------|---------|--------|---------|----------------|-------|

**Google Sheets header row (copy/paste into row 1):**

```
Date | Name | Address/Street | Source | Service | Status | Quote $ | Follow-up Date | Notes
```

**Column meanings:**
- **Date** — when the lead first came in.
- **Name** — first name is fine.
- **Address / Street** — needed to quote and to cluster knocks/neighbor specials.
- **Source** — `door` · `network` · `nextdoor` · `facebook` · `marketplace` · `craigslist` · `whatsapp` · `referral` · `gbp`. (Track this so Sunday you know which channel to double down on.)
- **Service** — `driveway` · `house` · `patio` (or combo).
- **Status** — one of the pipeline stages below.
- **Quote $** — the number you sent (from `sales/pricing-guide.md`).
- **Follow-up date** — the next date you owe them a touch. Sort by this daily.
- **Notes** — everything else: "not home, re-knock Sat," "wants neighbor rate w/ #14," "cash," "dog in yard," "asked about patio too."

---

## Pipeline stages (Status values)

Move each lead left-to-right as it progresses:

1. **new** — captured, not yet quoted. (Includes door "not-home / re-knock" — put that in Notes.)
2. **quoted** — you sent a price. Follow-up clock starts now.
3. **booked** — date on the calendar. Send day-before confirmation (`ready-to-post.md`).
4. **done** — job completed. Send review-ask same day.
5. **reviewed** — they left a review and/or referred someone. This is the finish line.

Dead leads: **lost** (only after the follow-up rule below is satisfied) or **no** (hard no / no-knock — don't chase).

**Running bookings count** = rows at status `booked`, `done`, or `reviewed`. That's your number toward 10. Check it against the ladder in `00-week-one-sprint.md` every night.

---

## The rules (non-negotiable — this is the whole edge)

1. **15-minute response, 8am–8pm.** Every new lead (call, text, DM, form) gets a reply within 15 minutes during waking hours. You're a solo operator — *speed* is your advantage over bigger, slower companies. A lead answered in 15 min books far more often than one answered in 3 hours.

2. **Every quote gets two follow-ups: 24h and 72h.** When you set status to `quoted`, put tomorrow's date in Follow-up. Send the 24h text (`ready-to-post.md`). No reply → set Follow-up to +3 days, send the 72h text.

3. **No lead is closed `lost` before 2 follow-ups.** If it's still quiet after both the 24h and 72h touches, *then* you may mark `lost`. Not before. Most "no's" are just "not yet."

4. **Log the door, even the empty ones.** Not-home doors get a `new` row with "re-knock [day]" in Notes so weekend daytime knocking has targets.

5. **Same-day review ask.** The minute a job is `done`, send the review-ask text while they're happiest. Don't wait until Sunday.

6. **Sort by Follow-up date each morning.** Anything due today or overdue gets handled first, before you knock a single new door.

---

## Daily 5-minute routine

**Morning:**
- [ ] Sort by Follow-up date. Send every follow-up due today (24h / 72h texts).
- [ ] Reply to any overnight leads (15-min rule the moment you're up).
- [ ] Send day-before confirmations for tomorrow's `booked` jobs.

**After each knock session / throughout the day:**
- [ ] Add every new door/contact as a row immediately (don't trust memory to the end of the street).
- [ ] Move statuses forward as things happen.

**Evening:**
- [ ] Mark completed jobs `done`, send review asks.
- [ ] Count `booked`+`done`+`reviewed` → drop the running total into the scorecard (`00-week-one-sprint.md`).
- [ ] Set tomorrow's follow-up dates.

---

## Example rows (what good looks like)

| Date | Name | Address / Street | Source | Service | Status | Quote $ | Follow-up date | Notes |
|------|------|------|------|------|------|------|------|------|
| 7/20 | Maria | 14 Maple Ct | door | driveway | booked | (see pricing) | — | Wed 5pm. Neighbor rate if #16 books too |
| 7/20 | Dev | 16 Maple Ct | door | driveway+patio | quoted | (see pricing) | 7/21 | Maria's neighbor. Sent quote, wants to think |
| 7/20 | Ana | Ravens Crest area | nextdoor | house | new | — | 7/20 | DM'd, need address. Reply sent 6:42pm |
| 7/19 | Uncle Sam | 8 Birch Ln | network | driveway | done | (see pricing) | — | First job! Review ask sent |
