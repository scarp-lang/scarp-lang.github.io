export default function Brand({ large = false }: { large?: boolean }) {
  return (
    <a
      href="/"
      className={`brand${large ? " large" : ""}`}
      aria-label="Scarp home"
    >
      <span className="brand-icon" aria-hidden="true">
        <img
          src="/brand/scarp-logo.webp"
          width="512"
          height="512"
          alt=""
          decoding="async"
          loading={large ? "lazy" : "eager"}
        />
      </span>
      <span>
        Scarp<span className="brand-period">.</span>
      </span>
    </a>
  );
}
