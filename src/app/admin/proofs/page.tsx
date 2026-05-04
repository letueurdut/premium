'use client';

import { useState, useEffect } from 'react';
import { fetchProofs } from '@/lib/actions/fetch';
import { reviewProof } from '@/lib/actions/proofs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { Check, X } from 'lucide-react';

interface ProofItem { id: string; taskTitle: string | null; username: string | null; submittedAt: string | null; content: string | null; status: string | null; adminNote: string | null; mediaUrls: string | null }

export default function ProofsPage() {
  const [proofs, setProofs] = useState<ProofItem[]>([]);
  const [reviewModal, setReviewModal] = useState<{ id: string; action: 'approved' | 'rejected' } | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => { fetchProofs().then(p => setProofs(p as ProofItem[])); }, [refreshKey]);

  async function handleReview() {
    if (!reviewModal) return;
    setLoading(true);
    await reviewProof(reviewModal.id, reviewModal.action, note);
    setReviewModal(null); setNote(''); setRefreshKey(k => k + 1);
    setLoading(false);
  }

  const statusBadge = (s: string) => {
    const map: Record<string, 'green' | 'yellow' | 'red' | 'neutral'> = { 'approved': 'green', 'pending': 'yellow', 'rejected': 'red' };
    return <Badge variant={map[s] || 'neutral'}>{s}</Badge>;
  };

  const mediaFromDb = (raw: string | null): string[] => {
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return raw.split(','); }
  };

  return (
    <div className="animate-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Preuves</h1>
      <div className="grid gap-3">
        {proofs.map(p => (
          <Card key={p.id} hover className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white">{p.taskTitle || 'Tâche'}</p>
                <p className="text-xs text-roulette-muted">{p.username} · {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('fr-FR') : '?'}</p>
                {p.content && <p className="text-sm text-gray-300 mt-2">{p.content}</p>}
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(p.status || 'pending')}
                {p.adminNote && <p className="text-xs text-roulette-muted italic max-w-[200px] truncate" title={p.adminNote}>{p.adminNote}</p>}
              </div>
            </div>
            {mediaFromDb(p.mediaUrls).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {mediaFromDb(p.mediaUrls).map((url, i) => (
                  <button key={i} onClick={() => setPreviewUrl(url)} className="w-16 h-16 rounded-lg overflow-hidden border border-roulette-border hover:border-roulette-red transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {p.status === 'pending' && (
              <div className="flex gap-2 pt-2 border-t border-roulette-border">
                <Button size="sm" onClick={() => setReviewModal({ id: p.id, action: 'approved' })}><Check size={14} /> Approuver</Button>
                <Button size="sm" variant="danger" onClick={() => setReviewModal({ id: p.id, action: 'rejected' })}><X size={14} /> Rejeter</Button>
              </div>
            )}
          </Card>
        ))}
        {proofs.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucune preuve.</p>}
      </div>

      <Modal open={!!reviewModal} onClose={() => setReviewModal(null)} title={reviewModal?.action === 'approved' ? 'Approuver' : 'Rejeter'}>
        <div className="space-y-4">
          <Textarea label="Note" placeholder="Commentaire..." value={note} onChange={e => setNote(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handleReview} loading={loading} className="flex-1" variant={reviewModal?.action === 'rejected' ? 'danger' : 'primary'}>{reviewModal?.action === 'approved' ? 'Approuver' : 'Rejeter'}</Button>
            <Button onClick={() => setReviewModal(null)} variant="ghost">Annuler</Button>
          </div>
        </div>
      </Modal>

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewUrl(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </div>
  );
}