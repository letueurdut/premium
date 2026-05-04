'use server';
import { db } from '@/lib/db';
import { tasks, users, proofSubmissions } from '@/lib/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { getAllUsers } from '@/lib/queries/users';
import { getAllTasks } from '@/lib/queries/tasks';
import { getAllProofs } from '@/lib/queries/proofs';
import { getOverdueTasks } from '@/lib/queries/tasks';
import { getAllRewards } from '@/lib/queries/rewards';

export async function fetchUsers() { return getAllUsers(); }
export async function fetchTasks() { return getAllTasks(); }
export async function fetchProofs() { return getAllProofs(); }
export async function fetchOverdue() { return getOverdueTasks(); }
export async function fetchRewards() { return getAllRewards(); }

export async function fetchDashboardData() {
  const [stats, pending, overdue, proofs, userCount, recentTasks] = await Promise.all([
    db.select({ total: count() }).from(tasks),
    db.select({ total: count() }).from(tasks).where(eq(tasks.status, 'pending')),
    db.select({ total: count() }).from(tasks).where(eq(tasks.status, 'failed')),
    db.select({ total: count() }).from(proofSubmissions).where(eq(proofSubmissions.status, 'pending')),
    db.select({ total: count() }).from(users).where(eq(users.role, 'user')),
    db.select({
      id: tasks.id, title: tasks.title, status: tasks.status, type: tasks.type,
      username: users.username, deadline: tasks.deadline,
    }).from(tasks).leftJoin(users, eq(tasks.userId, users.id)).orderBy(desc(tasks.createdAt)).limit(5),
  ]);
  return { stats: stats[0], pending: pending[0], overdue: overdue[0], proofs: proofs[0], userCount: userCount[0], recentTasks };
}