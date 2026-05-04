'use client';

import { useState, useEffect } from 'react';
import { getUserStatsAction, getUserTasks } from '@/lib/actions/chat';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Flame, Clock, Target } from 'lucide-react';

interface UserData { username: string; lastActive: string | null }
interface StatsData { tasksCompleted: number; currentStreak: number; longestStreak: number; totalMinutes: number }

interface DashboardTask { id: string; title: string; description: string | null; deadline: string; status: string; type: string }

export default function UserDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentTasks, setRecentTasks] = useState<DashboardTask[]>([]);
  const [session, setSession] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const raw = document.cookie.split('; ').find(r => r.startsWith('premium_session='));
    if (!raw) return;
    try { setSession(JSON.parse(decodeURIComponent(raw.split('=')[1]))); } catch {}
  }, []);

  useEffect(() => {
    if (!session?.id) return;
    Promise.all([getUserStatsAction(session.id), getUserTasks(session.id)]).then(([ud, td]) => {
      setUser(ud.user as UserData);
      setStats(ud.stats as StatsData);
      setRecentTasks(td as DashboardTask[]);
    });
  }, [session]);

  const statusBadge = (s: string) => {
    const map: Record<string, 'green' | 'yellow' | 'red' | 'neutral'> = {
      'completed': 'green', 'in-progress': 'yellow', 'pending': 'yellow', 'submitted': 'yellow', 'failed': 'red',
    };
    return <Badge variant={map[s] || 'neutral'}>{s}</Badge>;
  };

  return (
    <div className="animate-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">
        Dashboard{user ? ` — ${user.username}` : ''}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tâches complétées', value: stats?.tasksCompleted ?? 0, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Streak actuel', value: `${stats?.currentStreak ?? 0} j`, icon: Flame, color: 'text-orange-400' },
          { label: 'Record streak', value: `${stats?.longestStreak ?? 0} j`, icon: Target, color: 'text-purple-400' },
          { label: 'Minutes totales', value: stats?.totalMinutes ?? 0, icon: Clock, color: 'text-blue-400' },
        ].map((s, i) => (
          <Card key={i} hover className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg bg-roulette-dark border border-roulette-border ${s.color}`}><s.icon size={18} /></div>
            <div><p className="text-xs text-roulette-muted">{s.label}</p><p className="text-xl font-bold text-white">{s.value}</p></div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold text-white mb-4">Mes tâches</h2>
        <div className="space-y-2">
          {recentTasks.map((t) => (
            <div key={t.id} className={`flex items-center justify-between py-2 border-b border-roulette-border last:border-0 ${t.type === 'punishment' ? 'border-l-2 border-l-red-600 pl-3' : ''}`}>
              <div>
                <p className="text-sm text-white font-medium">{t.title}</p>
                <p className="text-xs text-roulette-muted">Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString('fr-FR') : '?'}</p>
              </div>
              <div className="flex items-center gap-2">
                {t.type === 'punishment' && <Badge variant="red">punition</Badge>}
                {statusBadge(t.status)}
              </div>
            </div>
          ))}
          {recentTasks.length === 0 && <p className="text-sm text-roulette-muted text-center py-4">Aucune tâche.</p>}
        </div>
      </Card>
    </div>
  );
}