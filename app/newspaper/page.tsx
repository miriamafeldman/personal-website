const articles = [
  {
    title: "How to Build a Girl in Modern America",
    author: "Biz Sherbert",
    publication: "THE FACE",
    date: "06 Jan 2026",
    url: "https://theface.com/society/rushtok-sorority-kylan-izzy-darnell-sisters-university-of-alabama-american-girlhood",
  },
  {
    title: "What the Hole is Going On? The very real, totally bizarre bucatini shortage of 2020.",
    author: "Rachel Handler",
    publication: "Grub Street",
    date: "28 Dec 2020",
    url: "https://www.grubstreet.com/2020/12/2020-bucatini-shortage-investigation.html",
  },
  {
    title:
      "My Little Crony: An interactive visualisation of the links between Tory politicians and firms winning government contracts during the pandemic",
    author: "Sophie E. Hill",
    publication: "Sophie E. Hill",
    date: "2020",
    url: "https://www.sophie-e-hill.com/slides/my-little-crony/",
  },
  {
    title: "Is Mike Wazowski Jewish or Polish?",
    author: "Russell Sprout",
    publication: "Sproutstack",
    date: "08 Nov 2025",
    url: "https://sproutstack.com",
  },
];

export default function NewspaperPage() {
  return (
    <main className="page-shell">
      <p className="section-kicker" style={{ color: "var(--gold)" }}>
        Read / Web
      </p>
      <h1 className="section-title" style={{ color: "var(--gold)" }}>
        Sitting down with the newspaper
      </h1>
      <p className="section-intro">
        A short table of links worth your browser tabs.
      </p>

      <table className="editorial-table" style={{ marginTop: "1.2rem" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publication</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.title}>
              <td>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  className="table-title"
                  style={{ textDecoration: "none", borderBottom: "1px solid rgba(85,49,26,0.3)" }}
                >
                  {article.title}
                </a>
              </td>
              <td style={{ fontStyle: "italic" }}>{article.author}</td>
              <td>{article.publication}</td>
              <td>{article.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="section-footer">Updated as Miriam keeps reading.</p>
    </main>
  );
}
