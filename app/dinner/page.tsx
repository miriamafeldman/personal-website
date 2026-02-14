const dinnerNotes = [
  {
    area: "Soho",
    note: "Best for walk-ins after a gallery opening.",
  },
  {
    area: "Dalston",
    note: "Late kitchen, strong playlist, and room for long conversations.",
  },
  {
    area: "Borough",
    note: "Weeknight fallback when everyone can meet after work.",
  },
];

export default function DinnerPage() {
  return (
    <main className="page-shell">
      <p className="section-kicker" style={{ color: "var(--red)" }}>
        Visit / Food
      </p>
      <h1 className="section-title" style={{ color: "var(--red)" }}>
        Out to dinner in London
      </h1>
      <p className="section-intro">
        A lightweight section for favorite neighborhoods, recurring tables, and places worth recommending.
      </p>

      <section className="section-grid" style={{ marginTop: "1rem" }}>
        {dinnerNotes.map((entry) => (
          <article className="info-card" key={entry.area} style={{ borderColor: "rgba(211, 64, 22, 0.36)" }}>
            <h3>{entry.area}</h3>
            <p>{entry.note}</p>
          </article>
        ))}
      </section>

      <p className="section-footer">Section scope is still evolving.</p>
    </main>
  );
}
