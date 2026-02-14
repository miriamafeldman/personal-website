/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';

// ============================================
// EDIT YOUR GALLERY ITEMS HERE
// ============================================
// For each item:
//   - src: the filename of your image in public/gallery/ (e.g. "painting1.jpg")
//   - alt: a description of the image
//   - title: optional title shown on hover (leave empty string "" if you don't want one)
//
// The checkerboard pattern alternates automatically.
// Add or remove items as you like — the grid adapts.

const galleryItems = [
  { src: "/gallery/image1.png", alt: "Description of image 1", title: "Partitions (2025) \n Danielle Fretwell \n Oil on canvas. 76.2 x 76.2 cm \n\n Danielle Fretwell: Tablescapes \n Alice Amati, London \n 10 October-8 November 2025" },
  { src: "/gallery/image2.png", alt: "Description of image 2", title: "102 (Face Jug Series) (2018)\nSimone Leigh\nSalt-fired stoneware\n12 1/2 x 7 x 9 inches\n\nSimone Leigh\nInstitute of Contemporary Arts, Boston\n6 April – 4 September 2023" },
  { src: "/gallery/image3.png", alt: "Description of image 3", title: "Study for Bullfight No.2 (1969)\nFrancis Bacon\n\nFrancis Bacon: Man and Beast\nRoyal Academy, London\n29 January – 17 April 2022" },
  { src: "/gallery/image4.png", alt: "Description of image 4", title: "Untitled (Red, Black, White On Yellow) (1955)\nMark Rothko\n\nMark Rothko\nFondation Louis Vuitton, Paris\n10 October 2023 - 01 April 2024" },
  { src: "/gallery/image5.png", alt: "Description of image 5", title: "Detail from\n Souvenir I (1996)\nKerry James Marshall\n\nKerry James Marshall: The Histories\nRoyal Academy of Arts, London\n20 September 2025 - 18 January 2026" },
  { src: "/gallery/image6.png", alt: "Description of image 6", title: "André Leon Talley and Fran Lebowitz, New York, c.1976\nBob Colacello\nGelatin silver print\n5 x 7 inches (12.7 x 17.8 cm)\n\nIt Just Happened, Photographs 1976–1982\n Thaddaeus Ropac, Paris\n21 January—4 March 2023" },
  { src: "/gallery/image7.png", alt: "Description of image 7", title: "Texas Louise (1971)\nFrank Bowling\n282 x 665 cm\n\nFrank Bowling’s Americas\nMuseum of Fine Arts, Boston\n22 October 2022 - 9 April 2023" },
  { src: "/gallery/image9.png", alt: "Description of image 9", title: "Portrait of W (1951-2)\nGrace Hartigan\n\nAction, Gesture, Paint: Women Artists and Global Abstraction 1940–70\nWhitechapel Gallery, London\n9 February – 7 May 2023" },
];

// ============================================
// Number of columns in the grid
// ============================================
const COLUMNS = 4;

export default function Gallery() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--offwhite)' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
  At the gallery
</h1>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 pb-20">
        <div
          className="mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
            gap: '0px',
            maxWidth: '1400px',
          }}
        >
          {galleryItems.map((item, index) => {
            // Calculate row and column to create checkerboard
            const row = Math.floor(index / COLUMNS);
            const col = index % COLUMNS;
            const isBrown = (row + col) % 2 === 0;

            return (
              <GalleryTile
                key={index}
                src={item.src}
                alt={item.alt}
                title={item.title}
                isBrown={isBrown}
              />
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm" style={{ color: 'var(--brown)' }}>
        © 2026 Miriam Ames Feldman
      </footer>
    </main>
  );
}

function GalleryTile({
  src,
  alt,
  title,
  isBrown,
}: {
  src: string;
  alt: string;
  title: string;
  isBrown: boolean;
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
      className="relative overflow-visible clickable"
      style={{
        aspectRatio: '3 / 4',
        backgroundColor: isHovered
          ? 'var(--olive)'
          : isBrown
          ? 'var(--brown)'
          : 'var(--offwhite)',
        transition: 'background-color 0.4s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
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
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Cursor-following tooltip */}
      {title && isHovered && (
        <div
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

