'use server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { ActionResult } from '@/lib/supabase/types';

export async function createTask(form: {
  title: string;
  description: string;
  userId: string;
  deadline: string;
  type: 'regular' | 'punishment';
  createdBy: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const id = crypto.randomUUID();
    await db.insert(tasks).values({
      id,
      title: form.title,
      description: form.description,
      userId: form.userId,
      createdBy: form.createdBy,
      deadline: form.deadline,
      type: form.type,
      createdAt: new Date().toISOString(),
    });
    return { success: true, data: { id } };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function updateTaskStatus(taskId: string, status: string): Promise<ActionResult> {
  try {
    await db.update(tasks).set({ status: status as typeof tasks.$inferInsert['status'] }).where(eq(tasks.id, taskId));
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}