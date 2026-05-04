'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import type { ActionResult, UserSession } from '@/lib/supabase/types';

const SESSION_COOKIE = 'premium_session';
const OPTS = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 30, path: '/' };

export async function loginAdmin(): Promise<ActionResult> {
  return { success: false, error: 'Utilise le bouton Clerk pour la connexion admin.' };
}

export async function loginUser(username: string, token: string): Promise<ActionResult> {
  const [user] = await db.select().from(users).where(and(eq(users.username, username), eq(users.role, 'user'))).limit(1);
  if (!user) return { success: false, error: 'Utilisateur introuvable.' };
  if (user.token !== token.trim()) return { success: false, error: 'Token invalide.' };
  await db.update(users).set({ lastActive: new Date().toISOString() }).where(eq(users.id, user.id));
  cookies().set(SESSION_COOKIE, JSON.stringify({ id: user.id, username: user.username, role: user.role }), OPTS);
  return { success: true };
}

export async function createAdminSession(clerkUserId: string): Promise<ActionResult> {
  let [user] = await db.select().from(users).where(eq(users.authId, clerkUserId)).limit(1);

  if (!user) {
    const [admin] = await db.select().from(users).where(and(eq(users.role, 'admin'), isNull(users.authId))).limit(1);
    if (admin) {
      await db.update(users).set({ authId: clerkUserId }).where(eq(users.id, admin.id));
      user = { ...admin, authId: clerkUserId };
    }
  }

  if (!user) return { success: false, error: 'Compte non trouvé.' };
  if (user.role !== 'admin') return { success: false, error: 'Accès refusé.' };
  cookies().set(SESSION_COOKIE, JSON.stringify({ id: user.id, username: user.username, role: user.role }), OPTS);
  return { success: true };
}

export async function logout() { cookies().delete(SESSION_COOKIE); redirect('/auth/login'); }

export async function getSession(): Promise<UserSession | null> {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as UserSession; } catch { return null; }
}