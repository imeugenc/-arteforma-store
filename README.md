# ArteForma Store

Premium ecommerce storefront for ArteForma, built with Next.js App Router, TypeScript, Tailwind CSS, Stripe Checkout and a separated architecture for custom leads vs store orders.

Customer-facing contact is centered on:

- `contact@arteforma.ro`
- Instagram: `@arteformaro`
- TikTok: ArteForma official account

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Stripe Checkout + Stripe webhooks
- SMTP email flow for custom order requests
- Supabase for paid store orders and next-step admin/account/status direction

## Flow separation

### Custom orders

- route: `/api/custom-orders`
- purpose: lead / inquiry flow
- delivery: server-side email
- destination: `contact@arteforma.ro`
- Supabase dependency: none

### Store orders

- routes: `/api/checkout` + `/api/stripe/webhook`
- purpose: paid product orders
- payment: Stripe Checkout
- persistence: Supabase
- next-step use: admin orders, customer account history, order status

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

### Email for custom order requests

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `CUSTOM_ORDERS_TO_EMAIL`

Behavior:

- The custom order form sends an email lead to `contact@arteforma.ro` or to `CUSTOM_ORDERS_TO_EMAIL` if you want a separate inbox.
- This flow is intentionally independent from Supabase.
- In local development, if SMTP is not configured, the request is stored locally for testing and still returns a success response.
- In production, SMTP must be configured for the custom order form to work live.

### Supabase

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_ORDERS_TABLE`
- `SUPABASE_ORDER_ITEMS_TABLE`

Behavior:

- Supabase is the direction for paid product orders, internal order management, future customer accounts and future product/media admin tools.
- Paid product orders should be considered production-ready only after Supabase and Stripe webhooks are configured.

### Internal order view

- `INTERNAL_ORDERS_TOKEN`

This protects the lightweight internal pages in production:

- `/internal?token=YOUR_TOKEN`
- `/internal/orders?token=YOUR_TOKEN`
- `/internal/products?token=YOUR_TOKEN`
- `/internal/media?token=YOUR_TOKEN`

## Email setup for custom orders

Recommended practical setup:

1. Use the SMTP details for the mailbox or provider that will send mail on behalf of ArteForma
2. Set `CUSTOM_ORDERS_TO_EMAIL=contact@arteforma.ro`
3. Keep `replyTo` on the customer email so replies go directly back to the lead

Custom order emails include:

- all form fields
- a formatted summary in HTML + plain text
- file attachment when a file is uploaded

Subject:

- `New Custom Order Request – ArteForma`

## Supabase setup

1. Create a Supabase project
2. Run the SQL from [supabase/store-admin.sql](/Users/eugencostache/Documents/Codex/2026-04-21-tu-ai-putea-s-mi-faci/supabase/store-admin.sql)
3. Add the following env vars:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Keep these defaults unless you intentionally rename resources:
   - `SUPABASE_ORDERS_TABLE=orders`
   - `SUPABASE_ORDER_ITEMS_TABLE=order_items`

Notes:

- The service role key is used server-side only for writes and internal reads.
- Supabase is currently the data layer for the store/order direction, not for custom email leads.

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

## Store data direction

Supabase is prepared to support:

- `orders`
- `order_items`
- `customer_profiles`
- `products`
- `product_media`
- `order_status_events`

This supports the next steps for:

- admin order management
- customer account history
- customer-visible order status
- product/media admin CRUD

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

5. For static visuals, place assets in `public/brand` or another `public/*` folder and update the component/path that renders them.

There are also lightweight internal views:

```text
/internal?token=YOUR_INTERNAL_ORDERS_TOKEN
/internal/orders?token=YOUR_INTERNAL_ORDERS_TOKEN
/internal/products?token=YOUR_INTERNAL_ORDERS_TOKEN
/internal/media?token=YOUR_INTERNAL_ORDERS_TOKEN
```

This is not a full CMS yet. It is a practical internal admin direction plus a cleaner structure for hiding/showing products during launch.

## Customer account direction

The project includes a prepared customer-account route structure:

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

## Deployment on Vercel

1. Push the repo to GitHub
2. Import into Vercel
3. Add all env vars from `.env.example`
4. Configure SMTP for custom order emails
5. Configure Stripe webhook with your production domain
6. Configure Supabase and run the SQL migration
7. Deploy

## Current launch notes

- The store is structurally ready for a small premium ecommerce launch
- Custom order requests are intentionally email-based and separate from the store order pipeline
- Paid orders persist only after Stripe webhook delivery, which is the correct production path
- Success page becomes most useful when webhook delivery is configured and reachable
- Product catalog is still code-based, which is acceptable for launch but can later move to a CMS or database
- Internal pages are protected with `INTERNAL_ORDERS_TOKEN` and are not intended for public/customer use
- Customer accounts are prepared as route structure and data direction, but auth is not fully activated yet
