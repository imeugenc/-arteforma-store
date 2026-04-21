-- ArteForma launch schema
-- Run this in the Supabase SQL editor before connecting production.

create table if not exists public.custom_orders (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  type text not null,
  description text not null,
  desired_size text,
  colors text,
  budget text,
  deadline text,
  file_name text,
  file_url text,
  source text
);

create index if not exists custom_orders_created_at_idx
  on public.custom_orders (created_at desc);

create table if not exists public.orders (
  id uuid primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  total_amount numeric(10, 2) not null,
  currency text not null default 'RON',
  status text not null default 'paid',
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  shipping_method text not null,
  shipping_cost numeric(10, 2) not null default 0,
  notes text,
  source text,
  metadata jsonb
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_status_idx
  on public.orders (status);

create table if not exists public.order_items (
  id uuid primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  variant_summary text,
  unit_price numeric(10, 2) not null,
  quantity integer not null,
  line_total numeric(10, 2) not null
);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

insert into storage.buckets (id, name, public)
values ('custom-order-files', 'custom-order-files', true)
on conflict (id) do nothing;
