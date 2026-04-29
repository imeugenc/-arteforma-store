-- ArteForma RLS hardening.
-- Safe to run multiple times. Server-side code uses the service role key for admin,
-- checkout/webhook, order status lookup and custom internal operations.

alter table if exists public.orders enable row level security;
alter table if exists public.order_items enable row level security;
alter table if exists public.order_status_events enable row level security;
alter table if exists public.customer_profiles enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.product_media enable row level security;
alter table if exists public.reviews enable row level security;

drop policy if exists "Public can read enabled products" on public.products;
create policy "Public can read enabled products"
  on public.products
  for select
  to anon, authenticated
  using (enabled = true);

drop policy if exists "Public can read media for enabled products" on public.product_media;
create policy "Public can read media for enabled products"
  on public.product_media
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_media.product_id
        and products.enabled = true
    )
  );

drop policy if exists "Public can read visible reviews" on public.reviews;
create policy "Public can read visible reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (visible = true);

-- No public insert/update/delete policies for orders, order_items,
-- order_status_events, customer_profiles, products, product_media or reviews.
-- Mutations stay server-side through the Supabase service role key.
