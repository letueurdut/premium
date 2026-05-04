'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/actions/auth';

type Mode = 'user' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await loginUser(username, token);
    if (!result.success) {
      setError(result.error ?? 'Erreur.');
      setLoading(false);
      return;
    }
    router.push('/user/dashboard');
  }

  async function handleAdminSignIn() {
    router.push('/sign-in');
  }

  const btnClass = (m: Mode) => mode === m
    ? 'flex-1 py-2 text-sm font-medium rounded-md bg-p-red text-white transition-all duration-200'
    : 'flex-1 py-2 text-sm font-medium rounded-md text-p-text-muted hover:text-p-text transition-all duration-200';

  return (
    <main className="min-h-screen bg-p-black flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 60%)' }} />
      <div className="relative w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-1">Dark Desires</h1>
          <p className="text-p-text-muted text-sm">Accès restreint</p>
        </div>
        <div className="flex rounded-lg border border-p-border bg-p-surface p-1 mb-6">
          <button onClick={() => { setMode('user'); setError(''); }} className={btnClass('user')}>Accès User</button>
          <button onClick={() => { setMode('admin'); setError(''); }} className={btnClass('admin')}>Accès Admin</button>
        </div>
        {mode === 'user' ? (
          <form onSubmit={handleUserSubmit} className="card p-6 space-y-4">
            <div>
              <label className="block text-xs text-p-text-muted mb-1.5 uppercase tracking-wider">Username</label>
              <input className="input" placeholder="ghost_zero" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="block text-xs text-p-text-muted mb-1.5 uppercase tracking-wider">Token de session</label>
              <input className="input font-mono text-xs" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" value={token} onChange={e => setToken(e.target.value)} required />
            </div>
            {error && <p className="text-p-red text-sm text-center animate-fade">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Connexion...</span>
                : 'Entrer'}
            </button>
          </form>
        ) : (
          <div className="card p-6 space-y-4">
            <p className="text-p-text-muted text-sm">Connexion via Clerk pour les administrateurs.</p>
            <button onClick={handleAdminSignIn} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Chargement...' : 'Se connecter avec Clerk'}
            </button>
          </div>
        )}
        <p className="text-center text-xs text-p-text-dim mt-6">Token perdu ? Contacte l&apos;administrateur.</p>
      </div>
    </main>
  );
}