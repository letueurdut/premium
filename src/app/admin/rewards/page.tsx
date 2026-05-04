'use client';

import { useState, useEffect } from 'react';
import { fetchRewards } from '@/lib/actions/fetch';
import { createReward, deleteReward } from '@/lib/actions/rewards';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Gift, Plus } from 'lucide-react';

interface Reward { id: string; title: string; description: string | null; unlockType: string; unlockValue: number; createdAt: string }

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unlockType, setUnlockType] = useState('tasks_completed');
  const [unlockValue, setUnlockValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchRewards().then(r => setRewards(r as Reward[])); }, [refreshKey]);

  async function handleCreate() {
    if (!title.trim()) { setError('Titre requis.'); return; }
    setLoading(true); setError('');
    const res = await createReward({ title: title.trim(), description, unlockType, unlockValue });
    if (res.success) { setShowModal(false); setTitle(''); setDescription(''); setRefreshKey(k => k + 1); }
    else setError(res.error || 'Erreur.');
    setLoading(false);
  }

  async function handleDelete(id: string) { await deleteReward(id); setRefreshKey(k => k + 1); }

  const typeLabel: Record<string, string> = { tasks_completed: 'Tâches', streak_days: 'Streak', time_on_platform: 'Temps' };

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Vault</h1>
        <Button onClick={() => setShowModal(true)}><Plus size={16} /> Ajouter</Button>
      </div>
      <div className="grid gap-3">
        {rewards.map(r => (
          <Card key={r.id} hover className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-900/30 border border-amber-800 flex items-center justify-center"><Gift size={18} className="text-amber-400" /></div>
              <div><p className="text-sm font-medium text-white">{r.title}</p><p className="text-xs text-roulette-muted">{r.description || '-'}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="yellow">{typeLabel[r.unlockType] || r.unlockType} ×{r.unlockValue}</Badge>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>Supprimer</Button>
            </div>
          </Card>
        ))}
        {rewards.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucune récompense.</p>}
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nouvelle récompense">
        <div className="space-y-4">
          <Input label="Titre" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300 font-body">Type</label>
            <select value={unlockType} onChange={e => setUnlockType(e.target.value)} className="w-full px-4 py-3 bg-roulette-dark border border-roulette-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-roulette-red">
              <option value="tasks_completed">Tâches complétées</option>
              <option value="streak_days">Jours de streak</option>
              <option value="time_on_platform">Temps</option>
            </select>
          </div>
          <Input label="Valeur" type="number" min={1} value={unlockValue} onChange={e => setUnlockValue(parseInt(e.target.value) || 1)} />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button onClick={handleCreate} loading={loading} className="w-full">Créer</Button>
        </div>
      </Modal>
    </div>
  );
}