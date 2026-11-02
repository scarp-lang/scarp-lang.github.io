import type { ReactNode } from "react";
import Base from "./Base.tsx";

interface ArticleProps {
  title: string;
  description: string;
  eyebrow?: string;
  date?: string;
  children: ReactNode;
}

export default function Article({
  title,
  description,
  eyebrow = "Explore Scarp",
  date,
  children,
}: ArticleProps) {
  return (
    <Base title={title} description={description}>
      <div className="article-wrapper wrap">
        <header className="page-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead">{description}</p>
          {date && (
            <time dateTime={date}>
              {new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          )}
        </header>
        <article className="prose">{children}</article>
      </div>
    </Base>
  );
}
