'use client';

import { useState, useEffect } from 'react';
import { searchMovies, getPopularMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { useAuth } from '@/context/AuthContext';
import { getWatchLogForMovie } from '@/lib/storage';

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [popular, setPopular] = useState<any[]>([]);

  useEffect(() => {
    getPopularMovies()
      .then((data) => setPopular(data.results?.slice(0, 12) || []))
      .catch(() => {});
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchMovies(query);
      setMovies(data.results || []);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const displayMovies = searched ? movies : popular;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '13px',
          color: 'var(--cyan)',
          marginBottom: '32px',
        }}
      >
        ► SEARCH FILMS
      </div>

      <form
        onSubmit={handleSearch}
        style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}
      >
        <input
          className="retro-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for any movie..."
          style={{ flex: 1, fontSize: '22px' }}
          autoFocus
        />
        <button
          type="submit"
          className="retro-btn retro-btn-cyan"
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          SEARCH
        </button>
        {searched && (
          <button
            type="button"
            className="retro-btn"
            onClick={() => {
              setSearched(false);
              setQuery('');
              setMovies([]);
            }}
          >
            CLEAR
          </button>
        )}
      </form>

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '10px',
          color: 'var(--yellow)',
          marginBottom: '20px',
        }}
      >
        {searched ? `RESULTS FOR "${query}"` : '★ POPULAR FILMS'}
      </div>

      {loading ? (
        <div
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: '28px',
            color: 'var(--green)',
          }}
        >
          SEARCHING<span className="blink">...</span>
        </div>
      ) : displayMovies.length === 0 && searched ? (
        <div
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: '24px',
            color: 'var(--dim)',
          }}
        >
          NO RESULTS FOUND. TRY A DIFFERENT TITLE.
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {displayMovies.map((m: any) => {
            const log = user
              ? getWatchLogForMovie(user.id, m.id.toString())
              : undefined;
            return (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                year={m.release_date?.slice(0, 4)}
                posterPath={m.poster_path}
                rating={log?.userRating}
                showRating={!!log}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
