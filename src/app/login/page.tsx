'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (ok) {
      router.push('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div className="retro-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="panel-header panel-header-cyan">USER LOGIN</div>

        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '9px',
            color: 'var(--dim)',
            marginBottom: '28px',
            textAlign: 'center',
          }}
        >
          ENTER YOUR CREDENTIALS
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '20px',
                color: 'var(--cyan)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              EMAIL:
            </label>
            <input
              className="retro-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '20px',
                color: 'var(--cyan)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              PASSWORD:
            </label>
            <input
              className="retro-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '22px',
                color: 'var(--red)',
                marginBottom: '18px',
                textShadow: '0 0 8px var(--red)',
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="retro-btn retro-btn-cyan"
            style={{ width: '100%', fontSize: '11px' }}
          >
            LOGIN
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontFamily: '"VT323", monospace',
            fontSize: '20px',
            color: 'var(--dim)',
          }}
        >
          NEW USER?{' '}
          <Link href="/signup" style={{ color: 'var(--yellow)' }}>
            REGISTER HERE
          </Link>
        </div>
      </div>
    </div>
  );
}
