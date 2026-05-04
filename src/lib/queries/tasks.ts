import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getTasksForUser(userId: string) {
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
}

export async function getAllTasks() {
  return db.select({
    id: tasks.id,
    title: tasks.title,
    description: tasks.description,
    userId: tasks.userId,
    username: users.username,
    deadline: tasks.deadline,
    status: tasks.status,
    type: tasks.type,
    createdAt: tasks.createdAt,
  }).from(tasks).leftJoin(users, eq(tasks.userId, users.id)).orderBy(desc(tasks.createdAt));
}

export async function getOverdueTasks() {
  return db.select({
    id: tasks.id,
    title: tasks.title,
    userId: tasks.userId,
    username: users.username,
    deadline: tasks.deadline,
    status: tasks.status,
    type: tasks.type,
  }).from(tasks).leftJoin(users, eq(tasks.userId, users.id)).where(eq(tasks.status, 'pending')).orderBy(desc(tasks.deadline));
}

export async function getTaskById(taskId: string) {
  return db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
}