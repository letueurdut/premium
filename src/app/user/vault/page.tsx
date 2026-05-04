'use client';

import { useState, useEffect } from 'react';
import { fetchRewards } from '@/lib/actions/fetch';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lock, CheckCircle } from 'lucide-react';
import { getUserStatsAction } from '@/lib/actions/chat';

interface Reward { id: string; title: string; description: string | null; unlockType: string; unlockValue: number }

export default function VaultPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [stats, setStats] = useState<{ tasksCompleted: number; currentStreak: number; longestStreak: number; totalMinutes: number } | null>(null);

  useEffect(() => {
    const raw = document.cookie.split('; ').find(r => r.startsWith('premium_session='));
    if (!raw) return;
            try { const s = JSON.parse(decodeURIComponent(raw.split('=')[1])); getUserStatsAction(s.id).then(d => setStats(d.stats)); } catch {}
  }, []);

  useEffect(() => { fetchRewards().then(r => setRewards(r as Reward[])); }, []);

  function isUnlocked(r: Reward): boolean {
    if (!stats) return false;
    if (r.unlockType === 'tasks_completed') return stats.tasksCompleted >= r.unlockValue;
    if (r.unlockType === 'streak_days') return stats.currentStreak >= r.unlockValue || stats.longestStreak >= r.unlockValue;
    if (r.unlockType === 'time_on_platform') return stats.totalMinutes >= r.unlockValue;
    return false;
  }

  function progress(r: Reward): number {
    if (!stats) return 0;
    if (r.unlockType === 'tasks_completed') return Math.min(100, (stats.tasksCompleted / r.unlockValue) * 100);
    if (r.unlockType === 'streak_days') return Math.min(100, (stats.currentStreak / r.unlockValue) * 100);
    if (r.unlockType === 'time_on_platform') return Math.min(100, (stats.totalMinutes / r.unlockValue) * 100);
    return 0;
  }

  const typeLabel: Record<string, string> = { tasks_completed: 'Tâches', streak_days: 'Streak', time_on_platform: 'Temps' };

  return (
    <div className="animate-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-white">Vault</h1>

      <div className="grid gap-3">
        {rewards.map(r => {
          const unlocked = isUnlocked(r);
          return (
            <Card key={r.id} hover className={unlocked ? 'border-amber-800/50' : ''}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${unlocked ? 'bg-amber-900/40 border border-amber-700' : 'bg-roulette-dark border border-roulette-border'}`}>
                    {unlocked ? <CheckCircle size={18} className="text-amber-400" /> : <Lock size={18} className="text-roulette-muted" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${unlocked ? 'text-amber-300' : 'text-white'}`}>{r.title}</p>
                    <p className="text-xs text-roulette-muted">{r.description || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={unlocked ? 'green' : 'neutral'}>{unlocked ? 'Débloqué' : `${typeLabel[r.unlockType]} ×${r.unlockValue}`}</Badge>
                  {!unlocked && (
                    <div className="w-24 h-1.5 bg-roulette-dark rounded-full overflow-hidden">
                      <div className="h-full bg-roulette-red rounded-full transition-all" style={{ width: `${progress(r)}%` }} />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {rewards.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucune récompense.</p>}
      </div>
    </div>
  );
}