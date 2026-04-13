'use client';

import Link from 'next/link';
import { IMAGE_BASE } from '@/lib/tmdb';
import TreeRating from './TreeRating';

interface MovieCardProps {
  id: number | string;
  title: string;
  year?: string | number;
  posterPath?: string | null;
  rating?: number;
  showRating?: boolean;
}

export default function MovieCard({
  id,
  title,
  year,
  posterPath,
  rating,
  showRating = false,
}: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        className="retro-card"
        style={{ width: '150px', cursor: 'pointer', padding: '8px', transition: 'border-color 0.08s, box-shadow 0.08s' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--cyan)';
          el.style.boxShadow = '4px 4px 0 var(--cyan)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--green)';
          el.style.boxShadow = '4px 4px 0 var(--green)';
        }}
      >
        <div
          style={{
            width: '100%',
            height: '205px',
            background: '#111',
            overflow: 'hidden',
            marginBottom: '8px',
            border: '1px solid #222',
          }}
        >
          {posterPath ? (
            <img
              src={`${IMAGE_BASE}${posterPath}`}
              alt={title}
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
            fontSize: '16px',
            color: 'var(--white)',
            lineHeight: '1.3',
            marginBottom: '3px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}
        >
          {title}
        </div>

        {year && (
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '14px',
              color: 'var(--dim)',
            }}
          >
            {year}
          </div>
        )}

        {showRating && rating !== undefined && rating > 0 && (
          <div style={{ marginTop: '6px' }}>
            <TreeRating rating={rating} readonly size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
}
