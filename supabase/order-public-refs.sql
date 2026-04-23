alter table public.orders
  add column if not exists public_order_ref text;

create unique index if not exists orders_public_order_ref_idx
  on public.orders (public_order_ref)
  where public_order_ref is not null;

with existing_max as (
  select greatest(
    1048,
    coalesce(
      max(((regexp_match(public_order_ref, '^AF-(\d+)$'))[1])::int),
      1048
    )
  ) as max_ref
  from public.orders
),
missing as (
  select
    id,
    row_number() over (order by created_at asc, id asc) as seq
  from public.orders
  where public_order_ref is null
)
update public.orders as orders
set public_order_ref = 'AF-' || (existing_max.max_ref + missing.seq)
from existing_max, missing
where orders.id = missing.id;
