create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  public_order_ref text unique,
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

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  variant_summary text,
  unit_price numeric(10, 2) not null,
  quantity integer not null default 1,
  line_total numeric(10, 2) not null
);

create table if not exists customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  short_description text not null,
  long_description text not null,
  price integer not null,
  badge text,
  seo_title text,
  seo_description text,
  featured boolean not null default false,
  enabled boolean not null default true,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  materials jsonb not null default '[]'::jsonb,
  customization jsonb not null default '[]'::jsonb,
  ideal_for jsonb not null default '[]'::jsonb,
  visual jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  kind text not null default 'gallery',
  created_at timestamptz not null default now()
);

create table if not exists order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  note text,
  visible_to_customer boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_products_enabled on products(enabled);
create index if not exists idx_product_media_product on product_media(product_id);
create index if not exists idx_order_status_events_order on order_status_events(order_id);
create unique index if not exists idx_orders_public_order_ref
  on orders(public_order_ref)
  where public_order_ref is not null;
