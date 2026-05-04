import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const raw = cookies().get('premium_session')?.value;
  if (!raw) redirect('/auth/login');

  let parsed;
  try { parsed = JSON.parse(raw); } catch { redirect('/auth/login'); }
  if (!parsed.id || parsed.role !== 'user') redirect('/auth/login');

  return (
    <div className="min-h-screen bg-roulette-black">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-14 p-6">{children}</main>
    </div>
  );
}