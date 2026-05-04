'use client';

import { useState, useEffect } from 'react';
import { fetchUsers } from '@/lib/actions/fetch';
import { createUser, regenerateToken } from '@/lib/actions/users';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { UserPlus, RefreshCw, Copy, Check } from 'lucide-react';

interface DbUserItem { id: string; username: string; role: string; token: string | null }

export default function UsersPage() {
  const [users, setUsers] = useState<DbUserItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchUsers().then(u => setUsers(u as DbUserItem[])); }, [refreshKey]);

  async function handleCreate() {
    if (!newName.trim()) { setError('Nom requis.'); return; }
    setLoading(true); setError('');
    const res = await createUser({ username: newName.trim() });
    if (res.success) { setShowModal(false); setNewName(''); setRefreshKey(k => k + 1); }
    else setError(res.error || 'Erreur.');
    setLoading(false);
  }

  async function handleRegen(userId: string) { await regenerateToken(userId); setRefreshKey(k => k + 1); }
  function copyToken(token: string) { navigator.clipboard.writeText(token); setCopied(token); setTimeout(() => setCopied(null), 2000); }

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Utilisateurs</h1>
        <Button onClick={() => setShowModal(true)}><UserPlus size={16} /> Nouveau</Button>
      </div>
      <div className="grid gap-3">
        {users.map(u => (
          <Card key={u.id} hover className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{u.username}</p>
              <button onClick={() => copyToken(u.token || '')} className="text-xs text-roulette-muted hover:text-white font-mono transition-colors flex items-center gap-1 mt-1">
                {copied === u.token ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {u.token?.slice(0, 8)}...
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="red">user</Badge>
              <button onClick={() => handleRegen(u.id)} className="p-2 rounded-lg text-roulette-muted hover:text-white hover:bg-roulette-dark transition-colors" title="Regénérer token"><RefreshCw size={14} /></button>
            </div>
          </Card>
        ))}
        {users.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucun utilisateur.</p>}
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nouvel utilisateur">
        <div className="space-y-4">
          <Input label="Nom" placeholder="Ghost_Zero" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button onClick={handleCreate} loading={loading} className="w-full">Créer</Button>
        </div>
      </Modal>
    </div>
  );
}