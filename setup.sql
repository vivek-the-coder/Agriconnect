-- Agriconnect Master Setup Script (Updated with Category and Public Inserts)
-- Copy and run everything below in the Supabase SQL Editor

-- 1. Schemes
create table if not exists schemes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  details text,
  amount text,
  eligibility text,
  state text,
  type text,
  deadline text,
  status text default 'Active',
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table schemes enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'schemes' and policyname = 'Public read access') then
        create policy "Public read access" on schemes for select using (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'schemes' and policyname = 'Admin full access') then
        create policy "Admin full access" on schemes for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 2. Seeds
create table if not exists seeds (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price text,
  category text,
  stock text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table seeds enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'seeds' and policyname = 'Public read access') then
        create policy "Public read access" on seeds for select using (true);
    end if;
    -- Added public insert for selling seeds
    if not exists (select 1 from pg_policies where tablename = 'seeds' and policyname = 'Public insert access') then
        create policy "Public insert access" on seeds for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'seeds' and policyname = 'Admin full access') then
        create policy "Admin full access" on seeds for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 3. Tools
create table if not exists tools (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price text,
  type text,
  condition text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table tools enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'tools' and policyname = 'Public read access') then
        create policy "Public read access" on tools for select using (true);
    end if;
    -- Added public insert for selling tools
    if not exists (select 1 from pg_policies where tablename = 'tools' and policyname = 'Public insert access') then
        create policy "Public insert access" on tools for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'tools' and policyname = 'Admin full access') then
        create policy "Admin full access" on tools for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 4. Equipment (Updated with Category and Public Insert)
create table if not exists equipment (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text, -- Added missing column
  condition text, -- Added missing column
  description text,
  price text,
  location text,
  year text,
  image text,
  status text default 'Available',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table equipment enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'equipment' and policyname = 'Public read access') then
        create policy "Public read access" on equipment for select using (true);
    end if;
    -- Added public insert for selling equipment
    if not exists (select 1 from pg_policies where tablename = 'equipment' and policyname = 'Public insert access') then
        create policy "Public insert access" on equipment for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'equipment' and policyname = 'Admin full access') then
        create policy "Admin full access" on equipment for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 5. Export Crops (Allows Anonymous Listing)
create table if not exists export_crops (
  id uuid default gen_random_uuid() primary key,
  cropname text not null,
  variety text,
  quantity text not null,
  location text not null,
  farmer text not null,
  contact text not null,
  email text,
  pricerange text,
  harvestdate date,
  quality text,
  organic boolean default false,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table export_crops enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'export_crops' and policyname = 'Public read access') then
        create policy "Public read access" on export_crops for select using (true);
    end if;
    -- Updated to allow public inserts (for testing/anonymous listings)
    if not exists (select 1 from pg_policies where tablename = 'export_crops' and policyname = 'Public insert access') then
        create policy "Public insert access" on export_crops for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'export_crops' and policyname = 'Admin full access') then
        create policy "Admin full access" on export_crops for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 6. Forum Posts (Allows Anonymous Posting)
create table if not exists forum_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  author text not null,
  location text,
  category text,
  tags text[],
  likes int default 0,
  replies int default 0,
  is_resolved boolean default false,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table forum_posts enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'forum_posts' and policyname = 'Public read access') then
        create policy "Public read access" on forum_posts for select using (true);
    end if;
    -- Updated to allow public inserts (for anonymous forum posts)
    if not exists (select 1 from pg_policies where tablename = 'forum_posts' and policyname = 'Public insert access') then
        create policy "Public insert access" on forum_posts for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'forum_posts' and policyname = 'Admin full access') then
        create policy "Admin full access" on forum_posts for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 7. Contact Messages
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table contact_messages enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'contact_messages' and policyname = 'Public read access') then
        create policy "Public read access" on contact_messages for select using (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'contact_messages' and policyname = 'Public insert access') then
        create policy "Public insert access" on contact_messages for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'contact_messages' and policyname = 'Admin full access') then
        create policy "Admin full access" on contact_messages for all using (auth.role() = 'authenticated');
    end if;
end
$$;

-- 8. Cart Items
create table if not exists cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_type text not null check (product_type in ('seed', 'tool', 'equipment')),
  product_name text not null,
  product_image text,
  price numeric not null default 0,
  quantity int not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table cart_items enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'cart_items' and policyname = 'Users manage own cart') then
        create policy "Users manage own cart" on cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
    end if;
end
$$;

-- 9. Orders
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total numeric not null default 0,
  status text not null default 'Pending' check (status in ('Pending','Confirmed','Shipped','Delivered','Cancelled','Failed')),
  shipping_address text,
  contact_phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table orders enable row level security;
do $$
begin
    if not exists (select 1 from pg_policies where tablename = 'orders' and policyname = 'Users read own orders') then
        create policy "Users read own orders" on orders for select using (auth.uid() = user_id);
    end if;
    if not exists (select 1 from pg_policies where tablename = 'orders' and policyname = 'Users insert own orders') then
        create policy "Users insert own orders" on orders for insert with check (auth.uid() = user_id);
    end if;
end
$$;

-- 10. Add missing columns to existing tables (Retroactive schema updates)
alter table equipment add column if not exists category text;
alter table equipment add column if not exists condition text;
alter table equipment add column if not exists user_id uuid references auth.users(id);

alter table seeds add column if not exists user_id uuid references auth.users(id);
alter table seeds add column if not exists unit text;
alter table seeds add column if not exists vendor text;
alter table seeds add column if not exists stock text;

alter table tools add column if not exists user_id uuid references auth.users(id);
alter table tools add column if not exists category text;
alter table tools add column if not exists vendor text;

alter table export_crops add column if not exists user_id uuid references auth.users(id);

-- 11. Razorpay Payment Tracking (Invoices)
alter table orders add column if not exists razorpay_order_id text;
alter table orders add column if not exists razorpay_payment_id text;
