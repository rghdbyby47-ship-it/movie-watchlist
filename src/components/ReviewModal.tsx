'use client';

import { useState } from 'react';
import TreeRating from './TreeRating';

interface ReviewModalProps {
  movieTitle: string;
  initialRating?: number;
  initialReview?: string;
  onSave: (rating: number, review: string) => void;
  onClose: () => void;
}

export default function ReviewModal({
  movieTitle,
  initialRating = 0,
  initialReview = '',
  onSave,
  onClose,
}: ReviewModalProps) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);

  return (
    <div className="modal-overlay">
      <div
        className="retro-card"
        style={{ maxWidth: '520px', width: '100%' }}
      >
        <div className="panel-header panel-header-cyan">LOG FILM</div>

        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: 'var(--yellow)',
            marginBottom: '24px',
            lineHeight: 1.8,
          }}
        >
          {movieTitle}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '20px',
              color: 'var(--cyan)',
              marginBottom: '10px',
            }}
          >
            YOUR RATING:
          </div>
          <TreeRating rating={rating} onChange={setRating} size="lg" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '20px',
              color: 'var(--cyan)',
              marginBottom: '10px',
            }}
          >
            YOUR REVIEW <span style={{ color: 'var(--dim)' }}>(OPTIONAL):</span>
          </div>
          <textarea
            className="retro-input"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            placeholder="Write your thoughts about this film..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="retro-btn" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="retro-btn retro-btn-cyan"
            onClick={() => {
              if (rating === 0) {
                alert('Please select a rating first!');
                return;
              }
              onSave(rating, review);
            }}
          >
            SAVE LOG
          </button>
        </div>
      </div>
    </div>
  );
}
