'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getProfileByNickname, getUserWatchLogs, getUserLists } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import TreeRating from '@/components/TreeRating';
import { IMAGE_BASE } from '@/lib/tmdb';
import Link from 'next/link';

export default function ProfilePage() {
  const { username } = useParams();
  const { user, profile: myProfile, updateProfile } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [editingTop4, setEditingTop4] = useState(false);
  const [showPfpEdit, setShowPfpEdit] = useState(false);
  const [pfpUrl, setPfpUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!username) return;
    getProfileByNickname(username as string).then(async (found) => {
      if (!found) return;
      setProfile(found);
      setIsOwner(user?.id === found.id);
      const [logsData, listsData] = await Promise.all([
        getUserWatchLogs(found.id),
        getUserLists(found.id),
      ]);
      setLogs(logsData);
      setLists(listsData);
    });
  }, [username, user]);

  const handlePfpUrlSave = async () => {
    if (!pfpUrl.trim()) return;
    await updateProfile({ pfp: pfpUrl.trim() });
    setProfile((p: any) => ({ ...p, pfp: pfpUrl.trim() }));
    setPfpUrl('');
    setShowPfpEdit(false);
  };

  const handlePfpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await updateProfile({ pfp: base64 });
      setProfile((p: any) => ({ ...p, pfp: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddTopMovie = async (movieId: string) => {
    if (!profile) return;
    const topMovies = [...(profile.top_movies || [])];
    if (topMovies.includes(movieId) || topMovies.length >= 4) return;
    const updated = [...topMovies, movieId];
    await updateProfile({ top_movies: updated });
    setProfile((p: any) => ({ ...p, top_movies: updated }));
  };

  const handleRemoveTopMovie = async (movieId: string) => {
    if (!profile) return;
    const updated = (profile.top_movies || []).filter((id: string) => id !== movieId);
    await updateProfile({ top_movies: updated });
    setProfile((p: any) => ({ ...p, top_movies: updated }));
  };

  if (!profile) return (
    <div style={{ padding: '60px 24px', fontFamily: '"VT323", monospace', fontSize: '28px', color: 'var(--red)' }}>
      USER NOT FOUND
    </div>
  );

  const topIds: string[] = profile.top_movies || [];
  const topLogs = topIds.map((id: string) => logs.find((l: any) => l.movie_id === id)).filter(Boolean);
  const recentLogs = logs.slice(0, 10);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Profile header */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: '108px', height: '108px', border: '3px solid var(--cyan)', boxShadow: '0 0 20px rgba(0,229,255,0.4)', overflow: 'hidden', background: '#111' }}>
            {profile.pfp ? (
              <img src={profile.pfp} alt="pfp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Press Start 2P", monospace', fontSize: '36px', color: 'var(--cyan)' }}>
                {profile.nickname[0].toUpperCase()}
              </div>
            )}
          </div>
          {isOwner && (
            <button className="retro-btn" style={{ fontSize: '7px', padding: '4px 6px', marginTop: '6px', width: '108px' }} onClick={() => setShowPfpEdit(!showPfpEdit)}>
              EDIT PFP
            </button>
          )}
          {isOwner && showPfpEdit && (
            <div className="retro-card" style={{ position: 'absolute', top: '130px', left: 0, zIndex: 100, width: '260px' }}>
              <div className="panel-header">CHANGE PHOTO</div>
              <div style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--cyan)', marginBottom: '6px' }}>PASTE IMAGE URL:</div>
              <input className="retro-input" style={{ fontSize: '16px' }} value={pfpUrl} onChange={e => setPfpUrl(e.target.value)} placeholder="https://..." onKeyDown={e => e.key === 'Enter' && handlePfpUrlSave()} />
              <button className="retro-btn retro-btn-cyan" style={{ fontSize: '7px', marginTop: '6px', width: '100%' }} onClick={handlePfpUrlSave}>SAVE URL</button>
              <div style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--cyan)', margin: '10px 0 6px' }}>OR UPLOAD FILE:</div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePfpUpload} style={{ display: 'none' }} />
              <button className="retro-btn retro-btn-magenta" style={{ fontSize: '7px', width: '100%' }} onClick={() => fileInputRef.current?.click()}>UPLOAD IMAGE</button>
              <button className="retro-btn" style={{ fontSize: '7px', width: '100%', marginTop: '6px' }} onClick={() => setShowPfpEdit(false)}>CLOSE</button>
            </div>
          )}
        </div>

        <div>
          <h1 style={{ fontSize: '18px', marginBottom: '10px' }}>{profile.nickname}</h1>
          <div style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--dim)', marginBottom: '16px' }}>
            MEMBER SINCE {new Date(profile.created_at).getFullYear()}
          </div>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: '"VT323", monospace', fontSize: '24px' }}>
              <span style={{ color: 'var(--cyan)' }}>{logs.length}</span>
              <span style={{ color: 'var(--dim)' }}> FILMS</span>
            </span>
            <span style={{ fontFamily: '"VT323", monospace', fontSize: '24px' }}>
              <span style={{ color: 'var(--yellow)' }}>{lists.length}</span>
              <span style={{ color: 'var(--dim)' }}> LISTS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 */}
      <div style={{ marginBottom: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: 'var(--yellow)', textShadow: '0 0 10px var(--yellow)' }}>★ TOP 4 FILMS</div>
          {isOwner && (
            <button className="retro-btn retro-btn-yellow" style={{ fontSize: '7px', padding: '4px 8px' }} onClick={() => setEditingTop4(!editingTop4)}>
              {editingTop4 ? 'DONE' : 'EDIT'}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3].map(slot => {
            const logEntry = topLogs[slot];
            return (
              <div key={slot} style={{ width: '130px' }}>
                {logEntry ? (
                  <div>
                    <Link href={`/movie/${logEntry.movie_id}`}>
                      <div style={{ border: '2px solid var(--yellow)', overflow: 'hidden', height: '185px', background: '#111', cursor: 'pointer' }}>
                        {logEntry.movie_poster ? (
                          <img src={`${IMAGE_BASE}${logEntry.movie_poster}`} alt={logEntry.movie_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"VT323", monospace', fontSize: '14px', color: 'var(--dim)', textAlign: 'center', padding: '8px' }}>
                            {logEntry.movie_title}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div style={{ fontFamily: '"VT323", monospace', fontSize: '14px', color: 'var(--yellow)', marginTop: '4px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                      {logEntry.movie_title}
                    </div>
                    {editingTop4 && (
                      <button className="retro-btn retro-btn-red" style={{ fontSize: '7px', padding: '3px 6px', marginTop: '4px' }} onClick={() => handleRemoveTopMovie(logEntry.movie_id)}>REMOVE</button>
                    )}
                  </div>
                ) : (
                  <div style={{ border: '2px dashed var(--dim)', height: '185px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'var(--dim)', textAlign: 'center', padding: '8px' }}>
                    SLOT {slot + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {isOwner && editingTop4 && logs.length > 0 && (
          <div style={{ marginTop: '20px', border: '1px solid var(--dim)', padding: '12px', maxHeight: '200px', overflowY: 'auto' }}>
            <div style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--cyan)', marginBottom: '10px' }}>SELECT FROM YOUR LOGGED FILMS:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {logs.map((l: any) => {
                const inTop = topIds.includes(l.movie_id);
                return (
                  <button key={l.movie_id} className={`retro-btn ${inTop ? '' : 'retro-btn-yellow'}`} style={{ fontSize: '7px', padding: '4px 8px' }} disabled={inTop || topIds.length >= 4} onClick={() => handleAddTopMovie(l.movie_id)}>
                    {l.movie_title} {inTop ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '52px' }}>
        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: 'var(--cyan)', marginBottom: '20px' }}>► RECENT ACTIVITY</div>
        {recentLogs.length === 0 ? (
          <div style={{ fontFamily: '"VT323", monospace', fontSize: '24px', color: 'var(--dim)' }}>
            No films logged yet.{isOwner && <> <Link href="/search" style={{ color: 'var(--cyan)' }}>SEARCH FOR FILMS</Link></>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLogs.map((l: any) => (
              <Link key={l.id} href={`/movie/${l.movie_id}`} style={{ textDecoration: 'none' }}>
                <div className="retro-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--cyan)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--green)'}
                >
                  {l.movie_poster && <img src={`${IMAGE_BASE}${l.movie_poster}`} alt={l.movie_title} style={{ width: '44px', height: '64px', objectFit: 'cover', flexShrink: 0, border: '1px solid #222' }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: 'var(--white)', marginBottom: '8px', lineHeight: 1.8 }}>
                      {l.movie_title}{l.movie_year ? ` (${l.movie_year})` : ''}
                    </div>
                    <TreeRating rating={l.user_rating} readonly size="sm" />
                    {l.review && (
                      <div style={{ marginTop: '8px', fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--dim)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                        {l.review}
                      </div>
                    )}
                    <div style={{ fontFamily: '"VT323", monospace', fontSize: '14px', color: 'var(--dim)', marginTop: '6px' }}>
                      {new Date(l.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Lists */}
      {lists.length > 0 && (
        <div>
          <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px', color: 'var(--magenta)', marginBottom: '20px' }}>♦ PUBLIC LISTS</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {lists.map((list: any) => (
              <Link key={list.id} href={`/lists/${list.id}`} style={{ textDecoration: 'none' }}>
                <div className="retro-card" style={{ width: '220px', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--magenta)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--green)'}
                >
                  <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: 'var(--magenta)', marginBottom: '8px', lineHeight: 1.8 }}>{list.name}</div>
                  <div style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--dim)' }}>{list.list_movies?.length || 0} FILMS</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
