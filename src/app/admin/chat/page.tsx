'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '@/lib/actions/chat';
import { fetchUsers } from '@/lib/actions/fetch';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Send, MessageCircle } from 'lucide-react';

interface Message { id: string; senderId: string; receiverId: string; content: string; read: boolean | number; createdAt: string }
interface User { id: string; username: string }

export default function AdminChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchUsers().then(u => setUsers((u || []) as User[])).catch(() => {}); }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const load = async () => {
      const msgs = await getMessages(selectedUser.id) as Message[];
      setMessages(msgs || []);
      if (msgs && msgs.length > 0) setAdminId(msgs[0].senderId === selectedUser.id ? msgs[0].receiverId : msgs[0].senderId);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSend() {
    if (!text.trim() || !selectedUser || !adminId) return;
    setLoading(true);
    await sendMessage(adminId, selectedUser.id, text.trim());
    setText('');
    const msgs = await getMessages(selectedUser.id) as Message[];
    setMessages(msgs);
    setLoading(false);
  }

  return (
    <div className="animate-in h-[calc(100vh-120px)] flex gap-4">
      <div className="w-56 shrink-0 overflow-y-auto space-y-1">
        <p className="text-xs text-roulette-muted uppercase tracking-wider mb-3">Utilisateurs</p>
        {users.map(u => (
          <button
            key={u.id}
            onClick={() => setSelectedUser(u)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selectedUser?.id === u.id ? 'bg-roulette-red text-white' : 'text-roulette-muted hover:bg-roulette-card hover:text-white'
            }`}
          >
            {u.username}
          </button>
        ))}
        {users.length === 0 && <p className="text-xs text-roulette-muted p-2">Aucun utilisateur</p>}
      </div>

      <Card className="flex-1 flex flex-col p-4 overflow-hidden">
        {selectedUser ? (
          <>
            <p className="text-sm font-medium text-white mb-3 pb-3 border-b border-roulette-border">Chat avec <span className="text-roulette-red">{selectedUser.username}</span></p>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.senderId !== selectedUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${m.senderId !== selectedUser.id ? 'bg-roulette-red text-white' : 'bg-roulette-dark text-gray-200 border border-roulette-border'}`}>
                    <p>{m.content}</p>
                    <p className="text-[10px] opacity-60 mt-1">{new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && <p className="text-sm text-roulette-muted text-center py-8">Aucun message. Dis bonjour.</p>}
              <div ref={bottomRef} />
            </div>
            <div className="flex gap-2">
              <Input placeholder="Écrire..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
              <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-roulette-red hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"><Send size={16} /></button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-roulette-muted">
            <MessageCircle size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Sélectionne un utilisateur</p>
          </div>
        )}
      </Card>
    </div>
  );
}