'use client';

import { useState, useRef, useCallback } from 'react';

// ============================================
// PROJECT DATA
// ============================================
interface Project {
  id: string;
  name: string;
  folder: string;       // path under /studio/
  heroImage: string;     // filename for selector button
  stages: { name: string; image: string }[];
}

const projects: Project[] = [
  {
    id: 'tenmoku-mugs-2025',
    name: '',
    folder: '/studio/tenmoku-mugs-2025',
    heroImage: 'mug25.png',
    stages: [
      { name: 'Design', image: 'design.png' },
      { name: 'Throw', image: 'throw.png' },
      { name: 'Trim', image: 'trim.png' },
      { name: 'Embellish', image: 'embellish.png' },
      { name: 'Bisque', image: 'bisque.png' },
      { name: 'Glaze', image: 'glaze.png' },
    ],
  },
    {
    id: 'vase-2023',
    name: '',
    folder: '/studio/vase-2023',
    heroImage: 'vase23.png',
    stages: [
      { name: 'Design', image: 'design.png' },
      { name: 'Throw', image: 'throw.png' },
      { name: 'Trim', image: 'trim.png' },
      { name: 'Embellish', image: 'embellish.png' },
      { name: 'Bisque', image: '' },
      { name: 'Glaze', image: 'glaze.png' },
    ],
  }
];

// ============================================
// PROJECT SELECTOR
// ============================================
function ProjectSelector({
  projects,
  activeProject,
  onSelect,
}: {
  projects: Project[];
  activeProject: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {projects.map((project) => {
        const isActive = project.id === activeProject.id;
        return (
          <button
            key={project.id}
            className="clickable"
            onClick={() => onSelect(project)}
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              border: isActive
                ? '2px solid var(--olive)'
                : '2px solid rgba(165, 157, 50, 0.25)',
              backgroundColor: isActive
                ? 'rgba(165, 157, 50, 0.12)'
                : 'rgba(165, 157, 50, 0.05)',
              transition: 'all 0.2s ease',
              padding: 0,
            }}

          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'rgba(165, 157, 50, 0.08)',
                border: '2px solid rgba(165, 157, 50, 0.2)',
                flexShrink: 0,
              }}
            >
              <img
                src={`${project.folder}/${project.heroImage}`}
                alt={project.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--olive)' : 'var(--brown)',
                whiteSpace: 'nowrap',
              }}
            >
              {project.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}


// ============================================
// PILL PROGRESS BAR
// ============================================
function ProgressBar({
  activeIndex,
  onChangeIndex,
  total,
  stageNames,
}: {
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  total: number;
  stageNames: string[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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
        {/* Filled capsule */}
        {activeIndex > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: activeIndex === total - 1 ? '100%' : `calc(${dotLeft(activeIndex)}% + 18px)`,
              backgroundColor: 'rgba(165, 157, 50, 0.35)',
              borderRadius: '20px',
              transition: isDragging.current ? 'none' : 'width 0.3s ease',
            }}
          />
        )}

        {/* Dots */}
        {stageNames.map((_, i) => {
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
        {stageNames.map((name, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={name}
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
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// STICKER IMAGE DISPLAY
// ============================================
function StageDisplay({ src, stageName }: { src: string; stageName: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '420px',
        padding: '1rem 0',
      }}
    >
      {!imgError ? (
        <img
          src={src}
          alt={`${stageName} stage`}
          onError={() => setImgError(true)}
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain',
            filter: [
              'drop-shadow(0 0 4px white)',
              'drop-shadow(0 0 4px white)',
              'drop-shadow(0 0 4px white)',
              'drop-shadow(0 0 4px white)',
              'drop-shadow(0 0 0.5px var(--olive))',
              'drop-shadow(0 0 0.5px var(--olive))',
              'drop-shadow(0 0 10px rgba(165, 157, 50, 0.2))',
            ].join(' '),
          }}
        />
      ) : (
        <div
          style={{
            width: '360px',
            height: '270px',
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
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function StudioPage() {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [activeStage, setActiveStage] = useState(0);

  const handleProjectChange = (project: Project) => {
    setActiveProject(project);
    setActiveStage(0);
  };

  const activeStages = activeProject.stages.filter((s) => s.image !== '');
  const currentStage = activeStages[activeStage];
  const imageSrc = `${activeProject.folder}/${currentStage.image}`;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--offwhite)' }}
    >
      {/* Header */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">At the studio</h1>

        {/* Project selector */}
        <ProjectSelector
          projects={projects}
          activeProject={activeProject}
          onSelect={handleProjectChange}
        />
      </section>

      {/* Progress bar + image */}
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
          total={activeStages.length}
          stageNames={activeStages.map((s) => s.name)}
        />

        <StageDisplay src={imageSrc} stageName={currentStage.name} />
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 text-sm"
        style={{ color: 'var(--brown)' }}
      >
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
  );
}
