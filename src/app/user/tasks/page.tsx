'use client';

import { useState, useEffect } from 'react';
import { getUserTasks } from '@/lib/actions/chat';
import { submitProof } from '@/lib/actions/proofs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import FileUpload from '@/components/ui/FileUpload';
import { Upload, Clock } from 'lucide-react';

interface Task { id: string; title: string; description: string | null; deadline: string; status: string; type: string; createdAt: string }

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [session, setSession] = useState<{ id: string } | null>(null);
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [proofText, setProofText] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const raw = document.cookie.split('; ').find(r => r.startsWith('premium_session='));
    if (!raw) return;
    try { setSession(JSON.parse(decodeURIComponent(raw.split('=')[1]))); } catch {}
  }, []);

  useEffect(() => { if (session?.id) getUserTasks(session.id).then(t => setTasks(t as Task[])); }, [session, refreshKey]);

  async function handleSubmit() {
    if (!modalTask || !session) return;
    setLoading(true); setError('');
    const res = await submitProof({ taskId: modalTask.id, userId: session.id, content: proofText, mediaUrl: proofUrl });
    if (res.success) { setModalTask(null); setProofText(''); setProofUrl(''); setRefreshKey(k => k + 1); }
    else setError(res.error || 'Erreur.');
    setLoading(false);
  }

  const statusBadge = (s: string) => {
    const map: Record<string, 'green' | 'yellow' | 'red' | 'neutral'> = {
      'completed': 'green', 'in-progress': 'yellow', 'pending': 'yellow', 'submitted': 'yellow', 'failed': 'red',
    };
    return <Badge variant={map[s] || 'neutral'}>{s}</Badge>;
  };

  return (
    <div className="animate-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Mes tâches</h1>

      <div className="grid gap-3">
        {tasks.map(t => (
          <Card key={t.id} hover className={t.type === 'punishment' ? 'task-punishment' : ''}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{t.title}</p>
                  {t.type === 'punishment' && <Badge variant="red">punition</Badge>}
                  {statusBadge(t.status)}
                </div>
                {t.description && <p className="text-sm text-roulette-muted mb-2">{t.description}</p>}
                <p className="text-xs text-roulette-muted flex items-center gap-1">
                  <Clock size={12} /> Deadline: {new Date(t.deadline).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {t.status !== 'completed' && t.status !== 'failed' && (
                <Button size="sm" onClick={() => setModalTask(t)}><Upload size={14} /> Preuve</Button>
              )}
            </div>
          </Card>
        ))}
        {tasks.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucune tâche assignée.</p>}
      </div>

      <Modal open={!!modalTask} onClose={() => setModalTask(null)} title={`Preuve — ${modalTask?.title}`} size="md">
        <div className="space-y-4">
          <FileUpload onUpload={url => setProofUrl(url)} className="mb-4" />
          <Textarea label="Commentaire" placeholder="Décris ta preuve..." value={proofText} onChange={e => setProofText(e.target.value)} />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button onClick={handleSubmit} loading={loading} className="w-full">Envoyer la preuve</Button>
        </div>
      </Modal>
    </div>
  );
}