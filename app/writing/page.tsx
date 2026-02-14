"use client";

import { useState } from "react";

type WritingPiece = {
  id: string;
  title: string;
  publication: string;
  date: string;
  externalUrl?: string;
  body: string[];
};

const pieces: WritingPiece[] = [
  {
    id: "assimilation-anxiety",
    title: "Assimilation Anxiety: The 2025 Booker Prize and pulling the ladder up behind you",
    publication: "Framework",
    date: "16 Nov 2025",
    externalUrl: "https://framework.substack.com",
    body: [
      "The 2025 Booker conversation eventually turned into a conversation about gatekeeping, class signaling, and who gets to define seriousness in fiction.",
      "This essay traces that argument through jury language, shortlist reception, and the historical habit of mistaking familiarity for universal taste.",
    ],
  },
  {
    id: "cobalt",
    title: "Red, white, and cobalt blue: A case study from the ceramics supply chain",
    publication: "Framework",
    date: "12 Apr 2025",
    externalUrl: "https://framework.substack.com",
    body: [
      "The ceramics supply chain tells a useful story about scarcity, demand spikes, and how enthusiast communities can suddenly reshape procurement.",
      "I map one material path from kiln shelf to finished object and use it to think through supply shocks in miniature.",
    ],
  },
  {
    id: "paypal",
    title: "Paypal's Oscar Nom",
    publication: "Framework",
    date: "15 Feb 2025",
    externalUrl: "https://framework.substack.com",
    body: [
      "A short piece on sponsorship theater and prestige laundering in award season economics.",
    ],
  },
  {
    id: "moon",
    title: "To the Moon and Back: On the rise and fall of blockchain art startups",
    publication: "Framework",
    date: "27 Jan 2025",
    externalUrl: "https://framework.substack.com",
    body: [
      "In 2021, every deck promised disintermediation; by 2024, most of those same decks had been quietly rewritten into ordinary SaaS claims. The speed of that transition is the point. Blockchain art startups were less a technical revolution than a financing format for a particular confidence game: one where market language stood in for institutional trust.",
      "The winning firms were not the loudest evangelists. They were the teams that treated collectors and artists as long-term stakeholders rather than a liquidity event. They built boring capabilities early: rights operations, transparent payouts, archival metadata, and basic customer support. None of that trended on social media, and all of it mattered once volatility arrived.",
      "What failed, repeatedly, was the idea that provenance alone could replace cultural infrastructure. Museums, galleries, publishers, and critics still shape value because they do the slow work of context. Startups that tried to bypass that layer discovered that transaction history is not interpretation.",
      "The next wave of art-tech will likely be quieter and better: fewer claims of world-historical rupture, more practical tools for documentation, funding, and discovery. The lesson of the boom is not that experimentation was misguided. It is that durable institutions are built in years, not hype cycles.",
    ],
  },
  {
    id: "eliot",
    title: "The T.S. Eliot Prize, by the numbers",
    publication: "Framework",
    date: "14 Jan 2025",
    externalUrl: "https://framework.substack.com",
    body: [
      "A quantitative read of shortlist patterns, publication timing, and repeat nomination dynamics.",
    ],
  },
  {
    id: "on-fire",
    title: "On Fire",
    publication: "Framework",
    date: "10 Jan 2025",
    externalUrl: "https://framework.substack.com",
    body: [
      "Notes on urgency, aesthetics, and what cultural criticism can still do in moments of overload.",
    ],
  },
];

export default function WritingPage() {
  const [expanded, setExpanded] = useState<string | null>("moon");

  return (
    <main className="page-shell">
      <p className="section-kicker" style={{ color: "var(--blue)" }}>
        Make / Writing
      </p>
      <h1 className="section-title" style={{ color: "var(--blue)" }}>
        Writing
      </h1>
      <p className="section-intro">
        Published pieces from Framework. Every item links out, and selected essays can be read inline.
      </p>

      <table className="editorial-table" style={{ marginTop: "1.1rem" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Publication</th>
            <th>Date</th>
            <th>Read</th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => {
            const isOpen = expanded === piece.id;

            return (
              <tr key={piece.id} id={piece.id}>
                <td>
                  <span className="table-title">{piece.title}</span>
                  {isOpen ? (
                    <div className="inline-article">
                      {piece.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}
                </td>
                <td>{piece.publication}</td>
                <td>{piece.date}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {piece.externalUrl ? (
                      <a
                        href={piece.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          border: "1px solid rgba(33,89,255,0.4)",
                          padding: "0.2rem 0.4rem",
                          fontSize: "0.74rem",
                          textDecoration: "none",
                        }}
                      >
                        Framework
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : piece.id)}
                      style={{
                        border: "1px solid rgba(85,49,26,0.3)",
                        background: "transparent",
                        padding: "0.2rem 0.4rem",
                        fontSize: "0.74rem",
                      }}
                    >
                      {isOpen ? "Collapse" : "Read here"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="section-footer">Inline typography set in a serif register for longer reading.</p>
    </main>
  );
}
