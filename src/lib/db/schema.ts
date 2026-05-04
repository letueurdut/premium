import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
  token: text('token'),
  authId: text('auth_id'),
  lastActive: text('last_active'),
  createdAt: text('created_at').notNull(),
});

export const userStats = sqliteTable('user_stats', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  tasksCompleted: integer('tasks_completed').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  totalMinutes: integer('total_minutes').notNull().default(0),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdBy: text('created_by').notNull().references(() => users.id),
  deadline: text('deadline').notNull(),
  status: text('status', { enum: ['pending', 'in-progress', 'submitted', 'completed', 'failed'] }).notNull().default('pending'),
  type: text('type', { enum: ['regular', 'punishment'] }).notNull().default('regular'),
  createdAt: text('created_at').notNull(),
});

export const proofSubmissions = sqliteTable('proof_submissions', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content'),
  mediaUrls: text('media_urls'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  adminNote: text('admin_note'),
  submittedAt: text('submitted_at').notNull(),
  reviewedAt: text('reviewed_at'),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const rewards = sqliteTable('rewards', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  unlockType: text('unlock_type').notNull(),
  unlockValue: integer('unlock_value').notNull(),
  iconUrl: text('icon_url'),
  createdAt: text('created_at').notNull(),
});

export const userRewards = sqliteTable('user_rewards', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardId: text('reward_id').notNull().references(() => rewards.id, { onDelete: 'cascade' }),
  unlockedAt: text('unlocked_at').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.rewardId] }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  stats: one(userStats, { fields: [users.id], references: [userStats.userId] }),
  tasks: many(tasks),
  proofs: many(proofSubmissions),
  sentMessages: many(messages, { relationName: 'sentMessages' }),
  receivedMessages: many(messages, { relationName: 'receivedMessages' }),
  rewards: many(userRewards),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  proofs: many(proofSubmissions),
}));