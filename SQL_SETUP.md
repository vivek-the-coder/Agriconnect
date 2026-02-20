## ⚡ Quick Master Setup (Recommended)
> [!CAUTION]
> **DO NOT** copy the code below directly from this file. Markdown headers (like `##`) will crash the Supabase SQL Editor.
>
> **1. Open the raw SQL file:** [setup.sql](file:///c:/Users/HP/Documents/agriculture-web/AgriConnect-main/setup.sql)
> **2. Copy everything** (Ctrl+A, Ctrl+C)
> **3. Paste into Supabase** and click **Run**

---


## 1. Government Schemes
```sql
create table schemes (
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

-- Enable RLS
alter table schemes enable row level security;

-- Create policies (Public read, Admin write)
create policy "Public read access" on schemes for select using (true);
create policy "Admin full access" on schemes for all using (auth.role() = 'authenticated');
```

## 2. Seeds & Tissue Culture
```sql
create table seeds (
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
create policy "Public read access" on seeds for select using (true);
create policy "Admin full access" on seeds for all using (auth.role() = 'authenticated');
```

## 3. Tools & Machines
```sql
create table tools (
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
create policy "Public read access" on tools for select using (true);
create policy "Admin full access" on tools for all using (auth.role() = 'authenticated');
```

## 4. Used Equipment
```sql
create table equipment (
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
create policy "Public read access" on equipment for select using (true);
create policy "Public insert access" on equipment for insert with check (true);
create policy "Admin full access" on equipment for all using (auth.role() = 'authenticated');
```

## 5. Export Crops (Export Hub)
```sql
create table export_crops (
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

-- Enable RLS
alter table export_crops enable row level security;

-- Create policies (Public read, Authenticated write)
create policy "Public read access" on export_crops for select using (true);
create policy "Authenticated insert" on export_crops for insert with check (auth.role() = 'authenticated');
create policy "Admin full access" on export_crops for all using (auth.role() = 'authenticated');
```

## 6. Community Forum
```sql
create table forum_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  author text not null,
  location text,
  category text,
  tags text[], -- Array of tags
  likes int default 0,
  replies int default 0,
  is_resolved boolean default false,
  is_pinned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table forum_posts enable row level security;
create policy "Public read access" on forum_posts for select using (true);
create policy "Authenticated insert" on forum_posts for insert with check (auth.role() = 'authenticated');
create policy "Admin full access" on forum_posts for all using (auth.role() = 'authenticated');
```

## 7. Contact Messages
```sql
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'New', -- New, Read, Replied
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table contact_messages enable row level security;
create policy "Public read access" on contact_messages for select using (true);
create policy "Public insert access" on contact_messages for insert with check (true);
create policy "Admin full access" on contact_messages for all using (auth.role() = 'authenticated');
```

## Troubleshooting: "Could not find the table in the schema cache"

If you see an error like `Could not find the table 'public.table_name' in the schema cache`, it means the table exists in the code but hasn't been created in your Supabase database yet.

### How to fix:
1.  **Copy the SQL Code**: Copy the SQL code provided in the sections above (e.g., Section 1 for Schemes, Section 6 for Forum).
2.  **Go to Supabase Dashboard**: Log in to your project at [supabase.com](https://supabase.com).
3.  **Open SQL Editor**: Click on the "SQL Editor" icon in the left sidebar.
4.  **Run Queries**: Click "New Query", paste the SQL, and click **Run**.
5.  **Refresh Cache**: Sometimes Supabase needs a moment to update its schema cache. If the error persists, try refreshing your browser or wait 60 seconds.

The application is programmed to fall back to **Mock Data** if tables are missing, so you can still browse the site while you set up your database.
