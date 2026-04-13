'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserLists, deleteList, createList } from '@/lib/storage';
import { MovieList } from '@/lib/types';
import CreateListModal from '@/components/CreateListModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ListsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState<MovieList[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLists(getUserLists(user.id));
  }, [user, router]);

  const handleCreate = (name: string, description: string) => {
    if (!user) return;
    createList(user.id, user.nickname, name, description);
    setLists(getUserLists(user.id));
    setShowCreate(false);
  };

  const handleDelete = (listId: string) => {
    if (!confirm('Delete this list? This cannot be undone.')) return;
    deleteList(listId);
    setLists(getUserLists(user!.id));
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '13px',
            color: 'var(--magenta)',
            textShadow: '0 0 10px var(--magenta)',
          }}
        >
          ♦ MY LISTS
        </div>
        <button
          className="retro-btn retro-btn-magenta"
          style={{ fontSize: '9px' }}
          onClick={() => setShowCreate(true)}
        >
          + CREATE LIST
        </button>
      </div>

      {lists.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 0',
          }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '10px',
              color: 'var(--dim)',
              marginBottom: '20px',
            }}
          >
            NO LISTS YET
          </div>
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '22px',
              color: 'var(--dim)',
              marginBottom: '24px',
            }}
          >
            Create your first list to organize your films!
          </div>
          <button
            className="retro-btn retro-btn-magenta"
            style={{ fontSize: '10px' }}
            onClick={() => setShowCreate(true)}
          >
            CREATE FIRST LIST
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {lists.map((list) => (
            <div
              key={list.id}
              className="retro-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Link
                href={`/lists/${list.id}`}
                style={{ textDecoration: 'none', flex: 1 }}
              >
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '9px',
                    color: 'var(--magenta)',
                    marginBottom: '6px',
                    lineHeight: 1.8,
                  }}
                >
                  {list.name}
                </div>
                {list.description && (
                  <div
                    style={{
                      fontFamily: '"VT323", monospace',
                      fontSize: '18px',
                      color: 'var(--white)',
                      marginBottom: '6px',
                    }}
                  >
                    {list.description}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: '"VT323", monospace',
                    fontSize: '18px',
                    color: 'var(--dim)',
                  }}
                >
                  {list.movies.length} FILM{list.movies.length !== 1 ? 'S' : ''}{' '}
                  • {new Date(list.createdAt).toLocaleDateString()}
                </div>
              </Link>
              <button
                className="retro-btn retro-btn-red"
                style={{ fontSize: '7px', padding: '5px 10px', flexShrink: 0 }}
                onClick={() => handleDelete(list.id)}
              >
                DELETE
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateListModal
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
