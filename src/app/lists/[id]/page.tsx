'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getListById, removeMovieFromList } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { MovieList } from '@/lib/types';
import { IMAGE_BASE } from '@/lib/tmdb';
import Link from 'next/link';

export default function ListDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [list, setList] = useState<MovieList | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = getListById(id as string);
    if (found) {
      setList(found);
      setIsOwner(user?.id === found.userId);
    }
  }, [id, user]);

  const handleRemove = (movieId: string) => {
    if (!list) return;
    removeMovieFromList(list.id, movieId);
    setList(getListById(list.id) || null);
  };

  if (!list) {
    return (
      <div
        style={{
          padding: '60px 24px',
          fontFamily: '"VT323", monospace',
          fontSize: '28px',
          color: 'var(--red)',
        }}
      >
        LIST NOT FOUND
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '15px',
            color: 'var(--magenta)',
            textShadow: '0 0 10px var(--magenta)',
            marginBottom: '10px',
            lineHeight: 1.8,
          }}
        >
          ♦ {list.name}
        </div>
        {list.description && (
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '22px',
              color: 'var(--white)',
              marginBottom: '8px',
            }}
          >
            {list.description}
          </div>
        )}
        <div
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: '20px',
            color: 'var(--dim)',
          }}
        >
          BY{' '}
          <Link
            href={`/profile/${list.userNickname}`}
            style={{ color: 'var(--cyan)' }}
          >
            {list.userNickname}
          </Link>{' '}
          • {list.movies.length} FILM{list.movies.length !== 1 ? 'S' : ''} •{' '}
          {new Date(list.createdAt).toLocaleDateString()}
        </div>
      </div>

      {list.movies.length === 0 ? (
        <div
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: '24px',
            color: 'var(--dim)',
            textAlign: 'center',
            padding: '80px 0',
          }}
        >
          NO FILMS IN THIS LIST YET.
          {isOwner && (
            <>
              {' '}
              <Link href="/search" style={{ color: 'var(--cyan)' }}>
                SEARCH FOR FILMS
              </Link>{' '}
              TO ADD SOME.
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {list.movies.map((movie) => (
            <div key={movie.movieId} style={{ position: 'relative', width: '150px' }}>
              <Link
                href={`/movie/${movie.movieId}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  className="retro-card"
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 0.08s, box-shadow 0.08s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--magenta)';
                    el.style.boxShadow = '4px 4px 0 var(--magenta)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--green)';
                    el.style.boxShadow = '4px 4px 0 var(--green)';
                  }}
                >
                  <div
                    style={{
                      height: '200px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                      border: '1px solid #222',
                    }}
                  >
                    {movie.posterPath ? (
                      <img
                        src={`${IMAGE_BASE}${movie.posterPath}`}
                        alt={movie.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--dim)',
                          fontFamily: '"Press Start 2P", monospace',
                          fontSize: '8px',
                          textAlign: 'center',
                          padding: '8px',
                        }}
                      >
                        NO POSTER
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: '"VT323", monospace',
                      fontSize: '15px',
                      color: 'var(--white)',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    } as React.CSSProperties}
                  >
                    {movie.title}
                  </div>
                  {movie.year && (
                    <div
                      style={{
                        fontFamily: '"VT323", monospace',
                        fontSize: '13px',
                        color: 'var(--dim)',
                        marginTop: '2px',
                      }}
                    >
                      {movie.year}
                    </div>
                  )}
                </div>
              </Link>

              {isOwner && (
                <button
                  className="retro-btn retro-btn-red"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    fontSize: '7px',
                    padding: '2px 6px',
                    background: 'rgba(8,8,8,0.85)',
                  }}
                  onClick={() => handleRemove(movie.movieId)}
                  title="Remove from list"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
