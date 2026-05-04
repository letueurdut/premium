import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  let [user] = await db.select().from(users).where(eq(users.authId, userId)).limit(1);
  if (!user) {
    const [admin] = await db.select().from(users).where(and(eq(users.role, 'admin'), isNull(users.authId))).limit(1);
    if (admin) {
      await db.update(users).set({ authId: userId }).where(eq(users.id, admin.id));
      user = { ...admin, authId: userId };
    }
  }

  if (!user || user.role !== 'admin') redirect('/user/dashboard');

  return (
    <div className="min-h-screen bg-roulette-black">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-14 p-6">{children}</main>
    </div>
  );
}