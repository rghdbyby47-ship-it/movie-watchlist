'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signup(email, nickname, password);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Signup failed.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="retro-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="panel-header panel-header-magenta">CREATE ACCOUNT</div>

        <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: 'var(--dim)', marginBottom: '28px', textAlign: 'center' }}>
          JOIN THE CINEPHILES
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--cyan)', display: 'block', marginBottom: '6px' }}>EMAIL:</label>
            <input className="retro-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@domain.com" required autoFocus />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--cyan)', display: 'block', marginBottom: '6px' }}>NICKNAME:</label>
            <input className="retro-input" type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="CinemaFan1984" required minLength={3} maxLength={24} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--cyan)', display: 'block', marginBottom: '6px' }}>PASSWORD:</label>
            <input className="retro-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="min. 6 characters" required minLength={6} />
          </div>

          {error && (
            <div style={{ fontFamily: '"VT323", monospace', fontSize: '22px', color: 'var(--red)', marginBottom: '18px', textShadow: '0 0 8px var(--red)' }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" className="retro-btn retro-btn-magenta" style={{ width: '100%', fontSize: '11px' }} disabled={loading}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontFamily: '"VT323", monospace', fontSize: '20px', color: 'var(--dim)' }}>
          HAVE AN ACCOUNT? <Link href="/login" style={{ color: 'var(--cyan)' }}>LOGIN HERE</Link>
        </div>
      </div>
    </div>
  );
}
