import { db } from '@/lib/db';
import { proofSubmissions, users, tasks } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getPendingProofs() {
  return db.select({
    id: proofSubmissions.id,
    taskId: proofSubmissions.taskId,
    taskTitle: tasks.title,
    userId: proofSubmissions.userId,
    username: users.username,
    content: proofSubmissions.content,
    mediaUrls: proofSubmissions.mediaUrls,
    status: proofSubmissions.status,
    submittedAt: proofSubmissions.submittedAt,
    adminNote: proofSubmissions.adminNote,
  }).from(proofSubmissions)
    .leftJoin(users, eq(proofSubmissions.userId, users.id))
    .leftJoin(tasks, eq(proofSubmissions.taskId, tasks.id))
    .where(eq(proofSubmissions.status, 'pending'))
    .orderBy(desc(proofSubmissions.submittedAt));
}

export async function getProofsForTask(taskId: string) {
  return db.select().from(proofSubmissions).where(eq(proofSubmissions.taskId, taskId)).orderBy(desc(proofSubmissions.submittedAt));
}

export async function getAllProofs() {
  return db.select({
    id: proofSubmissions.id,
    taskId: proofSubmissions.taskId,
    taskTitle: tasks.title,
    userId: proofSubmissions.userId,
    username: users.username,
    content: proofSubmissions.content,
    mediaUrls: proofSubmissions.mediaUrls,
    status: proofSubmissions.status,
    submittedAt: proofSubmissions.submittedAt,
    adminNote: proofSubmissions.adminNote,
    reviewedAt: proofSubmissions.reviewedAt,
  }).from(proofSubmissions)
    .leftJoin(users, eq(proofSubmissions.userId, users.id))
    .leftJoin(tasks, eq(proofSubmissions.taskId, tasks.id))
    .orderBy(desc(proofSubmissions.submittedAt));
}