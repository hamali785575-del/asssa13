-- profiles table (auto-created on auth.users insert via trigger)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  uses_remaining integer default 4,
  created_at timestamptz default now()
);

-- trigger to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- submissions table (optional, for logging/history)
create table submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  idea_text text,
  ai_response text,
  virality_score integer,
  is_roasted boolean default false,
  created_at timestamptz default now()
);

-- anon_uses table (rate-limit anonymous users)
create table anon_uses (
  id uuid default gen_random_uuid() primary key,
  fingerprint text unique, -- hash of IP + user agent
  used_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table submissions enable row level security;
alter table anon_uses enable row level security;

-- RLS Policies
-- Profiles: Users can only read and update their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Submissions: Users can view their own submissions (and server can insert)
create policy "Users can view own submissions"
  on submissions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own submissions"
  on submissions for insert
  with check ( auth.uid() = user_id );

-- Anon Uses: No client access (server only via service role)
-- By avoiding adding any RLS policies, it defaults to deny-all for anon/authenticated roles.
-- The server will use the service_role key to bypass RLS, OR we can allow insertions from anon.
-- Since we are doing it server-side in API route, we can just use Supabase admin client (Service Role key) OR...
-- Actually, the API route will use standard client + RLS or the Server Action. 
-- In our API route, creating a server client uses the user's session or anon key by default.
-- It's better to explicitly allow inserting to anon_uses if we want the standard client to work.
-- BUT to prevent abuse, we might want to only allow server-side insertion via service_role, OR we allow anyone to insert but not select.

create policy "Anyone can insert anon_uses"
  on anon_uses for insert
  with check ( true );

create policy "Anyone can read anon_uses"
  on anon_uses for select
  using ( true );

-- Function to decrement uses_remaining securely
create or replace function decrement_use_count()
returns void as $$
begin
  update public.profiles
  set uses_remaining = uses_remaining - 1
  where id = auth.uid() and uses_remaining > 0;
end;
$$ language plpgsql security definer;
