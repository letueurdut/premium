const { createClient } = require('@libsql/client');
const crypto = require('crypto');

const url = process.env.TURSO_DATABASE_URL || 'file:premium.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

async function main() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, username TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user',
      token TEXT, auth_id TEXT, last_active TEXT, created_at TEXT NOT NULL
    )
  `);
  await client.execute(`CREATE TABLE IF NOT EXISTS user_stats (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, tasks_completed INTEGER NOT NULL DEFAULT 0, current_streak INTEGER NOT NULL DEFAULT 0, longest_streak INTEGER NOT NULL DEFAULT 0, total_minutes INTEGER NOT NULL DEFAULT 0)`);
  await client.execute(`CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_by TEXT NOT NULL REFERENCES users(id), deadline TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', type TEXT NOT NULL DEFAULT 'regular', created_at TEXT NOT NULL)`);
  await client.execute(`CREATE TABLE IF NOT EXISTS proof_submissions (id TEXT PRIMARY KEY, task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, content TEXT, media_urls TEXT, status TEXT NOT NULL DEFAULT 'pending', admin_note TEXT, submitted_at TEXT NOT NULL, reviewed_at TEXT)`);
  await client.execute(`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, content TEXT NOT NULL, read INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL)`);
  await client.execute(`CREATE TABLE IF NOT EXISTS rewards (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, unlock_type TEXT NOT NULL, unlock_value INTEGER NOT NULL, icon_url TEXT, created_at TEXT NOT NULL)`);
  await client.execute(`CREATE TABLE IF NOT EXISTS user_rewards (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, reward_id TEXT NOT NULL REFERENCES rewards(id) ON DELETE CASCADE, unlocked_at TEXT NOT NULL, PRIMARY KEY (user_id, reward_id))`);

  const now = new Date().toISOString();
  const adminId = crypto.randomUUID();
  const sub1 = { id: crypto.randomUUID(), name: 'Ghost_Zero', token: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' };
  const sub2 = { id: crypto.randomUUID(), name: 'Shadow_X', token: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' };
  const tomorrow = new Date(Date.now() + 86400000).toISOString();
  const dayAfter = new Date(Date.now() + 172800000).toISOString();
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  await client.batch([
    { sql: 'INSERT OR IGNORE INTO users (id, username, role, token, created_at) VALUES (?, ?, ?, ?, ?)', args: [adminId, 'Admin', 'admin', null, now] },
    { sql: 'INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)', args: [adminId] },
    { sql: 'INSERT OR IGNORE INTO users (id, username, role, token, created_at) VALUES (?, ?, ?, ?, ?)', args: [sub1.id, sub1.name, 'user', sub1.token, now] },
    { sql: 'INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)', args: [sub1.id] },
    { sql: 'INSERT OR IGNORE INTO users (id, username, role, token, created_at) VALUES (?, ?, ?, ?, ?)', args: [sub2.id, sub2.name, 'user', sub2.token, now] },
    { sql: 'INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)', args: [sub2.id] },
    { sql: 'INSERT OR IGNORE INTO tasks (id, title, description, user_id, created_by, deadline, status, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Rapport hebdomadaire', 'Rediger le rapport', sub1.id, adminId, tomorrow, 'pending', 'regular', now] },
    { sql: 'INSERT OR IGNORE INTO tasks (id, title, description, user_id, created_by, deadline, status, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), '100 pompes', 'Filmer 100 pompes', sub1.id, adminId, dayAfter, 'pending', 'punishment', now] },
    { sql: 'INSERT OR IGNORE INTO tasks (id, title, description, user_id, created_by, deadline, status, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Photo miroir', 'Selfie tenue imposée', sub2.id, adminId, tomorrow, 'pending', 'regular', now] },
    { sql: 'INSERT OR IGNORE INTO tasks (id, title, description, user_id, created_by, deadline, status, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Course 5km', 'Preuve GPS', sub2.id, adminId, dayAfter, 'in-progress', 'regular', now] },
    { sql: 'INSERT OR IGNORE INTO tasks (id, title, description, user_id, created_by, deadline, status, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Essai 500 mots', 'Discipline', sub1.id, adminId, yesterday, 'failed', 'punishment', now] },
    { sql: 'INSERT OR IGNORE INTO rewards (id, title, description, unlock_type, unlock_value, created_at) VALUES (?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Badge Loyal', 'Complete 10 tasks', 'tasks_completed', 10, now] },
    { sql: 'INSERT OR IGNORE INTO rewards (id, title, description, unlock_type, unlock_value, created_at) VALUES (?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Streak 7 jours', '7 day streak', 'streak_days', 7, now] },
    { sql: 'INSERT OR IGNORE INTO rewards (id, title, description, unlock_type, unlock_value, created_at) VALUES (?, ?, ?, ?, ?, ?)', args: [crypto.randomUUID(), 'Photo libre', 'Photo de recompense', 'tasks_completed', 5, now] },
  ]);

  console.log('Seed complete.');
  console.log(`Admin: ${adminId}`);
  console.log(`Ghost_Zero: ${sub1.name} | ${sub1.token}`);
  console.log(`Shadow_X: ${sub2.name} | ${sub2.token}`);
}

main().catch(console.error);