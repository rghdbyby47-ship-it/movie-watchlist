'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getListById, removeMovieFromList } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { IMAGE_BASE } from '@/lib/tmdb';
import Link from 'next/link';

export default function ListDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [list, setList] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id) return;
    getListById(id as string).then(data => {
      if (data) {
        setList(data);
        setIsOwner(user?.id === data.user_id);
      }
    });
  }, [id, user]);

  const handleRemove = async (movieId: string) => {
    if (!list) return;
    await removeMovieFromList(list.id, movieId);
    setList((prev: any) => ({ ...prev, list_movies: prev.list_movies.filter((m: any) => m.movie_id !== movieId) }));
  };

  if (!list) return (
    <div style={{ padding: '60px 24px', fontFamily: '"VT323", monospace', fontSize: '28px', color: 'var(--red)' }}>
      LIST NOT FOUND
    </div>
  );

  const movies = list.list_movies || [];

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '15px', color: 'var(--magenta)', textShadow: '0 0 10px var(--magenta)', marginBottom: '10px', lineHeight: 1.8 }}>
          ♦ {list.name}
        </div>
        {list.description && <div style={{ fontFamily: '"VT323", monospace', fontSize: '22px', color: 'var(--white)', marginBottom: '8px' }}>{list.description}</div>}
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--dim)' }}>
          BY <Link href={`/profile/${list.user_nickname}`} style={{ color: 'var(--cyan)' }}>{list.user_nickname}</Link>
          {' '}• {movies.length} FILM{movies.length !== 1 ? 'S' : ''} • {new Date(list.created_at).toLocaleDateString()}
        </div>
      </div>

      {movies.length === 0 ? (
        <div style={{ fontFamily: '"VT323", monospace', fontSize: '24px', color: 'var(--dim)', textAlign: 'center', padding: '80px 0' }}>
          NO FILMS IN THIS LIST YET.
          {isOwner && <> <Link href="/search" style={{ color: 'var(--cyan)' }}>SEARCH FOR FILMS</Link> TO ADD SOME.</>}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {movies.map((movie: any) => (
            <div key={movie.movie_id} style={{ position: 'relative', width: '150px' }}>
              <Link href={`/movie/${movie.movie_id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="retro-card" style={{ padding: '8px', cursor: 'pointer' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--magenta)'; el.style.boxShadow = '4px 4px 0 var(--magenta)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'var(--green)'; el.style.boxShadow = '4px 4px 0 var(--green)'; }}
                >
                  <div style={{ height: '200px', overflow: 'hidden', marginBottom: '8px', border: '1px solid #222' }}>
                    {movie.poster_path ? (
                      <img src={`${IMAGE_BASE}${movie.poster_path}`} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)', fontFamily: '"Press Start 2P", monospace', fontSize: '8px', textAlign: 'center', padding: '8px' }}>NO POSTER</div>
                    )}
                  </div>
                  <div style={{ fontFamily: '"VT323", monospace', fontSize: '15px', color: 'var(--white)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                    {movie.title}
                  </div>
                  {movie.year && <div style={{ fontFamily: '"VT323", monospace', fontSize: '13px', color: 'var(--dim)', marginTop: '2px' }}>{movie.year}</div>}
                </div>
              </Link>
              {isOwner && (
                <button className="retro-btn retro-btn-red" style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '7px', padding: '2px 6px', background: 'rgba(8,8,8,0.85)' }} onClick={() => handleRemove(movie.movie_id)}>✕</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
