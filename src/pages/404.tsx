import Base from "../layouts/Base.tsx";

export default function NotFoundPage() {
  return (
    <Base title="Page not found" noindex>
      <section className="wrap page-heading not-found">
        <p className="eyebrow">404 · A small detour</p>
        <h1>
          This page is
          <br />
          still unexplored.
        </h1>
        <p className="lead">
          The address may have changed. Find your way back to the language.
        </p>
        <div className="actions">
          <a className="button primary" href="/">
            Back to Scarp →
          </a>
          <a className="button secondary" href="/learn/">
            Find the learning guides
          </a>
        </div>
      </section>
    </Base>
  );
}
