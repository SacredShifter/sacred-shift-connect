-- Law of Transfer core tables
-- Sacred Shifter Law of Transfer feature pack database schema

-- 1) Codex principle (single canonical row; editable by admins only)
create table if not exists codex_principles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- 'law-of-transfer'
  title text not null,
  body_md text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Visions and morphology
create table if not exists visions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  description text,                     -- free text capture
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists vision_morphs (
  id uuid primary key default gen_random_uuid(),
  vision_id uuid not null references visions(id) on delete cascade,
  phase_from text not null,             -- e.g. 'circle'
  phase_to text not null,               -- e.g. 'diamond'
  notes text,
  has_inner_core boolean default false, -- black diamond inside
  fluidic_motion boolean default true,
  created_at timestamptz default now()
);

-- 3) Breath practice sessions
create table if not exists breath_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz default now(),
  duration_seconds int check (duration_seconds >= 0),
  packets_visualised boolean default true,  -- user toggled "oxygen as packets"
  reflections text
);

-- 4) Optional telemetry (lightweight)
create table if not exists transfer_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  kind text not null,                    -- 'open_codex' | 'start_breath' | 'save_vision' | ...
  props jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS
alter table codex_principles enable row level security;
alter table visions enable row level security;
alter table vision_morphs enable row level security;
alter table breath_sessions enable row level security;
alter table transfer_events enable row level security;

-- Policies
-- Codex principles: read all, write restricted (assume role check via claims)
create policy "codex read all" on codex_principles for select using (true);

-- Replace 'is_admin()' with your existing admin check if present; otherwise gate by email domain.
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select (auth.jwt() ->> 'email') like '%@sacredshifter.com'
$$;

create policy "codex admin write" on codex_principles
for all using (is_admin()) with check (is_admin());

-- Visions: owner CRUD
create policy "visions owner select" on visions for select using (auth.uid() = user_id);
create policy "visions owner insert" on visions for insert with check (auth.uid() = user_id);
create policy "visions owner update" on visions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "visions owner delete" on visions for delete using (auth.uid() = user_id);

-- Vision morphs: via parent ownership
create policy "morphs select by parent" on vision_morphs for select using (
  exists (select 1 from visions v where v.id = vision_id and v.user_id = auth.uid())
);
create policy "morphs insert by parent" on vision_morphs for insert with check (
  exists (select 1 from visions v where v.id = vision_id and v.user_id = auth.uid())
);
create policy "morphs update by parent" on vision_morphs for update using (
  exists (select 1 from visions v where v.id = vision_id and v.user_id = auth.uid())
) with check (
  exists (select 1 from visions v where v.id = vision_id and v.user_id = auth.uid())
);
create policy "morphs delete by parent" on vision_morphs for delete using (
  exists (select 1 from visions v where v.id = vision_id and v.user_id = auth.uid())
);

-- Breath sessions: owner CRUD
create policy "breath owner select" on breath_sessions for select using (auth.uid() = user_id);
create policy "breath owner insert" on breath_sessions for insert with check (auth.uid() = user_id);
create policy "breath owner update" on breath_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "breath owner delete" on breath_sessions for delete using (auth.uid() = user_id);

-- Telemetry: insert allowed by logged-in user; read only by admin
create policy "telemetry insert self" on transfer_events for insert with check (true);
create policy "telemetry admin read" on transfer_events for select using (is_admin());

-- Insert the Law of Transfer codex principle
insert into codex_principles (slug, title, body_md) values (
  'law-of-transfer',
  'Law of Transfer',
  '# Law of Transfer

Geometry is alive, containerised, and transfers information via flow.

## Physical Analogue
Wind → Oxygen → Breath

## Engineering Analogue  
Packets → Mesh → Nodes

## Sacred Principle
Just as wind carries oxygen packets to living vessels, so too do data packets flow through mesh networks to receptive nodes. The geometry of this transfer is living and dynamic, adapting to the consciousness of the flow.

## Practice
- **Breath as Living Geometry**: Feel wind as flow, imagine oxygen as packets entering your living vessel
- **Vision Morphology**: Observe how geometric forms transform (circle → diamond with inner core)
- **Connectivity Bridge**: Understand mesh networks as breath systems for data

*"Where a Telco sees packets, Sacred Shifter sees living geometry in flow."*'
) on conflict (slug) do nothing;
