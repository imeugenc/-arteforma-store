alter table public.products
  add column if not exists standard_shipping_enabled boolean not null default true,
  add column if not exists free_shipping_eligible boolean not null default true,
  add column if not exists pickup_only boolean not null default false,
  add column if not exists oversized_or_special_shipping boolean not null default false,
  add column if not exists shipping_note text;

create index if not exists idx_products_shipping_flags
  on public.products (standard_shipping_enabled, free_shipping_eligible, pickup_only, oversized_or_special_shipping);
