'use client';

import { useEffect, useState } from 'react';
import { getUserLists, addMovieToList, createList } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

interface AddToListModalProps {
  movie: { id: string; title: string; posterPath?: string; year?: number };
  onClose: () => void;
}

export default function AddToListModal({ movie, onClose }: AddToListModalProps) {
  const { user, profile } = useAuth();
  const [lists, setLists] = useState<any[]>([]);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) getUserLists(user.id).then(setLists);
  }, [user]);

  const refresh = () => {
    if (user) getUserLists(user.id).then(setLists);
  };

  const handleAdd = async (listId: string) => {
    await addMovieToList(listId, { movie_id: movie.id, title: movie.title, poster_path: movie.posterPath, year: movie.year });
    setJustAdded(prev => new Set([...prev, listId]));
    refresh();
  };

  const handleCreateAndAdd = async () => {
    if (!user || !profile || !newListName.trim()) return;
    const list = await createList(user.id, profile.nickname, newListName.trim());
    if (list) {
      await addMovieToList(list.id, { movie_id: movie.id, title: movie.title, poster_path: movie.posterPath, year: movie.year });
      setJustAdded(prev => new Set([...prev, list.id]));
    }
    setNewListName('');
    setCreating(false);
    refresh();
  };

  const isInList = (list: any) =>
    justAdded.has(list.id) || list.list_movies?.some((m: any) => m.movie_id === movie.id);

  return (
    <div className="modal-overlay">
      <div className="retro-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="panel-header panel-header-yellow">ADD TO LIST</div>
        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--yellow)', marginBottom: '18px', lineHeight: 1.8 }}>
          {movie.title}
        </div>

        {lists.length === 0 && !creating && (
          <div style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--dim)', marginBottom: '16px' }}>
            No lists yet. Create one below!
          </div>
        )}

        <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
          {lists.map(list => {
            const added = isInList(list);
            return (
              <div key={list.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '8px 10px', border: '1px solid var(--dim)', background: added ? 'rgba(0,255,65,0.05)' : 'transparent' }}>
                <div>
                  <div style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--green)' }}>{list.name}</div>
                  <div style={{ fontFamily: '"VT323", monospace', fontSize: '14px', color: 'var(--dim)' }}>{list.list_movies?.length || 0} films</div>
                </div>
                <button className={`retro-btn ${added ? '' : 'retro-btn-yellow'}`} style={{ fontSize: '8px', padding: '4px 8px' }} onClick={() => !added && handleAdd(list.id)} disabled={added}>
                  {added ? '✓ ADDED' : 'ADD'}
                </button>
              </div>
            );
          })}
        </div>

        {creating ? (
          <div style={{ marginBottom: '16px' }}>
            <input className="retro-input" placeholder="New list name..." value={newListName} onChange={e => setNewListName(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && handleCreateAndAdd()} />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="retro-btn retro-btn-yellow" style={{ fontSize: '8px' }} onClick={handleCreateAndAdd}>CREATE & ADD</button>
              <button className="retro-btn" style={{ fontSize: '8px' }} onClick={() => setCreating(false)}>CANCEL</button>
            </div>
          </div>
        ) : (
          <button className="retro-btn retro-btn-magenta" style={{ marginBottom: '16px', width: '100%', fontSize: '8px' }} onClick={() => setCreating(true)}>
            + NEW LIST
          </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="retro-btn" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}
