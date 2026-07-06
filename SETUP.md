# AI Meeting Notes — Complete Setup Guide

This guide takes you from zero to a live Vercel URL. Follow each section in order.

---

## Prerequisites

- Node.js 18+ installed
- npm 9+
- A [Supabase](https://supabase.com) account (free)
- A [Groq](https://console.groq.com) account (free)
- A [Stripe](https://stripe.com) account (test mode is fine)
- A [Vercel](https://vercel.com) account (free)
- A [GitHub](https://github.com) account

---

## Step 1 — Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Give it a name (e.g. `ai-meeting-notes`) and a strong database password
3. Wait for the project to finish provisioning (~1 min)

### Run the database migration

4. In your Supabase dashboard, go to **SQL Editor**
5. Click **New query**
6. Paste the entire contents of `supabase/migrations/001_schema.sql`
7. Click **Run** — you should see "Success. No rows returned"

### Get your API keys

8. Go to **Project Settings → API**
9. Copy these three values into your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   ← keep this secret!
```

### Configure Auth

10. Go to **Authentication → URL Configuration**
11. Set **Site URL** to your Vercel URL (e.g. `https://your-app.vercel.app`)
12. Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**
13. Also add `http://localhost:3000/auth/callback` for local dev

> **Tip**: If you want users to be auto-confirmed without email verification during testing, go to **Authentication → Providers → Email** and disable "Confirm email".

---

## Step 2 — Groq API Key

1. Go to [console.groq.com](https://console.groq.com) → **API Keys** → **Create API Key**
2. Copy the key (starts with `gsk_`)
3. Add to `.env.local`:

```
GROQ_API_KEY=gsk_your-key-here
```

> ⚠️ This key is **server-side only**. Never prefix it with `NEXT_PUBLIC_`.

---

## Step 3 — Stripe Setup

### Create a product

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and make sure you're in **Test mode** (toggle in top-right)
2. Go to **Products → Add product**
3. Name: `AI Meeting Notes Pro`
4. Pricing model: **Recurring**
5. Price: `$9.00` / month
6. Click **Save product**
7. On the product page, copy the **Price ID** (looks like `price_1ABC...`)

### Get API keys

8. Go to **Developers → API keys**
9. Copy:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID=price_...
```

### Enable Customer Portal

10. Go to **Settings → Billing → Customer portal**
11. Make sure it's **Active**
12. Enable "Cancel subscriptions" option

---

## Step 4 — Deploy to Vercel

### Push to GitHub

```bash
cd your-project-directory
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-meeting-notes.git
git push -u origin main
```

### Create Vercel project

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy** — this first deploy will fail (no env vars yet), that's OK

### Add environment variables

5. Go to your Vercel project → **Settings → Environment Variables**
6. Add ALL of these (copy from your `.env.local`):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `GROQ_API_KEY` | your Groq key |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | (set up next) |
| `STRIPE_PRO_PRICE_ID` | `price_...` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

7. After adding vars, go to **Deployments** and click **Redeploy**

---

## Step 5 — Stripe Webhook

1. Go to Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click **Add endpoint**
5. Click the endpoint → **Signing secret → Reveal**
6. Copy the `whsec_...` value
7. Go to Vercel → Settings → Environment Variables → update `STRIPE_WEBHOOK_SECRET`
8. Redeploy one more time

---

## Step 6 — Verify Everything Works

### Test signup
1. Visit `https://your-app.vercel.app/signup`
2. Create an account with a test email
3. If email confirmation is on, check your email
4. You should land on `/dashboard`

### Test AI generation
1. Paste a sample transcript into the text area
2. Click **Generate Notes**
3. You should see a summary + action items within ~5 seconds
4. Try 3 more times — the 4th should be blocked with "limit reached"

### Test Stripe (test mode)
1. Click **Upgrade to Pro** on your account page
2. You'll be redirected to Stripe Checkout
3. Use test card: **4242 4242 4242 4242**, any expiry, any CVC
4. After payment, you should be redirected to `/account?success=true`
5. Your plan badge should now show **Pro**
6. Click **Manage Subscription** → Stripe portal → Cancel
7. After cancelling, your plan should revert to **Free**

---

## Local Development

```bash
# 1. Copy env vars
cp .env.local.example .env.local
# Fill in your real values in .env.local

# 2. Start dev server
npm run dev

# 3. Test webhooks locally (requires Stripe CLI)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Invalid signature" on webhook | Make sure `STRIPE_WEBHOOK_SECRET` matches the endpoint's signing secret |
| Profile not created on signup | Run the SQL migration again, specifically the trigger part |
| Groq key exposed warning | Make sure you never use `NEXT_PUBLIC_GROQ_API_KEY` — it must be `GROQ_API_KEY` |
| Session lost on reload | Make sure `src/middleware.ts` is running — check Vercel function logs |
| Stripe portal error | Enable Customer Portal in Stripe Settings → Billing |
