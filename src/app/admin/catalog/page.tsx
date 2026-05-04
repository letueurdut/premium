'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { catalogTasks, categories } from '@/lib/catalog';
import type { CatalogTask } from '@/lib/catalog';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function CatalogPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? catalogTasks : catalogTasks.filter(t => t.category === filter);

  function handleAssign(task: CatalogTask) {
    const params = new URLSearchParams({
      title: task.title,
      description: task.description,
      type: task.type,
    });
    router.push(`/admin/create-task?${params.toString()}`);
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={24} className="text-roulette-red" />
        <h1 className="font-display text-2xl font-bold text-white">Catalogue de tâches</h1>
      </div>
      <p className="text-sm text-roulette-muted">10 tâches pré-enregistrées. Clique sur une tâche pour l&apos;assigner directement.</p>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-roulette-red text-white' : 'bg-roulette-dark text-roulette-muted border border-roulette-border'}`}>Toutes</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === c ? 'bg-roulette-red text-white' : 'bg-roulette-dark text-roulette-muted border border-roulette-border'}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(task => (
          <Card key={task.id} hover className="group cursor-pointer" onClick={() => handleAssign(task)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{task.icon}</span>
                  <p className="text-sm font-semibold text-white group-hover:text-roulette-red transition-colors">{task.title}</p>
                  <Badge variant={task.type === 'punishment' ? 'red' : 'neutral'}>{task.type === 'punishment' ? 'Punition' : 'Régulière'}</Badge>
                  <Badge variant="yellow">{task.category}</Badge>
                </div>
                <p className="text-sm text-roulette-muted leading-relaxed">{task.description}</p>
              </div>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm"><ArrowRight size={14} /> Assigner</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}