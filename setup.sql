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
