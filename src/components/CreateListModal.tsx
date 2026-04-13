'use client';

import { useState } from 'react';

interface CreateListModalProps {
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

export default function CreateListModal({ onSave, onClose }: CreateListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="modal-overlay">
      <div className="retro-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="panel-header panel-header-magenta">CREATE NEW LIST</div>

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
            LIST NAME:
          </label>
          <input
            className="retro-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Best Sci-Fi of the 80s"
            autoFocus
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              fontFamily: '"VT323", monospace',
              fontSize: '20px',
              color: 'var(--cyan)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            DESCRIPTION <span style={{ color: 'var(--dim)' }}>(OPTIONAL):</span>
          </label>
          <textarea
            className="retro-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="A collection of..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="retro-btn" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="retro-btn retro-btn-magenta"
            onClick={() => {
              if (!name.trim()) {
                alert('List name is required!');
                return;
              }
              onSave(name.trim(), description.trim());
            }}
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
}
