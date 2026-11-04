import Base from "../../layouts/Base.tsx";
import { formatNewsDate } from "../../lib/date.ts";
import { news } from "../../data/project";

export default function NewsIndexPage() {
  return (
    <Base
      title="News"
      description="Release highlights and updates from the Scarp Programming Language project."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">Project news</p>
        <h1>
          The language.
          <br />
          The journey.
        </h1>
        <p className="lead">
          Release highlights and notes from a project taking shape.
        </p>
        <a className="inline-link" href="/feed.xml">
          Subscribe with RSS ↗
        </a>
      </section>
      <section className="wrap news-grid section compact">
        {news.map((item) => (
          <a key={item.href} className="news-card" href={item.href}>
            <div className="news-meta">
              <span>{item.category}</span>
              <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <span className="text-link">Read the update ↗</span>
          </a>
        ))}
      </section>
    </Base>
  );
}
