-- PREMIUM — Supabase SQL Setup
-- Coller dans : Supabase Dashboard > SQL Editor > Run

create extension if not exists "uuid-ossp";

create type task_status  as enum ('assigned', 'in-progress', 'submitted', 'completed', 'failed');
create type task_type    as enum ('regular', 'punishment');
create type proof_status as enum ('pending', 'approved', 'rejected');
create type unlock_type  as enum ('tasks_completed', 'streak_days', 'time_on_platform');

create table users (
  id          uuid primary key default uuid_generate_v4(),
  username    text not null unique,
  role        text not null default 'user' check (role in ('user', 'admin')),
  token       text unique,
  auth_id     uuid unique,
  last_active timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create table tasks (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null, description text not null,
  user_id     uuid not null references users(id) on delete cascade,
  created_by  uuid not null references users(id),
  deadline    timestamptz not null,
  status      task_status not null default 'assigned',
  type        task_type not null default 'regular',
  created_at  timestamptz not null default now()
);
create table proof_submissions (
  id           uuid primary key default uuid_generate_v4(),
  task_id      uuid not null references tasks(id) on delete cascade,
  user_id      uuid not null references users(id) on delete cascade,
  content      text not null, media_urls text[] not null default '{}',
  status       proof_status not null default 'pending',
  admin_note   text, submitted_at timestamptz not null default now(), reviewed_at timestamptz
);
create table messages (
  id          uuid primary key default uuid_generate_v4(),
  sender_id   uuid not null references users(id) on delete cascade,
  receiver_id uuid not null references users(id) on delete cascade,
  content     text not null, read boolean not null default false,
  created_at  timestamptz not null default now()
);
create table rewards (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null, description text not null,
  unlock_type  unlock_type not null, unlock_value integer not null,
  icon_url     text, created_at timestamptz not null default now()
);
create table user_rewards (
  user_id uuid not null references users(id) on delete cascade,
  reward_id uuid not null references rewards(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, reward_id)
);
create table user_stats (
  user_id uuid primary key references users(id) on delete cascade,
  tasks_completed integer not null default 0, current_streak integer not null default 0,
  longest_streak integer not null default 0, total_minutes integer not null default 0,
  last_seen_at timestamptz not null default now()
);

alter table users             enable row level security;
alter table tasks             enable row level security;
alter table proof_submissions enable row level security;
alter table messages          enable row level security;
alter table rewards           enable row level security;
alter table user_rewards      enable row level security;
alter table user_stats        enable row level security;

insert into rewards (title, description, unlock_type, unlock_value) values
  ('First Blood', 'Première tâche complétée.', 'tasks_completed', 1),
  ('Discipline', '5 tâches complétées.', 'tasks_completed', 5),
  ('Iron Will', '10 tâches complétées.', 'tasks_completed', 10),
  ('Streak: Initié', '3 jours consécutifs actif.', 'streak_days', 3),
  ('Streak: Adepte', '7 jours consécutifs actif.', 'streak_days', 7);
