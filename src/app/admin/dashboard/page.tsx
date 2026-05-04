'use client';

import { useState, useEffect } from 'react';
import { fetchDashboardData } from '@/lib/actions/fetch';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Clock, AlertTriangle, FileText, Users } from 'lucide-react';

interface DashboardData {
  stats: { total: number } | null;
  pending: { total: number } | null;
  overdue: { total: number } | null;
  proofs: { total: number } | null;
  userCount: { total: number } | null;
  recentTasks: { id: string; title: string | null; status: string | null; type: string | null; username: string | null; deadline: string | null }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => { fetchDashboardData().then(setData); }, []);

  const statCards = [
    { label: 'Tâches totales', value: data?.stats?.total ?? 0, icon: FileText, color: 'text-blue-400' },
    { label: 'En attente', value: data?.pending?.total ?? 0, icon: Clock, color: 'text-yellow-400' },
    { label: 'En retard/échoué', value: data?.overdue?.total ?? 0, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Preuves à vérifier', value: data?.proofs?.total ?? 0, icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Utilisateurs', value: data?.userCount?.total ?? 0, icon: Users, color: 'text-purple-400' },
  ];

  const statusBadge = (s: string) => {
    const map: Record<string, 'green' | 'yellow' | 'red' | 'neutral'> = {
      'completed': 'green', 'in-progress': 'yellow', 'pending': 'yellow', 'submitted': 'yellow', 'failed': 'red',
    };
    return <Badge variant={map[s] || 'neutral'}>{s}</Badge>;
  };

  return (
    <div className="animate-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} hover className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-roulette-dark border border-roulette-border ${s.color}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-roulette-muted">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold text-white mb-4">Tâches récentes</h2>
        <div className="space-y-2">
          {data?.recentTasks.map((t: DashboardData['recentTasks'][number]) => (
            <div key={t.id} className="flex items-center justify-between py-2 border-b border-roulette-border last:border-0">
              <div>
                <p className="text-sm text-white font-medium">{t.title}</p>
                <p className="text-xs text-roulette-muted">{t.username} · {t.deadline ? new Date(t.deadline).toLocaleDateString('fr-FR') : '-'}</p>
              </div>
              <div className="flex items-center gap-2">
                {t.type === 'punishment' && <Badge variant="red">punition</Badge>}
                {statusBadge(t.status || 'pending')}
              </div>
            </div>
          ))}
          {(!data?.recentTasks || data.recentTasks.length === 0) && <p className="text-sm text-roulette-muted text-center py-4">Aucune tâche pour le moment.</p>}
        </div>
      </Card>
    </div>
  );
}