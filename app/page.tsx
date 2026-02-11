export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Miriam Ames Feldman
        </h1>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto py-16 px-6">
        <p className="text-gray-900 leading-relaxed">
          I am primarily a tech strategist. My favourite projects set a clear operational
          goal that technology can help realise: We want more <a href="https://www.bcg.com/publications/2025/turbulence-to-transformation-airlines-embrace-digital" target="_blank" className="underline hover:font-bold" style={{ color: 'var(--blue)' }}>planes to take off on time</a>. 
          Quicker, more flexible supply chain planning allows us to respond
          better to shocks. 
          </p>
        <p className="text-gray-900 leading-relaxed mt-4">
          Like many others, I believe we are on the cusp of major AI-driven
          changes to operating models across knowledge work, scientific discovery, and industrial
          contexts. With that in mind, I'll be spending this year researching innovation partnerships and applications of
          AI to R&D at the <a href="https://bcghendersoninstitute.com/" target="_blank" className="underline hover:font-bold" style={{ color: 'var(--blue)' }}>BCG Henderson Institute</a>.
        </p>
        <p className="text-gray-900 leading-relaxed mt-4">
          I spend my spare working hours focused on the intersection of
          strategy and the arts. Since 2023, I've supported the creation of an Arts &
          Culture-specific pro bono team in BCG's London office. It's a privilege to work with the UK's world-leading cultural
          institutions and, most of all, lots of fun to spend time with others in the office who share
          a love for the arts. Our excellent colleagues at the UK Centre for Growth recently
published a report on the <a href="https://www.bcg.com/united-kingdom/centre-for-growth/insights/the-next-act-a-vision-for-the-uks-creative-future" target="_blank" className="underline hover:font-bold" style={{ color: 'var(--blue)' }}>state of the UK's cultural industries</a> which offers a clear
statement of many of our priorities.
        </p>
        <p className="text-gray-900 leading-relaxed mt-4">
          Nights and weekends, I can reliably be found in the ceramics studio or exploring London's galleries and theatres.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 Miriam Ames Feldman. Built with Next.js.
      </footer>
    </main>
  );
}