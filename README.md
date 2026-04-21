# ArteForma Store

Premium ecommerce storefront for ArteForma, built with Next.js App Router, TypeScript, Tailwind CSS, Stripe Checkout and Supabase-backed persistence.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Stripe Checkout + Stripe webhooks
- Supabase for custom orders and paid ecommerce orders

## Local development

1. Copy `.env.example` to `.env.local`
2. Fill the environment variables you already have
3. Install dependencies:

```bash
npm install
```

4. Start development:

```bash
npm run dev
```

5. Run checks before deploy:

```bash
npm run lint
npx next build --webpack
```

## Required environment variables

### Core

- `NEXT_PUBLIC_SITE_URL`

### Stripe

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Behavior:

- In local development, if `STRIPE_SECRET_KEY` is missing, checkout falls back to the local success flow.
- In production, missing Stripe configuration returns a clear error instead of pretending checkout works.
- Paid order persistence happens after the Stripe webhook confirms `checkout.session.completed`.

### Supabase

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_CUSTOM_ORDERS_TABLE`
- `SUPABASE_CUSTOM_ORDERS_BUCKET`
- `SUPABASE_ORDERS_TABLE`
- `SUPABASE_ORDER_ITEMS_TABLE`

Behavior:

- In local development, if Supabase is not configured, custom orders fall back to local file storage for testing.
- In production, Supabase must be configured or the custom order endpoint returns a setup error.
- Paid product orders should be considered production-ready only after Supabase and Stripe webhooks are configured.

### Internal order view

- `INTERNAL_ORDERS_TOKEN`

This protects the lightweight internal orders page in production:

- `/internal/orders?token=YOUR_TOKEN`

## Supabase setup

1. Create a Supabase project
2. Run the SQL from [supabase/custom-orders.sql](/Users/eugencostache/Documents/Codex/2026-04-21-tu-ai-putea-s-mi-faci/supabase/custom-orders.sql)
3. Add the following env vars:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Keep these defaults unless you intentionally rename resources:
   - `SUPABASE_CUSTOM_ORDERS_TABLE=custom_orders`
   - `SUPABASE_CUSTOM_ORDERS_BUCKET=custom-order-files`
   - `SUPABASE_ORDERS_TABLE=orders`
   - `SUPABASE_ORDER_ITEMS_TABLE=order_items`

Notes:

- The service role key is used server-side only for writes and internal reads.
- Uploaded custom-order reference files are stored in the configured Supabase bucket.
- The current bucket is public for simpler launch setup. If you need private uploads later, switch to signed URLs.

## Stripe setup

1. Create a Stripe account and copy your secret key into `STRIPE_SECRET_KEY`
2. Set `NEXT_PUBLIC_SITE_URL` to your real domain
3. Create a webhook endpoint in Stripe pointing to:

```text
https://your-domain.com/api/stripe/webhook
```

4. Subscribe the webhook to:
   - `checkout.session.completed`
5. Copy the webhook signing secret into:

```text
STRIPE_WEBHOOK_SECRET
```

Notes:

- Checkout prices are derived server-side from the local product catalog, not trusted from the browser.
- After successful payment, the webhook stores the order in Supabase and creates related order items.
- The success page can show a richer confirmation state when the webhook has already persisted the order.

## Order data model

Supabase stores:

- `custom_orders`
- `orders`
- `order_items`

Custom orders remain separate from paid product orders.

## Internal order view

Once Supabase and the webhook are configured, you can view recent orders at:

```text
/internal/orders?token=YOUR_INTERNAL_ORDERS_TOKEN
```

This is intentionally lightweight and practical for a small launch.

## Analytics

Current tracked events:

- `add_to_cart`
- `checkout_start`
- `custom_order_submit`
- `purchase`

Tracking currently goes through the internal `/api/track` endpoint and is structured so GA4, Meta or TikTok integrations can be added later without rewriting the UI flow.

## Deployment on Vercel

1. Push the repo to GitHub
2. Import into Vercel
3. Add all env vars from `.env.example`
4. Configure Stripe webhook with your production domain
5. Configure Supabase and run the SQL migration
6. Deploy

## Current launch notes

- The store is structurally ready for a small premium ecommerce launch
- Paid orders persist only after Stripe webhook delivery, which is the correct production path
- Success page becomes most useful when webhook delivery is configured and reachable
- Product catalog is still code-based, which is acceptable for launch but can later move to a CMS or database
