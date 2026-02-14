import Link from "next/link";

export default function OfficePage() {
  return (
    <main className="page-shell">
      <p className="section-kicker">Work</p>
      <h1 className="section-title" style={{ color: "var(--blue)" }}>
        At the office
      </h1>
      <p className="section-intro">
        I am primarily a tech strategist. The projects I care about most start with an operational question that matters in the real world, then use technology to move the result.
      </p>

      <hr className="rule" />

      <section className="section-grid two">
        <article className="info-card">
          <h3>Technology as operating leverage</h3>
          <p>
            I work on problems where capability changes outcomes: faster turnaround for supply chains, better resilience in planning cycles, cleaner decision systems in complex organizations.
          </p>
          <p>
            A good strategy plan is explicit about where the operating model should change and what data, product, and process choices make that change durable.
          </p>
        </article>

        <article className="info-card">
          <h3>The AI and R&amp;D thread</h3>
          <p>
            This year I am focused on AI applications in research and development, including where partnership models help organizations move from experimentation to adoption.
          </p>
          <p>
            That work sits alongside research at the BCG Henderson Institute and collaboration across teams interested in new models of scientific and industrial discovery.
          </p>
        </article>
      </section>

      <hr className="rule" />

      <section className="section-grid two">
        <article className="info-card">
          <h3>Strategy x arts</h3>
          <p>
            Since 2023, I have helped shape BCG London&apos;s arts and culture focus. We now work with cultural organizations through a dedicated lens, including annual pro bono commitments.
          </p>
          <p>
            The overlap between institutional strategy and creative practice is where I do some of my favorite thinking.
          </p>
        </article>

        <article className="info-card">
          <h3>Further reading</h3>
          <p>
            Two pieces that sit at this intersection are <Link href="/writing#cobalt" style={{ textDecoration: "underline", color: "var(--blue)" }}>Red, white, and cobalt blue</Link> and <Link href="/writing#moon" style={{ textDecoration: "underline", color: "var(--blue)" }}>To the Moon and Back</Link>.
          </p>
          <p>
            The long version of what I read, make, and write around this work is mapped across the rest of the week.
          </p>
        </article>
      </section>

      <p className="section-footer">London, 2026</p>
    </main>
  );
}
