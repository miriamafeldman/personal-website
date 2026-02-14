export default function MeTimePage() {
  return (
    <main className="page-shell">
      <p className="section-kicker" style={{ color: "var(--olive)" }}>
        Make / Me Time
      </p>
      <h1 className="section-title" style={{ color: "var(--olive)" }}>
        Me time
      </h1>
      <p className="section-intro">
        The personal page behind Tuesday evening.
      </p>

      <section className="info-card" style={{ marginTop: "1rem" }}>
        <p>
          I am primarily a tech strategist. My favourite projects set a clear operational goal that technology can help realise: We want more{" "}
          <a
            href="https://www.bcg.com/publications/2025/turbulence-to-transformation-airlines-embrace-digital"
            target="_blank"
            rel="noreferrer"
            className="underline hover:font-bold"
            style={{ color: "var(--blue)" }}
          >
            planes to take off on time
          </a>
          . Quicker, more flexible supply chain planning allows us to respond better to shocks.
        </p>
        <p>
          Like many others, I believe we are on the cusp of major AI-driven changes to operating models across knowledge work, scientific discovery, and industrial contexts. With that in mind, I&apos;ll be spending this year researching innovation partnerships and applications of AI to R&amp;D at the{" "}
          <a
            href="https://bcghendersoninstitute.com/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:font-bold"
            style={{ color: "var(--blue)" }}
          >
            BCG Henderson Institute
          </a>
          .
        </p>
        <p>
          I spend my spare hours focused on the intersection of strategy and the arts. Since 2023, I&apos;ve supported the creation of an Arts &amp; Culture-specific team in BCG&apos;s London office. Our excellent colleagues at the UK Centre for Growth recently published a report on the{" "}
          <a
            href="https://www.bcg.com/united-kingdom/centre-for-growth/insights/the-next-act-a-vision-for-the-uks-creative-future"
            target="_blank"
            rel="noreferrer"
            className="underline hover:font-bold"
            style={{ color: "var(--blue)" }}
          >
            state of the UK&apos;s cultural industries
          </a>
          .
        </p>
        <p>
          Nights and weekends, I can reliably be found in the ceramics studio, exploring London&apos;s galleries, or sitting down to read.
        </p>
      </section>
    </main>
  );
}
