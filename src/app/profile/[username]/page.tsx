'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  getUserByNickname,
  getUserWatchLogs,
  getUserLists,
  updateUser,
} from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { User, WatchLog, MovieList } from '@/lib/types';
import TreeRating from '@/components/TreeRating';
import { IMAGE_BASE } from '@/lib/tmdb';
import Link from 'next/link';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, updateUser: updateAuthUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [logs, setLogs] = useState<WatchLog[]>([]);
  const [lists, setLists] = useState<MovieList[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [editingTop4, setEditingTop4] = useState(false);
  const [showPfpEdit, setShowPfpEdit] = useState(false);
  const [pfpUrl, setPfpUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!username) return;
    const found = getUserByNickname(username as string);
    if (found) {
      setProfile(found);
      setLogs(getUserWatchLogs(found.id));
      setLists(getUserLists(found.id));
      setIsOwner(currentUser?.id === found.id);
    }
  }, [username, currentUser]);

  const saveProfile = (updated: User) => {
    updateUser(updated);
    if (isOwner) updateAuthUser(updated);
    setProfile(updated);
  };

  const handlePfpUrlSave = () => {
    if (!profile || !pfpUrl.trim()) return;
    saveProfile({ ...profile, pfp: pfpUrl.trim() });
    setPfpUrl('');
    setShowPfpEdit(false);
  };

  const handlePfpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const reader = new FileReader();
    reader.onload = () => {
      saveProfile({ ...profile, pfp: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAddTopMovie = (movieId: string) => {
    if (!profile) return;
    const topMovies = [...(profile.topMovies || [])];
    if (topMovies.includes(movieId) || topMovies.length >= 4) return;
    saveProfile({ ...profile, topMovies: [...topMovies, movieId] });
  };

  const handleRemoveTopMovie = (movieId: string) => {
    if (!profile) return;
    saveProfile({
      ...profile,
      topMovies: (profile.topMovies || []).filter((id) => id !== movieId),
    });
  };

  if (!profile) {
    return (
      <div
        style={{
          padding: '60px 24px',
          fontFamily: '"VT323", monospace',
          fontSize: '28px',
          color: 'var(--red)',
        }}
      >
        USER NOT FOUND
      </div>
    );
  }

  const topIds = profile.topMovies || [];
  const topLogs = topIds
    .map((id) => logs.find((l) => l.movieId === id))
    .filter(Boolean) as WatchLog[];
  const recentLogs = logs.slice(0, 10);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* ── Profile header ── */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          marginBottom: '48px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: '108px',
              height: '108px',
              border: '3px solid var(--cyan)',
              boxShadow: '0 0 20px rgba(0,229,255,0.4)',
              overflow: 'hidden',
              background: '#111',
            }}
          >
            {profile.pfp ? (
              <img
                src={profile.pfp}
                alt="pfp"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '36px',
                  color: 'var(--cyan)',
                }}
              >
                {profile.nickname[0].toUpperCase()}
              </div>
            )}
          </div>

          {isOwner && (
            <button
              className="retro-btn"
              style={{
                fontSize: '7px',
                padding: '4px 6px',
                marginTop: '6px',
                width: '108px',
              }}
              onClick={() => setShowPfpEdit(!showPfpEdit)}
            >
              EDIT PFP
            </button>
          )}

          {isOwner && showPfpEdit && (
            <div
              className="retro-card"
              style={{
                position: 'absolute',
                top: '130px',
                left: 0,
                zIndex: 100,
                width: '260px',
              }}
            >
              <div className="panel-header">CHANGE PHOTO</div>
              <div
                style={{
                  fontFamily: '"VT323", monospace',
                  fontSize: '18px',
                  color: 'var(--cyan)',
                  marginBottom: '6px',
                }}
              >
                PASTE IMAGE URL:
              </div>
              <input
                className="retro-input"
                style={{ fontSize: '16px' }}
                value={pfpUrl}
                onChange={(e) => setPfpUrl(e.target.value)}
                placeholder="https://..."
                onKeyDown={(e) => e.key === 'Enter' && handlePfpUrlSave()}
              />
              <button
                className="retro-btn retro-btn-cyan"
                style={{ fontSize: '7px', marginTop: '6px', width: '100%' }}
                onClick={handlePfpUrlSave}
              >
                SAVE URL
              </button>

              <div
                style={{
                  fontFamily: '"VT323", monospace',
                  fontSize: '18px',
                  color: 'var(--cyan)',
                  margin: '10px 0 6px',
                }}
              >
                OR UPLOAD FILE:
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePfpUpload}
                style={{ display: 'none' }}
              />
              <button
                className="retro-btn retro-btn-magenta"
                style={{ fontSize: '7px', width: '100%' }}
                onClick={() => fileInputRef.current?.click()}
              >
                UPLOAD IMAGE
              </button>
              <button
                className="retro-btn"
                style={{ fontSize: '7px', width: '100%', marginTop: '6px' }}
                onClick={() => setShowPfpEdit(false)}
              >
                CLOSE
              </button>
            </div>
          )}
        </div>

        {/* User info */}
        <div>
          <h1 style={{ fontSize: '18px', marginBottom: '10px' }}>
            {profile.nickname}
          </h1>
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '20px',
              color: 'var(--dim)',
              marginBottom: '16px',
            }}
          >
            MEMBER SINCE {new Date(profile.createdAt).getFullYear()}
          </div>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '24px',
              }}
            >
              <span style={{ color: 'var(--cyan)' }}>{logs.length}</span>
              <span style={{ color: 'var(--dim)' }}> FILMS</span>
            </span>
            <span
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '24px',
              }}
            >
              <span style={{ color: 'var(--yellow)' }}>{lists.length}</span>
              <span style={{ color: 'var(--dim)' }}> LISTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Top 4 Films ── */}
      <div style={{ marginBottom: '52px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '10px',
              color: 'var(--yellow)',
              textShadow: '0 0 10px var(--yellow)',
            }}
          >
            ★ TOP 4 FILMS
          </div>
          {isOwner && (
            <button
              className="retro-btn retro-btn-yellow"
              style={{ fontSize: '7px', padding: '4px 8px' }}
              onClick={() => setEditingTop4(!editingTop4)}
            >
              {editingTop4 ? 'DONE' : 'EDIT'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3].map((slot) => {
            const logEntry = topLogs[slot];
            return (
              <div key={slot} style={{ width: '130px' }}>
                {logEntry ? (
                  <div>
                    <Link href={`/movie/${logEntry.movieId}`}>
                      <div
                        style={{
                          border: '2px solid var(--yellow)',
                          overflow: 'hidden',
                          height: '185px',
                          background: '#111',
                          cursor: 'pointer',
                        }}
                      >
                        {logEntry.moviePoster ? (
                          <img
                            src={`${IMAGE_BASE}${logEntry.moviePoster}`}
                            alt={logEntry.movieTitle}
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
                              fontFamily: '"VT323", monospace',
                              fontSize: '14px',
                              color: 'var(--dim)',
                              textAlign: 'center',
                              padding: '8px',
                            }}
                          >
                            {logEntry.movieTitle}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div
                      style={{
                        fontFamily: '"VT323", monospace',
                        fontSize: '14px',
                        color: 'var(--yellow)',
                        marginTop: '4px',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      } as React.CSSProperties}
                    >
                      {logEntry.movieTitle}
                    </div>
                    {editingTop4 && (
                      <button
                        className="retro-btn retro-btn-red"
                        style={{
                          fontSize: '7px',
                          padding: '3px 6px',
                          marginTop: '4px',
                        }}
                        onClick={() => handleRemoveTopMovie(logEntry.movieId)}
                      >
                        REMOVE
                      </button>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      border: '2px dashed var(--dim)',
                      height: '185px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '7px',
                      color: 'var(--dim)',
                      textAlign: 'center',
                      padding: '8px',
                    }}
                  >
                    SLOT {slot + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pick from logged films */}
        {isOwner && editingTop4 && logs.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              border: '1px solid var(--dim)',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '18px',
                color: 'var(--cyan)',
                marginBottom: '10px',
              }}
            >
              SELECT FROM YOUR LOGGED FILMS:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {logs.map((l) => {
                const inTop = topIds.includes(l.movieId);
                return (
                  <button
                    key={l.movieId}
                    className={`retro-btn ${inTop ? '' : 'retro-btn-yellow'}`}
                    style={{ fontSize: '7px', padding: '4px 8px' }}
                    disabled={inTop || topIds.length >= 4}
                    onClick={() => handleAddTopMovie(l.movieId)}
                  >
                    {l.movieTitle} {inTop ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Recent Activity ── */}
      <div style={{ marginBottom: '52px' }}>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: 'var(--cyan)',
            marginBottom: '20px',
          }}
        >
          ► RECENT ACTIVITY
        </div>

        {recentLogs.length === 0 ? (
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '24px',
              color: 'var(--dim)',
            }}
          >
            No films logged yet.{' '}
            {isOwner && (
              <Link href="/search" style={{ color: 'var(--cyan)' }}>
                SEARCH FOR FILMS
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLogs.map((l) => (
              <Link
                key={l.id}
                href={`/movie/${l.movieId}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="retro-card"
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    transition: 'border-color 0.08s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor =
                      'var(--cyan)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor =
                      'var(--green)')
                  }
                >
                  {l.moviePoster && (
                    <img
                      src={`${IMAGE_BASE}${l.moviePoster}`}
                      alt={l.movieTitle}
                      style={{
                        width: '44px',
                        height: '64px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: '1px solid #222',
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: '8px',
                        color: 'var(--white)',
                        marginBottom: '8px',
                        lineHeight: 1.8,
                      }}
                    >
                      {l.movieTitle}
                      {l.movieYear ? ` (${l.movieYear})` : ''}
                    </div>
                    <TreeRating rating={l.userRating} readonly size="sm" />
                    {l.review && (
                      <div
                        style={{
                          marginTop: '8px',
                          fontFamily: '"VT323", monospace',
                          fontSize: '18px',
                          color: 'var(--dim)',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        } as React.CSSProperties}
                      >
                        {l.review}
                      </div>
                    )}
                    <div
                      style={{
                        fontFamily: '"VT323", monospace',
                        fontSize: '14px',
                        color: 'var(--dim)',
                        marginTop: '6px',
                      }}
                    >
                      {new Date(l.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Public Lists ── */}
      {lists.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '10px',
              color: 'var(--magenta)',
              marginBottom: '20px',
            }}
          >
            ♦ PUBLIC LISTS
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="retro-card"
                  style={{ width: '220px', cursor: 'pointer' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor =
                      'var(--magenta)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor =
                      'var(--green)')
                  }
                >
                  <div
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '8px',
                      color: 'var(--magenta)',
                      marginBottom: '8px',
                      lineHeight: 1.8,
                    }}
                  >
                    {list.name}
                  </div>
                  <div
                    style={{
                      fontFamily: '"VT323", monospace',
                      fontSize: '18px',
                      color: 'var(--dim)',
                    }}
                  >
                    {list.movies.length} FILMS
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
