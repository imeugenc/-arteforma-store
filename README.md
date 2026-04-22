# ArteForma Store

Premium ecommerce storefront for ArteForma, built with Next.js App Router, TypeScript, Tailwind CSS, Stripe Checkout and Supabase-backed persistence.

Customer-facing contact is centered on:

- `contact@arteforma.ro`
- Instagram: `@arteformaro`
- TikTok: ArteForma official account

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

This protects the lightweight internal pages in production:

- `/internal/orders?token=YOUR_TOKEN`
- `/internal/products?token=YOUR_TOKEN`
- `/internal/media?token=YOUR_TOKEN`
- `/internal?token=YOUR_TOKEN`

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

## Product management right now

The current catalog is code-based and lives in:

- `lib/catalog.ts`

How to manage products in the current version:

1. Open `lib/catalog.ts`
2. Find the product by `slug`
3. Update:
   - `price`
   - `shortDescription`
   - `longDescription`
   - `sizes`
   - `colors`
   - `materials`
   - `badge`
   - `featured`
4. To hide a product without deleting it, set:

```ts
enabled: false
```

5. For static brand/product visuals, place assets in `public/brand` or another `public/*` folder and update the component/path that renders them.

There are also lightweight internal views:

```text
/internal/products?token=YOUR_INTERNAL_ORDERS_TOKEN
/internal/media?token=YOUR_INTERNAL_ORDERS_TOKEN
/internal?token=YOUR_INTERNAL_ORDERS_TOKEN
```

This is not a full CMS yet. It is a practical internal admin direction plus a cleaner structure for hiding/showing products during launch.

### Recommended next step for a minimal CMS

For real non-technical product management, the next step should be:

- a `products` table in Supabase
- image storage in Supabase Storage
- a small protected admin UI for add/edit/disable/image replace

That would allow:

- adding products without code edits
- updating prices and descriptions from a form
- enabling/disabling products
- replacing images directly from an admin area

### SQL prepared for the next admin step

The repo now also includes:

- `supabase/store-admin.sql`

This prepares the next scalable layer for:

- `products`
- `product_media`
- `customer_profiles`
- `order_status_events`

It is not wired live yet, but it gives a clean next-step schema for:

- product CRUD
- product media management
- future customer accounts
- future customer-visible order status updates

## Customer account direction

The project now includes a prepared customer-account route structure:

- `/account`
- `/account/login`
- `/account/orders`
- `/account/status`

These pages are intentionally future-facing and noindexed for now.

Recommended MVP direction:

- Supabase Auth with email OTP or magic link
- link orders to customer email / customer profile
- show order history and order status in account
- save basic profile details for returning customers

This keeps the experience simple and scalable without adding unnecessary social login complexity.

## Media and image strategy

Recommended practical workflow:

1. Prepare/crop/compress images before upload
2. Keep web-ready assets around 1600–2200 px on the long side for most product use cases
3. Prefer JPEG or WebP for most product photography and lifestyle images
4. Use Supabase Storage for long-term product/admin media
5. Keep folder structure separated by product / hero / brand assets

Important:

- Do not upload large raw photos directly into storage as live product assets
- Admin uploads should eventually save optimized variants, not originals straight from camera
- This keeps storage costs, performance, and bandwidth under control

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
- Internal pages are protected with `INTERNAL_ORDERS_TOKEN` and are not intended for public/customer use
- Customer accounts are prepared as route structure and data direction, but auth is not fully activated yet
