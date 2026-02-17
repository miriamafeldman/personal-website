'use client';

import { useState, useRef, useCallback } from 'react';

// ============================================
// STAGE DATA
// ============================================
interface Stage {
  name: string;
  images: string[];
}

const stages: Stage[] = [
  { name: 'Design', images: ['/studio/design-1.jpg'] },
  { name: 'Throw', images: ['/studio/throw-1.jpg'] },
  { name: 'Trim', images: ['/studio/trim-1.jpg'] },
  { name: 'Embellish', images: ['/studio/embellish-1.jpg'] },
  { name: 'Bisque', images: ['/studio/bisque-1.jpg'] },
  { name: 'Glaze', images: ['/studio/glaze-1.jpg'] },
];

// ============================================
// PILL PROGRESS BAR
// ============================================
function ProgressBar({
  activeIndex,
  onChangeIndex,
  total,
}: {
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  total: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Shared positioning: dots sit at 4.25% to 95.75% of the track
  const dotLeft = (i: number) =>
    total > 1 ? 4.25 + (i / (total - 1)) * 91.5 : 50;

  const getIndexFromX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (total - 1));
    },
    [total],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onChangeIndex(getIndexFromX(e.clientX));
    },
    [getIndexFromX, onChangeIndex],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      onChangeIndex(getIndexFromX(e.clientX));
    },
    [getIndexFromX, onChangeIndex],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div style={{ padding: '0 0 2.5rem' }}>
      {/* Pill track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="clickable"
        style={{
          position: 'relative',
          height: '40px',
          borderRadius: '20px',
          backgroundColor: 'rgba(165, 157, 50, 0.12)',
          border: '2px solid rgba(165, 157, 50, 0.25)',
          overflow: 'hidden',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
      {/* Filled capsule ending at active dot */}
        {activeIndex > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: activeIndex === total - 1 ? '100%' : `calc(${dotLeft(activeIndex)}% + 20px)`,
              backgroundColor: 'rgba(165, 157, 50, 0.35)',
              borderRadius: '20px',
              transition: isDragging.current ? 'none' : 'width 0.3s ease',
            }}
          />
        )}

        {/* Dots */}
        {stages.map((_, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div
              key={i}
              className="clickable"
              onClick={(e) => {
                e.stopPropagation();
                onChangeIndex(i);
              }}
              style={{
                position: 'absolute',
                left: `${dotLeft(i)}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: isActive ? '22px' : '14px',
                height: isActive ? '22px' : '14px',
                borderRadius: '50%',
                backgroundColor: isActive || isPast ? 'var(--olive)' : 'var(--offwhite)',
                border: `2px solid ${isActive || isPast ? 'var(--olive)' : 'rgba(165, 157, 50, 0.35)'}`,
                transition: 'all 0.25s ease',
                zIndex: 2,
                boxShadow: isActive ? '0 0 0 4px rgba(165, 157, 50, 0.2)' : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div style={{ position: 'relative', height: '28px', marginTop: '10px' }}>
        {stages.map((stage, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={stage.name}
              className="clickable"
              onClick={() => onChangeIndex(i)}
              style={{
                position: 'absolute',
                left: `${dotLeft(i)}%`,
                transform: 'translateX(-50%)',
                background: 'none',
                border: 'none',
                padding: '4px 0',
                fontSize: isActive ? '0.92rem' : '0.8rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? 'var(--olive)' : 'var(--brown)',
                opacity: isActive ? 1 : 0.45,
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {stage.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// STAGE DISPLAY
// ============================================
function StageDisplay({ stage }: { stage: Stage }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '420px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          aspectRatio: '4 / 3',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(165, 157, 50, 0.2)',
          backgroundColor: 'rgba(165, 157, 50, 0.06)',
        }}
      >
        {!imgError ? (
          <img
            src={stage.images[0]}
            alt={`${stage.name} stage`}
            onError={() => setImgError(true)}
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
              color: 'var(--olive)',
              opacity: 0.3,
              fontSize: '0.85rem',
            }}
          >
            Photo coming soon
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function StudioPage() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--offwhite)' }}
    >
      <section style={{ padding: '4rem 1.5rem 2rem', textAlign: 'center' }}>
      <h1 className="text-5xl font-bold text-gray-900 mb-8">At the studio</h1>
      </section>

      <section
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '1rem 1.5rem 4rem',
        }}
      >
        <ProgressBar
          activeIndex={activeStage}
          onChangeIndex={setActiveStage}
          total={stages.length}
        />

        <StageDisplay stage={stages[activeStage]} />
      </section>

      <footer
        className="text-center py-8 text-sm"
        style={{ color: 'var(--brown)' }}
      >
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
  );
}
