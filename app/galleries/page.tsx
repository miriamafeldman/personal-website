'use client';

import { useState, useRef, useEffect } from 'react';

// ============================================
// EDIT YOUR GALLERY ITEMS HERE
// ============================================
const galleryItems = [
  { src: "/gallery/image1.png", alt: "Description of image 1", title: "Partitions (2025) \n Danielle Fretwell \n Oil on canvas. 76.2 x 76.2 cm \n\n Danielle Fretwell: Tablescapes \n Alice Amati, London \n 10 October-8 November 2025" },
  { src: "/gallery/image2.png", alt: "Description of image 2", title: "102 (Face Jug Series) (2018)\nSimone Leigh\nSalt-fired stoneware\n12 1/2 x 7 x 9 inches\n\nSimone Leigh\nInstitute of Contemporary Arts, Boston\n6 April – 4 September 2023" },
  { src: "/gallery/image3.png", alt: "Description of image 3", title: "Study for Bullfight No.2 (1969)\nFrancis Bacon\n\nFrancis Bacon: Man and Beast\nRoyal Academy, London\n29 January – 17 April 2022" },
  { src: "/gallery/image4.png", alt: "Description of image 4", title: "Untitled (Red, Black, White On Yellow) (1955)\nMark Rothko\n\nMark Rothko\nFondation Louis Vuitton, Paris\n10 October 2023 - 01 April 2024" },
  { src: "/gallery/image5.png", alt: "Description of image 5", title: "Detail from\n Souvenir I (1996)\nKerry James Marshall\n\nKerry James Marshall: The Histories\nRoyal Academy of Arts, London\n20 September 2025 - 18 January 2026" },
  { src: "/gallery/image6.png", alt: "Description of image 6", title: "André Leon Talley and Fran Lebowitz, New York, c.1976\nBob Colacello\nGelatin silver print\n5 x 7 inches (12.7 x 17.8 cm)\n\nIt Just Happened, Photographs 1976–1982\n Thaddaeus Ropac, Paris\n21 January—4 March 2023" },
  { src: "/gallery/image7.png", alt: "Description of image 7", title: "Texas Louise (1971)\nFrank Bowling\n282 x 665 cm\n\nFrank Bowling's Americas\nMuseum of Fine Arts, Boston\n22 October 2022 - 9 April 2023" },
  { src: "/gallery/image9.png", alt: "Description of image 9", title: "Portrait of W (1951-2)\nGrace Hartigan\n\nAction, Gesture, Paint: Women Artists and Global Abstraction 1940–70\nWhitechapel Gallery, London\n9 February – 7 May 2023" },
];

// ============================================
// Hook to track column count
// ============================================
function useColumnCount(gridRef: React.RefObject<HTMLDivElement | null>) {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const update = () => {
      if (!gridRef.current) return;
      const style = window.getComputedStyle(gridRef.current);
      const cols = style.gridTemplateColumns.split(' ').length;
      setColumns(cols);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [gridRef]);

  return columns;
}

export default function Gallery() {
  const [mobileTooltip, setMobileTooltip] = useState<string | null>(null);
  const [activeTileIndex, setActiveTileIndex] = useState<number | null>(null);
  const lastDismissTime = useRef(0);  // ← add this line
  const gridRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount(gridRef);

  const dismissTooltip = () => {
    setMobileTooltip(null);
    setActiveTileIndex(null);
    lastDismissTime.current = Date.now();
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--offwhite)' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 gallery-title">
          At the gallery
        </h1>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 pb-20">
        <div
          ref={gridRef}
          className="mx-auto gallery-grid"
          style={{
            display: 'grid',
            gap: '0px',
            maxWidth: '1400px',
          }}
        >
          {galleryItems.map((item, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            const isBrown = (row + col) % 2 === 0;

            return (
              <GalleryTile
                key={`${index}-${columns}`}
                src={item.src}
                alt={item.alt}
                title={item.title}
                isBrown={isBrown}
                index={index}
                isActive={activeTileIndex === index}
                onMobileTap={(title, idx) => {
                  if (Date.now() - lastDismissTime.current < 300) return;
                  setMobileTooltip(title);
                  setActiveTileIndex(idx);
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Mobile bottom sheet */}
      {mobileTooltip && (
        <div
          className="mobile-tooltip-overlay"
          onClick={dismissTooltip}
        >
          <div
            className="mobile-tooltip-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="clickable"
              onClick={dismissTooltip}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                color: 'var(--olive)',
                fontWeight: 600,
                lineHeight: 1,
                padding: '4px',
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <p
              style={{
                margin: 0,
                whiteSpace: 'pre-line',
                color: 'var(--olive)',
                fontSize: '0.82rem',
                fontWeight: 400,
                lineHeight: 1.65,
                paddingRight: '24px',
              }}
            >
              {mobileTooltip}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>

      <style>{`
        .gallery-grid {
          grid-template-columns: repeat(4, 1fr);
        }

        .desktop-tooltip {
          display: block;
        }
        .mobile-tooltip-overlay {
          display: none;
        }

        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .gallery-title {
            font-size: 2rem !important;
          }
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .desktop-tooltip {
            display: none !important;
          }
          .mobile-tooltip-overlay {
            display: flex;
            position: fixed;
            inset: 0;
            z-index: 999;
            background: rgba(85, 49, 26, 0.15);
            align-items: flex-end;
            animation: overlayFadeIn 0.2s ease;
          }
          .mobile-tooltip-sheet {
            position: relative;
            width: 100%;
            background: var(--offwhite);
            padding: 24px 20px 32px;
            max-height: 45vh;
            overflow-y: auto;
            animation: sheetSlideUp 0.25s ease;
            box-shadow: 0 -8px 30px rgba(85, 49, 26, 0.12);
            border-top: 1px solid rgba(165, 157, 50, 0.45);
            border-bottom: 1px solid rgba(165, 157, 50, 0.45);
          }
          .mobile-tooltip-sheet::before,
          .mobile-tooltip-sheet::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            height: 0;
          }
          .mobile-tooltip-sheet::before {
            top: 5px;
            border-top: 1px solid rgba(165, 157, 50, 0.25);
          }
          .mobile-tooltip-sheet::after {
            bottom: 5px;
            border-bottom: 1px solid rgba(165, 157, 50, 0.25);
          }
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

function GalleryTile({
  src,
  alt,
  title,
  isBrown,
  index,
  isActive,
  onMobileTap,
}: {
  src: string;
  alt: string;
  title: string;
  isBrown: boolean;
  index: number;
  isActive: boolean;
  onMobileTap: (title: string, index: number) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={tileRef}
      className="relative overflow-visible clickable gallery-tile"
      style={{
        aspectRatio: '3 / 4',
        backgroundColor: isHovered || isActive
          ? 'var(--olive)'
          : isBrown
          ? 'var(--brown)'
          : 'var(--offwhite)',
        transition: 'background-color 0.4s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onTouchEnd={(e) => {
        e.preventDefault();
        if (title) onMobileTap(title, index);
      }}
      onClick={() => {
        if (title) onMobileTap(title, index);
      }}
    >
      {/* Image container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: '12%' }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            style={{
              transform: isHovered || isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Desktop cursor-following tooltip */}
      {title && isHovered && (
        <div
          className="desktop-tooltip"
          style={{
            position: 'fixed',
            left: mousePos.x + 16,
            top: mousePos.y + 16,
            backgroundColor: 'var(--offwhite)',
            color: 'var(--olive)',
            padding: '12px 16px',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
            zIndex: 1000,
            maxWidth: '300px',
            border: '1px solid var(--olive)',
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
