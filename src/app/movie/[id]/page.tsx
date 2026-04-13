'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getMovieById,
  getSimilarMovies,
  IMAGE_BASE,
  BACKDROP_BASE,
} from '@/lib/tmdb';
import { useAuth } from '@/context/AuthContext';
import {
  getWatchLogForMovie,
  addOrUpdateWatchLog,
} from '@/lib/storage';
import TreeRating from '@/components/TreeRating';
import ReviewModal from '@/components/ReviewModal';
import AddToListModal from '@/components/AddToListModal';
import MovieCard from '@/components/MovieCard';
import { WatchLog } from '@/lib/types';
import Link from 'next/link';

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<WatchLog | undefined>(undefined);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getMovieById(id as string),
      getSimilarMovies(id as string),
    ])
      .then(([movieData, similarData]) => {
        setMovie(movieData);
        setSimilar(similarData.results?.slice(0, 6) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    if (user) {
      setLog(getWatchLogForMovie(user.id, id as string));
    }
  }, [id, user]);

  const handleSaveLog = (rating: number, review: string) => {
    if (!user || !movie) return;
    const saved = addOrUpdateWatchLog({
      userId: user.id,
      movieId: movie.id.toString(),
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      movieYear: movie.release_date
        ? parseInt(movie.release_date.slice(0, 4))
        : undefined,
      userRating: rating,
      review,
    });
    setLog(saved);
    setShowReviewModal(false);
    // Suggest writing a review if they didn't write one
    if (!review && !log?.review) {
      setShowReviewPrompt(true);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '60px 24px',
          fontFamily: '"VT323", monospace',
          fontSize: '28px',
          color: 'var(--green)',
        }}
      >
        LOADING FILM DATA<span className="blink">...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          padding: '60px 24px',
          fontFamily: '"VT323", monospace',
          fontSize: '28px',
          color: 'var(--red)',
        }}
      >
        FILM NOT FOUND
      </div>
    );
  }

  const year = movie.release_date?.slice(0, 4);
  const genres = movie.genres?.map((g: any) => g.name).join(', ');

  return (
    <div>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div
          style={{
            position: 'relative',
            height: '320px',
            overflow: 'hidden',
            marginBottom: '-80px',
          }}
        >
          <img
            src={`${BACKDROP_BASE}${movie.backdrop_path}`}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(8,8,8,0.2), rgba(8,8,8,1))',
            }}
          />
        </div>
      )}

      <div
        style={{
          padding: '40px 24px',
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}
        >
          {/* Poster */}
          {movie.poster_path && (
            <div style={{ flexShrink: 0 }}>
              <img
                src={`${IMAGE_BASE}${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: '200px',
                  border: '3px solid var(--cyan)',
                  boxShadow: '0 0 24px rgba(0,229,255,0.4)',
                  display: 'block',
                }}
              />
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h1 style={{ fontSize: '16px', marginBottom: '12px' }}>
              {movie.title}
            </h1>

            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '22px',
                color: 'var(--yellow)',
                marginBottom: '8px',
              }}
            >
              {[year, genres, movie.runtime ? `${movie.runtime} MIN` : null]
                .filter(Boolean)
                .join(' • ')}
            </div>

            {movie.tagline && (
              <div
                style={{
                  fontFamily: '"VT323", monospace',
                  fontSize: '22px',
                  color: 'var(--magenta)',
                  marginBottom: '16px',
                  fontStyle: 'italic',
                }}
              >
                "{movie.tagline}"
              </div>
            )}

            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '20px',
                color: 'var(--white)',
                lineHeight: 1.7,
                marginBottom: '24px',
              }}
            >
              {movie.overview}
            </div>

            {/* User log section */}
            {user ? (
              <div className="retro-card retro-card-cyan" style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '8px',
                    color: 'var(--cyan)',
                    marginBottom: '14px',
                  }}
                >
                  YOUR LOG
                </div>

                {log ? (
                  <>
                    <TreeRating rating={log.userRating} readonly size="md" />
                    {log.review && (
                      <div
                        style={{
                          marginTop: '14px',
                          fontFamily: '"VT323", monospace',
                          fontSize: '20px',
                          color: 'var(--white)',
                          borderLeft: '3px solid var(--green)',
                          paddingLeft: '12px',
                          lineHeight: 1.6,
                        }}
                      >
                        {log.review}
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '14px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        className="retro-btn retro-btn-cyan"
                        style={{ fontSize: '8px' }}
                        onClick={() => setShowReviewModal(true)}
                      >
                        EDIT LOG
                      </button>
                      <button
                        className="retro-btn retro-btn-magenta"
                        style={{ fontSize: '8px' }}
                        onClick={() => setShowListModal(true)}
                      >
                        ADD TO LIST
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      className="retro-btn retro-btn-cyan"
                      style={{ fontSize: '8px' }}
                      onClick={() => setShowReviewModal(true)}
                    >
                      ► LOG THIS FILM
                    </button>
                    <button
                      className="retro-btn retro-btn-magenta"
                      style={{ fontSize: '8px' }}
                      onClick={() => setShowListModal(true)}
                    >
                      ADD TO LIST
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: '"VT323", monospace',
                  fontSize: '22px',
                  color: 'var(--dim)',
                }}
              >
                <Link href="/login">LOGIN</Link> to log &amp; rate this film
              </div>
            )}
          </div>
        </div>

        {/* Review prompt */}
        {showReviewPrompt && (
          <div
            className="retro-card"
            style={{
              marginBottom: '36px',
              borderColor: 'var(--yellow)',
              boxShadow: '4px 4px 0 var(--yellow)',
            }}
          >
            <div className="panel-header panel-header-yellow">
              WANT TO WRITE A REVIEW?
            </div>
            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '22px',
                color: 'var(--green)',
                marginBottom: '14px',
              }}
            >
              You rated this film. Share your thoughts with the world!
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="retro-btn retro-btn-yellow"
                style={{ fontSize: '8px' }}
                onClick={() => {
                  setShowReviewModal(true);
                  setShowReviewPrompt(false);
                }}
              >
                WRITE REVIEW
              </button>
              <button
                className="retro-btn"
                style={{ fontSize: '8px' }}
                onClick={() => setShowReviewPrompt(false)}
              >
                SKIP
              </button>
            </div>
          </div>
        )}

        {/* Similar films */}
        {similar.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '11px',
                color: 'var(--yellow)',
                marginBottom: '20px',
              }}
            >
              ► YOU MIGHT ALSO LIKE
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {similar.map((m) => (
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  year={m.release_date?.slice(0, 4)}
                  posterPath={m.poster_path}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showReviewModal && (
        <ReviewModal
          movieTitle={movie.title}
          initialRating={log?.userRating || 0}
          initialReview={log?.review || ''}
          onSave={handleSaveLog}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showListModal && user && (
        <AddToListModal
          movie={{
            id: movie.id.toString(),
            title: movie.title,
            posterPath: movie.poster_path,
            year: year ? parseInt(year) : undefined,
          }}
          onClose={() => setShowListModal(false)}
        />
      )}
    </div>
  );
}
