'use client';

import { useState, useEffect } from 'react';
import { fetchOverdue } from '@/lib/actions/fetch';
import { updateTaskStatus } from '@/lib/actions/tasks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle } from 'lucide-react';

interface OverdueTask { id: string; title: string | null; username: string | null; deadline: string | null; status: string | null; type: string | null }

export default function OverduePage() {
  const [tasks, setTasks] = useState<OverdueTask[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchOverdue().then(t => setTasks(t as OverdueTask[])); }, [refreshKey]);

  async function markFailed(taskId: string) { setLoading(taskId); await updateTaskStatus(taskId, 'failed'); setRefreshKey(k => k + 1); setLoading(null); }

  const isOverdue = (deadline: string | null) => deadline ? new Date(deadline) < new Date() : false;

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center gap-3"><AlertTriangle className="text-red-400" size={24} /><h1 className="font-display text-2xl font-bold text-white">Retards</h1></div>
      <div className="grid gap-3">
        {tasks.map(t => (
          <Card key={t.id} className={isOverdue(t.deadline) ? 'task-punishment' : ''}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{t.title}</p>
                  <Badge variant={t.type === 'punishment' ? 'red' : 'neutral'}>{t.type}</Badge>
                  <Badge variant={isOverdue(t.deadline) ? 'red' : 'yellow'}>{t.status}</Badge>
                </div>
                <p className="text-xs text-roulette-muted">
                  {t.username} · {t.deadline ? new Date(t.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '?'}
                  {isOverdue(t.deadline) && <span className="text-red-400 ml-2">RETARD</span>}
                </p>
              </div>
              {t.status === 'pending' && isOverdue(t.deadline) && (
                <Button size="sm" variant="danger" loading={loading === t.id} onClick={() => markFailed(t.id)}>Marquer échoué</Button>
              )}
            </div>
          </Card>
        ))}
        {tasks.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucun retard.</p>}
      </div>
    </div>
  );
}