import Article from "../layouts/Article.tsx";
import { exampleCompatibility, fixtureUrl, publishedFixtureUrl } from "../data/compatibility.ts";
import { project } from "../data/project.ts";
import { publishedCompiler } from "../data/releases.ts";

export default function CompatibilityPage() {
  return (
    <Article
      title="Compiler compatibility, tested."
      description="Know which Scarp compiler releases execute the actual examples on this website—and where the checks stop."
      eyebrow="Verified examples · Scarp prereleases"
      date={exampleCompatibility.reviewed}
    >
      <h2 id="versions">Two versions, one set of tested examples</h2>
      <p>
        GitHub Actions builds each interpreter at its pinned source commit and
        runs the same three Scarp programs. Each must exit successfully, produce
        exactly the checked-in stdout fixture, and pass its version-appropriate
        source validation command without unexpected output.
      </p>
      <div className="compat-table-wrap" role="region" aria-label="Compiler version compatibility" tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th>Compiler</th>
            <th>Run program</th>
            <th>Validate source</th>
            <th>Checked result</th>
          </tr>
        </thead>
        <tbody>
          {exampleCompatibility.versions.map(version => (
            <tr key={version.tag}>
              <td><a href={project.repo + "/releases/tag/" + version.tag}>{version.tag}</a></td>
              <td><code>scarp {version.executionCommand} hello.srp</code></td>
              <td>
                <code>scarp {version.validationCommand} hello.srp</code>
                <small>{version.validationType}</small>
              </td>
              <td>{version.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p>
        <strong>Important:</strong> the historical <code>check</code> command in{" "}
        {project.tag} can evaluate program statements; it is not the same
        as the static-only <code>verify</code> command shipped since alpha.3.
      </p>

      <p>
        Changing CLI versions? The <a href="/migration/">version-by-version
        migration guide</a> explains which spellings are available in each
        published alpha and why <code>check</code> is not interchangeable
        with static-only <code>verify</code>.
      </p>

      <h2 id="fixtures">Exactly what was tested</h2>
      <ul>
        {exampleCompatibility.fixtureNames.map(name => (
          <li key={name}>
            <a href={fixtureUrl(name)}>{name}</a> ·{" "}
            <a href={fixtureUrl(name.replace(".srp", ".stdout"))}>expected output</a>
          </li>
        ))}
      </ul>
      <p>
        These are the files rendered in the homepage code explorer. The newer
        compiler passed the existing fixtures; that does not imply that all Scarp
        syntax, old CLI commands, libraries or other projects are compatible.
      </p>

      <h2 id="published-only">Published alpha.6 numerical and language coverage</h2>
      <p>
        Additional examples for vector <code>rms</code>, deterministic{" "}
        <code>topk</code> ranking, temperature-aware{" "}
        <code>softmax_temp</code>/<code>logsoftmax_temp</code>,{" "}
        <code>top_p</code> nucleus selection and centered{" "}
        <code>pearson_correlation</code> and the new alpha.6.7{" "}
        <code>if</code>/<code>elif</code>/<code>else</code> expression with{" "}
        Unicode escapes run only with{" "}
        <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>,
        not with the older baseline. Their exact stdout is checked,
        and <code>inspect symbols</code> and <code>inspect references</code>{" "}
        JSON outputs are checked for schema version 1 and declared kinds.
        These tests do not certify the whole symbol-index API or numerical library.
      </p>
      <ul>
        {exampleCompatibility.publishedOnlyFixtureNames.map(name => (
          <li key={name}>
            <a href={publishedFixtureUrl(name)}>{name}</a> ·{" "}
            <a href={publishedFixtureUrl(name.replace(".srp", ".stdout"))}>expected stdout</a>
          </li>
        ))}
      </ul>
      <h2 id="reproducibility">Evidence and reproducibility</h2>
      <p>
        The two exact compiler source revisions, checked on an Ubuntu GitHub
        Actions runner, are:
      </p>
      <ul>
        {exampleCompatibility.versions.map(version => (
          <li key={version.tag}>
            {version.tag}:{" "}
            <a href={project.repo + "/commit/" + version.sourceCommit}>
              <code>{version.sourceCommit}</code>
            </a>
          </li>
        ))}
      </ul>
      <p>
        See the{" "}
        <a href={exampleCompatibility.workflow}>automated CI workflow and recent runs</a>,{" "}
        <a href={exampleCompatibility.sourceDirectory}>versioned fixture directory</a>,
        and <a href={project.websiteRepo + "/blob/main/scripts/test-examples.ts"}>test runner</a>.
        Future changes to examples or compiler versions must pass these
        checks before deployment.
      </p>
      <h2 id="limits">What these results do not prove</h2>
      <ul>
        <li>They do not exercise every language feature or source module.</li>
        <li>They run in Linux CI; separate compiler release packaging covers other platforms.</li>
        <li>They do not test GPU execution, native code generation, or a stable package ecosystem.</li>
        <li>They do not make prerelease syntax, manifests, or APIs stable.</li>
      </ul>
      <p>
        The site's historical documentation and example baseline remains{" "}
        <a href={project.release}>{project.tag}</a>. The separately published{" "}
        <a href={publishedCompiler.release}>{publishedCompiler.tag}</a> has also
        passed these three fixtures. Read <a href="/releases/">the release comparison</a>{" "}
        or <a href="/downloads/">download the version you intend to use</a>.
      </p>
    </Article>
  );
}
