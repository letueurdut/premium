'use server';
import { db } from '@/lib/db';
import { messages, users } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import type { ActionResult } from '@/lib/supabase/types';

export async function sendMessage(senderId: string, receiverId: string, content: string): Promise<ActionResult> {
  try {
    await db.insert(messages).values({ id: crypto.randomUUID(), senderId, receiverId, content, read: false, createdAt: new Date().toISOString() });
    return { success: true };
  } catch (e) { return { success: false, error: (e as Error).message }; }
}

export async function getMessages(userId: string) {
  const [admin] = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin')).limit(1);
  const adminId = admin?.id;
  if (!adminId) return [];

  return db.select({
    id: messages.id, senderId: messages.senderId, receiverId: messages.receiverId,
    content: messages.content, read: messages.read, createdAt: messages.createdAt,
  }).from(messages)
    .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
    .orderBy(messages.createdAt);
}

export async function getUserTasks(userId: string) {
  const { tasks: tasksTable } = await import('@/lib/db/schema');
  const { eq: eq2, desc: desc2 } = await import('drizzle-orm');
  return db.select().from(tasksTable).where(eq2(tasksTable.userId, userId)).orderBy(desc2(tasksTable.createdAt));
}

export async function getUserStatsAction(userId: string) {
  const { users: usersTable, userStats } = await import('@/lib/db/schema');
  const { eq: eq2 } = await import('drizzle-orm');
  const [user] = await db.select({ username: usersTable.username, lastActive: usersTable.lastActive }).from(usersTable).where(eq2(usersTable.id, userId)).limit(1);
  const [stats] = await db.select().from(userStats).where(eq2(userStats.userId, userId)).limit(1);
  return { user, stats };
}

export async function markMessageRead(messageId: string) {
  await db.update(messages).set({ read: true }).where(eq(messages.id, messageId));
}