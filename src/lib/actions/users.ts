'use server';
import { db } from '@/lib/db';
import { users, userStats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateToken } from '@/lib/utils';
import type { ActionResult } from '@/lib/supabase/types';

export async function createUser(form: { username: string }): Promise<ActionResult<{ id: string; username: string; token: string }>> {
  try {
    const id = crypto.randomUUID();
    const token = generateToken();
    await db.insert(users).values({
      id,
      username: form.username,
      role: 'user',
      token,
      createdAt: new Date().toISOString(),
    });
    await db.insert(userStats).values({ userId: id });
    return { success: true, data: { id, username: form.username, token } };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function regenerateToken(userId: string): Promise<ActionResult<{ token: string }>> {
  try {
    const token = generateToken();
    await db.update(users).set({ token }).where(eq(users.id, userId));
    return { success: true, data: { token } };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}