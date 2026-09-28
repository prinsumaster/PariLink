# PariLink — briefing questions

**For ChatGPT:** You know the owner's full vision for PariLink. I'm the AI coding
agent auditing and hardening the actual PariLink codebase (a NestJS + Next.js
logistics platform). I keep making wrong assumptions about the business model,
which makes my technical advice miss. Please answer each question concretely so I
can match the work to the real plan. "Not decided yet" is a perfectly good answer.
Keep it plain and specific.

---

## 1. What it is, and who it's for
- In 2–3 sentences: what is PariLink and what problem does it solve?
- Who exactly are the paying customers? (transport companies? brokers? individual
  truck owners? something else?)
- Who is the very first real customer or demo audience — and by when?

## 2. Deployment — the single most important question
- Is PariLink ONE platform the owner runs, that many customer companies log into
  and share (walled off from each other)? OR does each customer get their own
  separate installation on their own server?
- If it's shared: roughly how many customer companies, and how many users each?
- Where does it run — the owner's cloud, or the customer's own hardware?

## 3. Data isolation
- If several customer companies share the platform, must their data be completely
  invisible to each other?
- Inside a SINGLE customer, are there branches or depots that also shouldn't see
  each other's loads/trucks? Or does everyone in one company see everything?

## 4. Money
- Do customers pay ONLINE by card inside the app? Or does the owner set up each
  customer and bill them directly, offline?
- Is there a per-customer limit (max trucks / drivers / users)? Should that stay?
- Should the Stripe and Razorpay payment code stay, or be removed?

## 5. Scope — what's actually core
The codebase has ~30 modules: dispatch, loads, fleet, drivers, finance/invoicing,
warehouse, CRM, AI copilot, chat, marketplace, telematics, HR, documents, more.
- Which 5–8 modules MUST work for the first demo or pilot?
- Which were built speculatively / are "later" and could be hidden or removed now?

## 6. Users and access
- How do people log in — email + password, company SSO, phone number?
- Is there a driver mobile app (POD photo upload, GPS)? Is it in scope right now?
- What are the main roles? (dispatcher, fleet manager, finance, admin, driver?)

## 7. India-specific + outside services
- Does it need Indian features — GST invoicing, FASTag, e-way bills?
- Does it send SMS, send email, or show maps? For each: whose account pays —
  the owner's, or does each customer plug in their own?

## 8. The immediate goal
- What is the single most important outcome in the next 1–2 weeks: a working demo,
  a live pilot with one real transport company, an investor pitch, or a full launch?
- What does "done" look like for that specific goal?

---

**Owner:** paste ChatGPT's answers back to the coding agent as-is. It doesn't need
them polished — raw and honest is best.
