'use server';
import { db } from '@/lib/db';
import { rewards } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { ActionResult } from '@/lib/supabase/types';

export async function createReward(form: { title: string; description: string; unlockType: string; unlockValue: number }): Promise<ActionResult<{ id: string }>> {
  try {
    const id = crypto.randomUUID();
    await db.insert(rewards).values({ id, title: form.title, description: form.description, unlockType: form.unlockType, unlockValue: form.unlockValue, createdAt: new Date().toISOString() });
    return { success: true, data: { id } };
  } catch (e) { return { success: false, error: (e as Error).message }; }
}

export async function deleteReward(id: string): Promise<ActionResult> {
  try {
    await db.delete(rewards).where(eq(rewards.id, id));
    return { success: true };
  } catch (e) { return { success: false, error: (e as Error).message }; }
}