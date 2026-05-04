'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUsers } from '@/lib/actions/fetch';
import { createTask } from '@/lib/actions/tasks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { PlusCircle } from 'lucide-react';

interface DbUser { id: string; username: string }

export default function CreateTaskPage() {
  const router = useRouter();
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskType, setTaskType] = useState<'regular' | 'punishment'>('regular');

  useEffect(() => { fetchUsers().then(u => { setUsers(u as DbUser[]); if (u.length > 0) setSelectedUser((u as DbUser[])[0].id); }); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !selectedUser || !deadline) { setError('Tous les champs requis.'); return; }
    setLoading(true); setError('');
    const res = await createTask({ title, description, userId: selectedUser, deadline: new Date(deadline).toISOString(), type: taskType, createdBy: 'admin' });
    if (res.success) { router.push('/admin/dashboard'); router.refresh(); } else { setError(res.error || 'Erreur.'); }
    setLoading(false);
  }

  return (
    <div className="animate-in max-w-xl mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Créer une tâche</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Titre" placeholder="Rapport hebdomadaire" value={title} onChange={e => setTitle(e.target.value)} required />
          <Textarea label="Description" placeholder="Détails..." value={description} onChange={e => setDescription(e.target.value)} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300 font-body">Assigné à</label>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="w-full px-4 py-3 bg-roulette-dark border border-roulette-border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-roulette-red">
              {users.map(u => (<option key={u.id} value={u.id}>{u.username}</option>))}
            </select>
          </div>
          <Input label="Deadline" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300 font-body">Type</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setTaskType('regular')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${taskType === 'regular' ? 'bg-roulette-red text-white' : 'bg-roulette-dark text-roulette-muted border border-roulette-border'}`}>Régulière</button>
              <button type="button" onClick={() => setTaskType('punishment')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${taskType === 'punishment' ? 'bg-roulette-red text-white' : 'bg-roulette-dark text-roulette-muted border border-roulette-border'}`}>Punition</button>
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" loading={loading} className="w-full" size="lg"><PlusCircle size={18} /> Créer</Button>
        </form>
      </Card>
    </div>
  );
}