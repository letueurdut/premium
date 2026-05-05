'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '@/lib/actions/chat';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Send } from 'lucide-react';

interface Message { id: string; senderId: string; receiverId: string; content: string; read: boolean | number; createdAt: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [session, setSession] = useState<{ id: string } | null>(null);
  const [adminId, setAdminId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = document.cookie.split('; ').find(r => r.startsWith('premium_session='));
    if (!raw) return;
    try { setSession(JSON.parse(decodeURIComponent(raw.split('=')[1]))); } catch {}
  }, []);

  useEffect(() => {
    if (!session?.id) return;
    const load = async () => {
      const msgs = (await getMessages(session.id) || []) as Message[];
      if (msgs.length > 0) setAdminId(msgs[0].senderId === session.id ? msgs[0].receiverId : msgs[0].senderId);
      setMessages(msgs);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSend() {
    if (!text.trim() || !session?.id || !adminId) return;
    setLoading(true);
    await sendMessage(session.id, adminId, text.trim());
    setText('');
    const msgs = await getMessages(session.id) as Message[];
    setMessages(msgs);
    setLoading(false);
  }

  return (
    <div className="animate-in h-[calc(100vh-120px)] flex flex-col">
      <h1 className="font-display text-2xl font-bold text-white mb-4">Chat</h1>

      <Card className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.senderId === session?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${m.senderId === session?.id ? 'bg-roulette-red text-white' : 'bg-roulette-dark text-gray-200 border border-roulette-border'}`}>
                <p>{m.content}</p>
                <p className="text-[10px] opacity-60 mt-1">{new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucun message.</p>}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Input placeholder="Écrire un message..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-roulette-red hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"><Send size={16} /></button>
        </div>
      </Card>
    </div>
  );
}