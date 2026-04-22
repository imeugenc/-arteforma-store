create extension if not exists pgcrypto;

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  product_slug text,
  visible boolean not null default true,
  featured boolean not null default false,
  review_date date
);

create index if not exists idx_reviews_product_slug on reviews(product_slug);
create index if not exists idx_reviews_visible on reviews(visible);
create index if not exists idx_reviews_featured on reviews(featured);
