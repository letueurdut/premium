'use server';
import { db } from '@/lib/db';
import { proofSubmissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { ActionResult } from '@/lib/supabase/types';

export async function submitProof(form: {
  taskId: string;
  userId: string;
  content?: string;
  mediaUrl?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const id = crypto.randomUUID();
    await db.insert(proofSubmissions).values({
      id,
      taskId: form.taskId,
      userId: form.userId,
      content: form.content,
      mediaUrls: form.mediaUrl ? JSON.stringify([form.mediaUrl]) : null,
      submittedAt: new Date().toISOString(),
    });
    return { success: true, data: { id } };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function reviewProof(proofId: string, status: 'approved' | 'rejected', note?: string): Promise<ActionResult> {
  try {
    await db.update(proofSubmissions).set({
      status,
      adminNote: note,
      reviewedAt: new Date().toISOString(),
    }).where(eq(proofSubmissions.id, proofId));
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}