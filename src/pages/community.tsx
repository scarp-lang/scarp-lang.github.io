import Base from "../layouts/Base.tsx";
import { project, socials } from "../data/project";

export default function CommunityPage() {
  return (
    <Base
      title="Community"
      description="Find official Scarp accounts, ask language questions, report issues, and connect with the project."
    >
      <section className="wrap page-heading">
        <p className="eyebrow">The people around the language</p>
        <h1>
          Bring your curiosity.
          <br />
          Find your place.
        </h1>
        <p className="lead">
          Ask a question. Share an experiment. Help make the next step clearer.
        </p>
      </section>
      <section className="wrap community-paths">
        <a className="news-card" href={`${project.repo}/issues`}>
          <p className="eyebrow">Language & runtime</p>
          <h2>Questions and bugs</h2>
          <p>
            Use the compiler issue tracker for reproducible problems, language
            questions, and feature discussions.
          </p>
          <span className="text-link">Open language issues ↗</span>
        </a>
        <a className="news-card" href="/contribute/">
          <p className="eyebrow">Make a difference</p>
          <h2>Start contributing</h2>
          <p>
            Documentation corrections, small examples, and precise bug reports
            all help move the language forward.
          </p>
          <span className="text-link">Find a starting point →</span>
        </a>
      </section>
      <section className="wrap section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Official project accounts</p>
            <h2>Follow along.</h2>
          </div>
          <p>
            Reviewed against the official documentation directory.
            <br />
            Some accounts may not have published content yet.
          </p>
        </div>
        <div className="social-grid">
          {socials.map(([name, handle, href]) => (
            <a key={href} href={href}>
              <span>
                <b>{name}</b>
                <small>{handle}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
      <section className="wrap section prose">
        <h2>Contact the project</h2>
        <p>
          For project correspondence:{" "}
          <a href={`mailto:${project.contact}`}>{project.contact}</a>. For a
          bug, use a public issue so others can inspect the example and follow
          the resolution.
        </p>
        <p>
          The{" "}
          <a href={project.docs + "community/social"}>
            official account directory
          </a>{" "}
          records reviewed channels. Additional invitations and company-page
          links will appear when their exact destinations are confirmed.
        </p>
      </section>
      <section className="wrap prose">
        <h2>Looking for technical help?</h2>
        <p>
          Visit the <a href="/support/">support hub</a> for troubleshooting
          guides, a reporting checklist, and the correct language,
          documentation, or website issue tracker.
        </p>
      </section>
    </Base>
  );
}
