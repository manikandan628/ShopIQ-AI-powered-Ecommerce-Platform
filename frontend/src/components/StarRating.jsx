import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating = 0, onRate, size = 20, readOnly = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => !readOnly && onRate && onRate(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          style={{
            cursor: readOnly ? 'default' : 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            color: star <= (hovered || rating) ? '#F59E0B' : 'var(--text-muted)',
            transition: 'color 200ms, transform 200ms',
            transform: star <= hovered && !readOnly ? 'scale(1.2)' : 'scale(1)',
          }}
        >
          <FiStar size={size} fill={star <= (hovered || rating) ? '#F59E0B' : 'none'} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
