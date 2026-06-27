create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null default 'Coin Original',
  category text not null,
  name text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  description text not null default '',
  image text not null,
  gallery jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  stock_by_size jsonb not null default '{}'::jsonb,
  sold_out boolean not null default false,
  badge_label text,
  badge_tone text check (badge_tone in ('primary', 'tertiary', 'error')),
  authenticity_label text,
  delivery_label text,
  delivery_region text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_products_updated_at();

alter table public.products enable row level security;

create policy "Public read products"
on public.products
for select
to anon, authenticated
using (true);

create policy "Public insert products"
on public.products
for insert
to anon, authenticated
with check (true);

create policy "Public update products"
on public.products
for update
to anon, authenticated
using (true)
with check (true);

create policy "Public delete products"
on public.products
for delete
to anon, authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "Public upload product images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'product-images');

create policy "Public update product images"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "Public delete product images"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'product-images');
