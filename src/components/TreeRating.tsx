'use client';

interface TreeRatingProps {
  rating: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = { sm: '18px', md: '24px', lg: '34px' };
const LABEL_SIZE = { sm: '16px', md: '20px', lg: '26px' };

export default function TreeRating({
  rating,
  maxRating = 10,
  onChange,
  readonly = false,
  size = 'md',
}: TreeRatingProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1px', flexWrap: 'wrap' }}>
      {Array.from({ length: maxRating }, (_, i) => {
        const val = i + 1;
        const filled = val <= rating;
        return (
          <span
            key={i}
            onClick={() => !readonly && onChange?.(val)}
            title={readonly ? `${rating}/10` : `Rate ${val}/10`}
            style={{
              fontSize: SIZE_MAP[size],
              cursor: readonly ? 'default' : 'pointer',
              opacity: filled ? 1 : 0.15,
              filter: filled
                ? 'drop-shadow(0 0 5px #00ff41) drop-shadow(0 0 2px #00ff41)'
                : 'grayscale(1)',
              transition: 'opacity 0.08s, filter 0.08s',
              userSelect: 'none',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              if (!readonly && onChange) {
                // highlight up to hovered
                const parent = (e.currentTarget as HTMLElement).parentElement;
                if (!parent) return;
                Array.from(parent.children).forEach((child, idx) => {
                  (child as HTMLElement).style.opacity = idx < val ? '1' : '0.15';
                });
              }
            }}
            onMouseLeave={(e) => {
              if (!readonly && onChange) {
                const parent = (e.currentTarget as HTMLElement).parentElement;
                if (!parent) return;
                Array.from(parent.children).forEach((child, idx) => {
                  const span = child as HTMLElement;
                  if (span.tagName === 'SPAN') {
                    span.style.opacity = idx < rating ? '1' : '0.15';
                  }
                });
              }
            }}
          >
            🌲
          </span>
        );
      })}
      {rating > 0 && (
        <span
          style={{
            fontFamily: '"VT323", monospace',
            fontSize: LABEL_SIZE[size],
            color: 'var(--green)',
            marginLeft: '8px',
            textShadow: '0 0 6px var(--green)',
          }}
        >
          {rating}/10
        </span>
      )}
    </div>
  );
}
