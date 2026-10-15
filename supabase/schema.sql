-- ECXPETACULO — esquema inicial. Rode no Supabase: SQL Editor > New query > Run.

create type user_role as enum ('admin', 'producao', 'piloto');
create type show_status as enum ('proposta', 'confirmado', 'realizado', 'cancelado');
create type task_status as enum ('todo', 'doing', 'done');
create type task_priority as enum ('alta', 'media', 'baixa');

-- Perfis (1 por usuário do Supabase Auth)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  role user_role not null default 'producao',
  created_at timestamptz default now()
);

create function current_role_name() returns user_role
language sql stable security definer set search_path = public as
$$ select role from profiles where id = auth.uid() $$;

create table artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table contractors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text,                       -- casa de show, produtora, prefeitura...
  document text,                   -- CNPJ/CPF
  created_at timestamptz default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references contractors on delete cascade,
  name text not null,
  role text, email text, phone text
);

create table shows (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists not null,
  contractor_id uuid references contractors,
  title text not null,
  venue text, city text, state text,
  show_date date not null,
  load_in time, soundcheck time, start_time time,
  status show_status not null default 'proposta',
  fee numeric(12,2) default 0,      -- cachê
  notes text,
  created_at timestamptz default now()
);

-- Financeiro (somente admin)
create table show_payments (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references shows on delete cascade not null,
  description text, amount numeric(12,2) not null,
  due_date date, paid_at date
);

create table show_costs (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references shows on delete cascade not null,
  category text not null,           -- equipe, hotel, transporte, aviação...
  description text, amount numeric(12,2) not null
);

-- Equipe, rider e logística
create table crew_members (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists,
  name text not null, function text, phone text
);

create table show_crew (
  show_id uuid references shows on delete cascade,
  crew_id uuid references crew_members on delete cascade,
  primary key (show_id, crew_id)
);

create table riders (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references shows on delete cascade not null,
  kind text not null,               -- técnico, camarim, hospitalidade
  content text, approved boolean default false
);

create table logistics (
  id uuid primary key default gen_random_uuid(),
  show_id uuid references shows on delete cascade not null,
  kind text not null,               -- hotel, terrestre, aéreo comercial
  details text, confirmed boolean default false
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references artists,
  show_id uuid references shows on delete set null,
  owner_id uuid references profiles,
  due_date date,
  priority task_priority default 'media',
  status task_status default 'todo',
  done_at timestamptz,
  created_at timestamptz default now()
);

-- Aviação
create table aircraft (
  id uuid primary key default gen_random_uuid(),
  registration text unique not null, -- matrícula (PR-XXX)
  model text, notes text
);

create table flights (
  id uuid primary key default gen_random_uuid(),
  aircraft_id uuid references aircraft not null,
  show_id uuid references shows on delete set null,
  pilot_id uuid references profiles,
  origin text not null, destination text not null,
  departs_at timestamptz, arrives_at timestamptz,
  flight_hours numeric(5,1),
  status text default 'planejado',   -- planejado, confirmado, realizado
  notes text
);

create table flight_costs (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid references flights on delete cascade,
  aircraft_id uuid references aircraft,
  category text not null,            -- combustível, taxa aeroportuária, manutenção, tripulação
  amount numeric(12,2) not null,
  incurred_on date default current_date
);

create table checklists (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid references flights on delete cascade,
  item text not null, done boolean default false, done_by uuid references profiles
);

-- Permissões (RLS)
do $$
declare t text;
begin
  foreach t in array array['profiles','artists','contractors','contacts','shows','show_payments','show_costs',
    'crew_members','show_crew','riders','logistics','tasks','aircraft','flights','flight_costs','checklists']
  loop execute format('alter table %I enable row level security', t); end loop;
end $$;

-- admin: acesso total a tudo
do $$
declare t text;
begin
  foreach t in array array['artists','contractors','contacts','shows','show_payments','show_costs',
    'crew_members','show_crew','riders','logistics','tasks','aircraft','flights','flight_costs','checklists']
  loop execute format('create policy "admin all" on %I for all to authenticated
    using (current_role_name() = ''admin'') with check (current_role_name() = ''admin'')', t); end loop;
end $$;

-- produção: lê e edita operação (sem financeiro nem custos de avião)
do $$
declare t text;
begin
  foreach t in array array['artists','contractors','contacts','shows','crew_members','show_crew','riders','logistics','tasks']
  loop execute format('create policy "producao all" on %I for all to authenticated
    using (current_role_name() = ''producao'') with check (current_role_name() = ''producao'')', t); end loop;
end $$;

-- piloto: só aviação (lê aeronave e voos próprios; atualiza voos e checklists próprios)
create policy "piloto lê aeronave" on aircraft for select to authenticated using (current_role_name() = 'piloto');
create policy "piloto lê voos" on flights for select to authenticated
  using (current_role_name() = 'piloto' and pilot_id = auth.uid());
create policy "piloto atualiza voos" on flights for update to authenticated
  using (current_role_name() = 'piloto' and pilot_id = auth.uid());
create policy "piloto checklists" on checklists for all to authenticated
  using (current_role_name() = 'piloto' and exists (select 1 from flights f where f.id = flight_id and f.pilot_id = auth.uid()))
  with check (current_role_name() = 'piloto' and exists (select 1 from flights f where f.id = flight_id and f.pilot_id = auth.uid()));

-- perfis: cada um lê o próprio; admin gerencia todos
create policy "perfil próprio" on profiles for select to authenticated using (id = auth.uid());
create policy "admin perfis" on profiles for all to authenticated
  using (current_role_name() = 'admin') with check (current_role_name() = 'admin');
