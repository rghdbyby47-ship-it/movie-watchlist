'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav
      style={{
        borderBottom: '2px solid var(--green)',
        background: '#030303',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 500,
        boxShadow: '0 2px 20px rgba(0,255,65,0.15)',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '13px',
          color: 'var(--cyan)',
          textShadow: '0 0 12px var(--cyan)',
          letterSpacing: '2px',
        }}
      >
        ▶ LBX+
      </Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/search"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '8px',
            color: 'var(--green)',
          }}
        >
          [SEARCH]
        </Link>

        {user ? (
          <>
            <Link
              href={`/profile/${user.nickname}`}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                color: 'var(--green)',
              }}
            >
              [PROFILE]
            </Link>
            <Link
              href="/lists"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                color: 'var(--green)',
              }}
            >
              [LISTS]
            </Link>
            <span
              style={{
                fontFamily: '"VT323", monospace',
                fontSize: '16px',
                color: 'var(--dim)',
              }}
            >
              {user.nickname}
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                background: 'none',
                border: 'none',
                color: 'var(--magenta)',
                cursor: 'pointer',
              }}
            >
              [LOGOUT]
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                color: 'var(--green)',
              }}
            >
              [LOGIN]
            </Link>
            <Link
              href="/signup"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '8px',
                color: 'var(--yellow)',
              }}
            >
              [SIGN UP]
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
