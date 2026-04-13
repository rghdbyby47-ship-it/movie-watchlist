'use client';

import { useEffect, useState } from 'react';
import { getPopularMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularMovies()
      .then((data) => setMovies(data.results || []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Hero ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '64px',
          padding: '48px 0 32px',
          borderBottom: '1px solid #1a1a1a',
        }}
      >
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '28px',
            color: 'var(--cyan)',
            textShadow: '0 0 24px var(--cyan), 0 0 48px rgba(0,229,255,0.3)',
            marginBottom: '20px',
            letterSpacing: '4px',
          }}
        >
          LETTERBOXD+
        </div>
        <div
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: '26px',
            color: 'var(--green)',
            marginBottom: '8px',
          }}
        >
          &gt; TRACK. RATE. DISCOVER. REPEAT.
          <span className="blink">_</span>
        </div>
        <div
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: '20px',
            color: 'var(--dim)',
            marginBottom: '36px',
          }}
        >
          // THE ULTIMATE MOVIE WATCHLIST APP //
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/search">
            <button className="retro-btn retro-btn-cyan" style={{ fontSize: '11px', padding: '14px 28px' }}>
              ► SEARCH FILMS
            </button>
          </Link>
          <Link href="/signup">
            <button className="retro-btn retro-btn-magenta" style={{ fontSize: '11px', padding: '14px 28px' }}>
              ► GET STARTED
            </button>
          </Link>
        </div>
      </div>

      {/* ── Features strip ── */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '56px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { icon: '🌲', label: 'RATE WITH TREES', desc: 'Score films 1–10 using our iconic tree rating system' },
          { icon: '📋', label: 'BUILD LISTS', desc: 'Curate and share themed movie collections' },
          { icon: '👤', label: 'YOUR PROFILE', desc: 'Showcase your top 4 films and recent activity' },
          { icon: '🔍', label: 'SEARCH TMDB', desc: 'Find any film from The Movie Database' },
        ].map((f) => (
          <div
            key={f.label}
            className="retro-card"
            style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                color: 'var(--yellow)',
                marginBottom: '8px',
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '18px',
                color: 'var(--dim)',
              }}
            >
              {f.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ── Popular Now ── */}
      <div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            color: 'var(--yellow)',
            marginBottom: '24px',
            textShadow: '0 0 10px var(--yellow)',
          }}
        >
          ★ POPULAR NOW
        </div>

        {loading ? (
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '28px',
              color: 'var(--green)',
            }}
          >
            LOADING<span className="blink">...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {movies.slice(0, 12).map((m: any) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                year={m.release_date?.slice(0, 4)}
                posterPath={m.poster_path}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
