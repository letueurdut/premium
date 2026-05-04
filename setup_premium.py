"""
PREMIUM — Project Structure Setup
Usage : python setup_premium.py
Lance depuis la racine de ton projet Next.js (là où est le package.json)
"""

import os

ROOT = "."

DIRS = [
    "src/app/auth/login",
    "src/app/admin/dashboard",
    "src/app/admin/users",
    "src/app/admin/create-task",
    "src/app/admin/proofs",
    "src/app/admin/overdue",
    "src/app/admin/rewards",
    "src/app/user/dashboard",
    "src/app/user/tasks",
    "src/app/user/vault",
    "src/app/user/chat",
    "src/app/api/uploadthing",
    "src/components/ui",
    "src/components/common",
    "src/components/admin",
    "src/components/user",
    "src/lib/supabase",
    "src/lib/actions",
    "src/lib/queries",
    "supabase",
]

FILES = {

    ".env.local": """\
NEXT_PUBLIC_SUPABASE_URL=https://sfzflfhrsterbssmdgcw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmemZsZmhyc3RlcmJzc21kZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjc4MjksImV4cCI6MjA4OTk0MzgyOX0.QTXrKG8vzNyTMJ8kKYOuImrEFGzeKwUr3y-NKVZPL6k
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmemZsZmhyc3RlcmJzc21kZ2N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2NzgyOSwiZXhwIjoyMDg5OTQzODI5fQ.Bo9mlmX4dVHOQ0PguzWcB9fExWI-ewh4_QlP5W3RSDo
""",

    "tailwind.config.ts": """\
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'p-black':      '#000000',
        'p-surface':    '#0a0a0a',
        'p-card':       '#111111',
        'p-border':     '#1f1f1f',
        'p-muted':      '#2a2a2a',
        'p-red':        '#dc2626',
        'p-red-hover':  '#b91c1c',
        'p-red-dim':    'rgba(220,38,38,0.12)',
        'p-text':       '#f5f5f5',
        'p-text-muted': '#737373',
        'p-text-dim':   '#404040',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'red-glow':    '0 0 30px rgba(220,38,38,0.25), 0 0 60px rgba(220,38,38,0.08)',
        'red-glow-sm': '0 0 12px rgba(220,38,38,0.2)',
      },
      animation: {
        'shimmer':  'shimmer 1.8s infinite',
        'fade-in':  'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        shimmer:  { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};

export default config;
""",

    "src/app/globals.css": """\
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { --font-playfair: 'Playfair Display', serif; --font-dm-sans: 'DM Sans', sans-serif; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { -webkit-font-smoothing: antialiased; }
  body { font-family: var(--font-dm-sans); background-color: #000000; color: #f5f5f5; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: #dc2626; }
  ::selection { background-color: rgba(220,38,38,0.25); color: #f5f5f5; }
  :focus-visible { outline: 1px solid rgba(220,38,38,0.6); outline-offset: 2px; }
}

@layer components {
  .font-display { font-family: var(--font-playfair); }
  .shimmer { background: linear-gradient(90deg, #111111 25%, #1f1f1f 50%, #111111 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite; }
  .glow-red { box-shadow: 0 0 30px rgba(220,38,38,0.25), 0 0 60px rgba(220,38,38,0.08); }
  .glow-red-sm { box-shadow: 0 0 12px rgba(220,38,38,0.2); }
  .text-glow-red { text-shadow: 0 0 20px rgba(220,38,38,0.45); }
  .card { @apply bg-p-card border border-p-border rounded-xl; box-shadow: 0 1px 3px rgba(0,0,0,0.6); }
  .card-hover { @apply card transition-all duration-200; }
  .card-hover:hover { @apply border-red-900/40; transform: translateY(-1px); box-shadow: 0 0 0 1px rgba(220,38,38,0.1), 0 4px 12px rgba(0,0,0,0.4); }
  .task-punishment { @apply border-red-900/50; box-shadow: inset 3px 0 0 #dc2626, 0 0 20px rgba(220,38,38,0.05); }
  .btn { @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95; }
  .btn-primary { @apply btn bg-p-red hover:bg-p-red-hover text-white; box-shadow: 0 0 20px rgba(220,38,38,0.2); }
  .btn-ghost { @apply btn bg-transparent hover:bg-p-muted text-p-text-muted hover:text-p-text border border-p-border hover:border-p-muted; }
  .btn-danger { @apply btn bg-transparent hover:bg-red-950/40 text-p-red border border-red-900/40 hover:border-red-700/60; }
  .badge { @apply inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium tracking-wide; }
  .badge-neutral { @apply badge bg-p-muted text-p-text-muted border border-p-border; }
  .badge-red { @apply badge bg-red-950/50 text-red-400 border border-red-900/40; }
  .badge-green { @apply badge bg-emerald-950/50 text-emerald-400 border border-emerald-900/40; }
  .badge-yellow { @apply badge bg-amber-950/50 text-amber-400 border border-amber-900/40; }
  .input { @apply w-full bg-p-surface border border-p-border rounded-lg px-3 py-2 text-sm text-p-text placeholder:text-p-text-dim transition-colors duration-150 focus:outline-none focus:border-red-900/60 focus:bg-p-card; }
  .nav-item { @apply flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-p-text-muted hover:bg-p-muted hover:text-p-text transition-all duration-150 cursor-pointer; }
  .nav-item.active { @apply bg-p-red-dim text-p-text border border-red-900/30; }
}

@layer utilities {
  .animate-in   { animation: slideUp 0.4s ease-out forwards; }
  .animate-fade { animation: fadeIn 0.3s ease-out forwards; }
  @keyframes shimmer  { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes fadeIn   { 0% { opacity: 0; } 100% { opacity: 1; } }
  @keyframes slideUp  { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
}
""",

    "src/app/layout.tsx": """\
import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-playfair', display: 'swap' });
const dmSans   = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-dm-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'PREMIUM', template: '%s — PREMIUM' },
  description: 'Task management. Authority. Execution.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`dark ${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-p-black text-p-text font-body antialiased">{children}</body>
    </html>
  );
}
""",

    "src/app/page.tsx": """\
import { redirect } from 'next/navigation';
export default function Home() { redirect('/auth/login'); }
""",

    "src/lib/supabase/index.ts": """\
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(URL, ANON);
}
export function createSupabaseAdminClient() {
  return createClient<Database>(URL, SRK, { auth: { autoRefreshToken: false, persistSession: false } });
}
""",

    "src/lib/supabase/types.ts": """\
export type TaskStatus  = 'assigned' | 'in-progress' | 'submitted' | 'completed' | 'failed';
export type TaskType    = 'regular' | 'punishment';
export type ProofStatus = 'pending' | 'approved' | 'rejected';
export type UnlockType  = 'tasks_completed' | 'streak_days' | 'time_on_platform';
export type UserRole    = 'user' | 'admin';

export interface Database {
  public: {
    Tables: {
      users:             { Row: { id: string; username: string; role: UserRole; token: string | null; auth_id: string | null; last_active: string; created_at: string; }; Insert: any; Update: any; };
      tasks:             { Row: { id: string; title: string; description: string; user_id: string; created_by: string; deadline: string; status: TaskStatus; type: TaskType; created_at: string; }; Insert: any; Update: any; };
      proof_submissions: { Row: { id: string; task_id: string; user_id: string; content: string; media_urls: string[]; status: ProofStatus; admin_note: string | null; submitted_at: string; reviewed_at: string | null; }; Insert: any; Update: any; };
      messages:          { Row: { id: string; sender_id: string; receiver_id: string; content: string; read: boolean; created_at: string; }; Insert: any; Update: any; };
      rewards:           { Row: { id: string; title: string; description: string; unlock_type: UnlockType; unlock_value: number; icon_url: string | null; created_at: string; }; Insert: any; Update: any; };
      user_rewards:      { Row: { user_id: string; reward_id: string; unlocked_at: string; }; Insert: any; Update: any; };
      user_stats:        { Row: { user_id: string; tasks_completed: number; current_streak: number; longest_streak: number; total_minutes: number; last_seen_at: string; }; Insert: any; Update: any; };
    };
  };
}

export type DbUser      = Database['public']['Tables']['users']['Row'];
export type DbTask      = Database['public']['Tables']['tasks']['Row'];
export type DbProof     = Database['public']['Tables']['proof_submissions']['Row'];
export type DbMessage   = Database['public']['Tables']['messages']['Row'];
export type DbReward    = Database['public']['Tables']['rewards']['Row'];
export type DbUserStats = Database['public']['Tables']['user_stats']['Row'];

export interface UserSession  { id: string; username: string; role: UserRole; }
export interface ActionResult<T = void> { success: boolean; data?: T; error?: string; }
""",

    "src/middleware.ts": """\
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('premium_session')?.value;

  if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL('/auth/login', request.url));

  let parsed: { role?: string } = {};
  try { parsed = JSON.parse(session); } catch {
    const res = NextResponse.redirect(new URL('/auth/login', request.url));
    res.cookies.delete('premium_session');
    return res;
  }
  if (pathname.startsWith('/admin') && parsed.role !== 'admin') {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
""",

    "src/lib/actions/auth.ts": """\
'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase';
import type { ActionResult, UserSession } from '@/lib/supabase/types';

const SESSION_COOKIE = 'premium_session';
const OPTS = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 30, path: '/' };

export async function loginAdmin(email: string, password: string): Promise<ActionResult> {
  const sb = createSupabaseAdminClient();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { success: false, error: 'Identifiants incorrects.' };
  const { data: user, error: ue } = await sb.from('users').select('id, username, role').eq('auth_id', data.user.id).single();
  if (ue || !user || user.role !== 'admin') return { success: false, error: 'Accès refusé.' };
  cookies().set(SESSION_COOKIE, JSON.stringify({ id: user.id, username: user.username, role: user.role }), OPTS);
  return { success: true };
}

export async function loginUser(username: string, token: string): Promise<ActionResult> {
  const sb = createSupabaseAdminClient();
  const { data: user, error } = await sb.from('users').select('id, username, role, token').eq('username', username).eq('role', 'user').single();
  if (error || !user) return { success: false, error: 'Utilisateur introuvable.' };
  if (user.token !== token.trim()) return { success: false, error: 'Token invalide.' };
  await sb.from('users').update({ last_active: new Date().toISOString() }).eq('id', user.id);
  cookies().set(SESSION_COOKIE, JSON.stringify({ id: user.id, username: user.username, role: user.role }), OPTS);
  return { success: true };
}

export async function logout() { cookies().delete(SESSION_COOKIE); redirect('/auth/login'); }

export async function getSession(): Promise<UserSession | null> {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as UserSession; } catch { return null; }
}
""",

    "src/lib/actions/tasks.ts":   "'use server';\n// Task Server Actions — Bloc 3\n",
    "src/lib/actions/proofs.ts":  "'use server';\n// Proof Server Actions — Bloc 4\n",
    "src/lib/actions/users.ts":   "'use server';\n// User management Server Actions — Bloc 2\n",
    "src/lib/queries/tasks.ts":   "// Task queries — Bloc 3\n",
    "src/lib/queries/users.ts":   "// User queries — Bloc 2\n",
    "src/lib/queries/proofs.ts":  "// Proof queries — Bloc 4\n",

    "src/lib/utils.ts": """\
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function generateToken(): string { return crypto.randomUUID(); }
""",

    "src/app/auth/login/page.tsx": """\
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, loginUser } from '@/lib/actions/auth';

type Mode = 'user' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const result = mode === 'admin' ? await loginAdmin(email, password) : await loginUser(username, token);
    if (!result.success) { setError(result.error ?? 'Erreur.'); setLoading(false); return; }
    router.push(mode === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  }

  return (
    <main className="min-h-screen bg-p-black flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%)' }} />
      <div className="relative w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-1">PREMIUM</h1>
          <p className="text-p-text-muted text-sm">Accès restreint</p>
        </div>
        <div className="flex rounded-lg border border-p-border bg-p-surface p-1 mb-6">
          {(['user', 'admin'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              className={\`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 \${mode === m ? 'bg-p-red text-white' : 'text-p-text-muted hover:text-p-text'}\`}>
              {m === 'user' ? 'Accès User' : 'Accès Admin'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {mode === 'user' ? (<>
            <div>
              <label className="block text-xs text-p-text-muted mb-1.5 uppercase tracking-wider">Username</label>
              <input className="input" placeholder="ghost_zero" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="block text-xs text-p-text-muted mb-1.5 uppercase tracking-wider">Token de session</label>
              <input className="input font-mono text-xs" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value={token} onChange={e => setToken(e.target.value)} required />
            </div>
          </>) : (<>
            <div>
              <label className="block text-xs text-p-text-muted mb-1.5 uppercase tracking-wider">Email</label>
              <input className="input" type="email" placeholder="admin@premium.app" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="block text-xs text-p-text-muted mb-1.5 uppercase tracking-wider">Mot de passe</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </>)}
          {error && <p className="text-p-red text-sm text-center animate-fade">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading
              ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Connexion...</span>
              : 'Entrer'}
          </button>
        </form>
        <p className="text-center text-xs text-p-text-dim mt-6">Token perdu ? Contacte l'administrateur.</p>
      </div>
    </main>
  );
}
""",

    "src/app/admin/dashboard/page.tsx":  "export default function AdminDashboard() { return <div className='p-8 text-p-text'>Admin Dashboard</div>; }\n",
    "src/app/admin/users/page.tsx":       "export default function AdminUsers() { return <div className='p-8 text-p-text'>Users</div>; }\n",
    "src/app/admin/create-task/page.tsx": "export default function CreateTask() { return <div className='p-8 text-p-text'>Create Task</div>; }\n",
    "src/app/admin/proofs/page.tsx":      "export default function AdminProofs() { return <div className='p-8 text-p-text'>Proofs</div>; }\n",
    "src/app/admin/overdue/page.tsx":     "export default function AdminOverdue() { return <div className='p-8 text-p-text'>Overdue</div>; }\n",
    "src/app/admin/rewards/page.tsx":     "export default function AdminRewards() { return <div className='p-8 text-p-text'>Rewards</div>; }\n",
    "src/app/user/dashboard/page.tsx":    "export default function UserDashboard() { return <div className='p-8 text-p-text'>User Dashboard</div>; }\n",
    "src/app/user/tasks/page.tsx":        "export default function UserTasks() { return <div className='p-8 text-p-text'>Tasks</div>; }\n",
    "src/app/user/vault/page.tsx":        "export default function UserVault() { return <div className='p-8 text-p-text'>Vault</div>; }\n",
    "src/app/user/chat/page.tsx":         "export default function UserChat() { return <div className='p-8 text-p-text'>Chat</div>; }\n",
    "src/app/api/uploadthing/route.ts":   "// Uploadthing route — Bloc 4\n",
    "src/components/common/Sidebar.tsx":  "export default function Sidebar() { return null; }\n",
    "src/components/common/Header.tsx":   "export default function Header() { return null; }\n",

    "supabase/schema.sql": """\
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
""",
}


def main():
    created_dirs = created_files = skipped = 0
    print("\n\U0001f3d7  PREMIUM — Création de l'arborescence\n")

    for d in DIRS:
        path = os.path.join(ROOT, d)
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)
            print(f"  \u2713 DIR   {d}")
            created_dirs += 1
        else:
            print(f"  · SKIP  {d}")
            skipped += 1

    print()

    for rel_path, content in FILES.items():
        full = os.path.join(ROOT, rel_path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        if not os.path.exists(full):
            with open(full, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  \u2713 FILE  {rel_path}")
            created_files += 1
        else:
            print(f"  · SKIP  {rel_path} (existe déjà)")
            skipped += 1

    print(f"\n{'─'*52}")
    print(f"  {created_dirs} dossiers  |  {created_files} fichiers  |  {skipped} ignorés")
    print(f"{'─'*52}")
    print("\n  \u2705 Done. Lance : npm run dev\n")


if __name__ == "__main__":
    main()
