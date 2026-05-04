import { db } from '@/lib/db';
import { users, userStats } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getAllUsers() {
  return db.select({
    id: users.id,
    username: users.username,
    role: users.role,
    token: users.token,
    authId: users.authId,
    lastActive: users.lastActive,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.role, 'user')).orderBy(desc(users.createdAt));
}

export async function getUserById(userId: string) {
  return db.select().from(users).where(eq(users.id, userId)).limit(1);
}

export async function getUserStats(userId: string) {
  return db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
}