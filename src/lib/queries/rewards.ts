import { db } from '@/lib/db';
import { rewards } from '@/lib/db/schema';

export async function getAllRewards() {
  return db.select().from(rewards);
}