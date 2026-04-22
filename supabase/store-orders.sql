create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  email text,
  customer_email text not null,
  customer_name text,
  customer_phone text,
  total numeric(10, 2),
  total_amount numeric(10, 2) not null,
  currency text not null default 'RON',
  status text not null default 'paid',
  payment_status text,
  gift_packaging boolean not null default false,
  personalization boolean not null default false,
  shipping_method text not null default 'Livrare în România',
  shipping_cost numeric(10, 2) not null default 0,
  notes text,
  source text,
  metadata jsonb default '{}'::jsonb
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_status_idx
  on public.orders (status);

create index if not exists orders_customer_email_idx
  on public.orders (customer_email);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  variant_summary text,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  line_total numeric(10, 2) not null
);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  visible_to_customer boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_status_events_order
  on public.order_status_events (order_id);

create table if not exists public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
