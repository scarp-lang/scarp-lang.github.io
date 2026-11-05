import Article from "../layouts/Article.tsx";
import CodeBlock from "../components/CodeBlock.tsx";
import { cliMilestones, cliMigrations, migrationEvidence } from "../data/migration.ts";
import { exampleCompatibility } from "../data/compatibility.ts";
import { publishedCompiler } from "../data/releases.ts";

export default function MigrationPage() {
  return (
    <Article
      title="Move to the current Scarp CLI."
      description="Version-by-version command guidance for published Scarp prereleases, with explicit differences between runtime checks and static verification."
      eyebrow="Published prereleases · CLI migration"
      date={publishedCompiler.reviewed}
    >
      <p>
        Migrating from an older Scarp alpha? First check the executable's version,
        then choose commands that exist in that exact published release.
        This guide compares published releases through{" "}
        <a href={publishedCompiler.release}>{publishedCompiler.tag}</a>.
        It is a documented command migration guide—not a promise that every
        program, manifest or Rust API works unchanged between versions.
      </p>

      <h2 id="release-matrix">Which commands shipped in each version?</h2>
      <div className="compat-table-wrap migration-table-wrap" role="region" aria-label="Published Scarp CLI release comparison" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th>Published release</th>
              <th>Execute file</th>
              <th>Check file</th>
              <th>New / notable capability</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {cliMilestones.map(item => (
              <tr key={item.tag}>
                <td>
                  <a href={item.evidence}>{item.tag}</a>
                  <small>{item.fixtureTested ? "3 website fixtures in current CI" : "Release-documented; not in current CI fixtures"}</small>
                </td>
                <td><code>{item.execution}</code></td>
                <td><code>{item.validation}</code></td>
                <td>{item.additional}</td>
                <td>
                  <a href={item.evidence}>Published release</a>
                  <small>
                    <a href={"https://github.com/scarp-lang/scarp/commit/" + item.sourceCommit}>
                      Source commit
                    </a>
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        "CI-tested" here means only the {exampleCompatibility.fixtureNames.length}{" "}
        <a href="/compatibility/#fixtures">website fixtures</a> passed their
        exact-output and version-specific validation checks under that version.
        Alpha.2 through alpha.5 entries are based on their published source
        and release history, <strong>not</strong> this website's current
        executable fixture tests. The alpha.4 fixtures passed in an earlier
        website CI run; the current suite tests the baseline and alpha.6.
      </p>

      <h2 id="commands">Translate old commands carefully</h2>
      <div className="compat-table-wrap" role="region" aria-label="Scarp command migration table" tabIndex={0}>
        <table>
          <thead><tr><th>Earlier command</th><th>Current command</th><th>Important difference</th></tr></thead>
          <tbody>
            {cliMigrations.map(item => (
              <tr key={item.id}>
                <td><code>{item.previous}</code></td>
                <td><code>{item.current}</code></td>
                <td>{item.meaning}{!item.equivalent && <small>Do not automatically substitute one for the other.</small>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>Check versus verify:</strong> legacy <code>check</code> evaluates
        selected runtime operations in fresh storage while suppressing printed
        output; <code>verify</code> performs static validation without executing
        ordinary runtime statements. For a runtime behavior test, execute the
        program and inspect its exit code and output instead. Do not assume a
        successful static verification guarantees successful runtime execution.
      </p>

      <h2 id="workflow">A safe file-to-project upgrade</h2>
      <ol>
        <li>
          Run <code>scarp --version</code> on the executable you intend to use.
          Keep the old binary available while checking programs against the{" "}
          <a href={publishedCompiler.release}>published prerelease</a>.
        </li>
        <li>
          If you are using alpha.1 or alpha.2, start with legacy{" "}
          <code>run</code> and <code>check</code> commands. For alpha.3 or
          later, prefer <code>exec</code> to run a file and{" "}
          <code>verify FILE.srp</code> for static checking.
        </li>
        <li>
          In alpha.4, create a <em>new</em> project directory;{" "}
          <code>create</code> refuses an already-existing destination. Review
          its <code>Scarp.project</code> manifest before moving existing
          source files into it.
        </li>
        <li>
          Use <code>verify PROJECT_DIRECTORY</code> to statically check its
          entrypoint, then <code>launch PROJECT_DIRECTORY</code> to actually
          execute it. Both commands require the explicit directory argument.
        </li>
      </ol>
      <h3 id="alpha4-example">Published alpha.4 project commands</h3>
      <CodeBlock filename="terminal" code={"scarp version\nscarp create hello-world\nscarp verify hello-world\nscarp launch hello-world"} />
      <p>
        These project commands were introduced in alpha.4 and remain available
        in {publishedCompiler.tag}; alpha.3 does not offer project-directory
        execution. Since alpha.5, you can additionally use{" "}
        <code>scarp inspect modules --json hello-world</code> to inspect
        the project's modules without running it. Since alpha.6, read-only{" "}
        <code>inspect symbols --json</code> and{" "}
        <code>inspect references --json</code> accept source files or explicit
        project directories. The manifest is experimental:
        there is no package registry, dependency lockfile or native{" "}
        <code>.srp</code> executable generator.
        Read the{" "}
        <a href={migrationEvidence.projectWorkflow}>release-pinned project workflow</a>{" "}
        and <a href={migrationEvidence.publishedSource}>CLI reference source</a>.
      </p>

      <h2 id="alpha6-navigation">Published alpha.6 symbol navigation</h2>
      <p>
        The latest prerelease adds opt-in static source indexing; neither
        command executes ordinary runtime statements. JSON schema-v1
        snapshots are compilation-local, not durable editor databases.
      </p>
      <CodeBlock filename="Terminal · alpha.6" code={"scarp inspect symbols --json hello-world\nscarp inspect references --json hello-world"} />
      <p>
        These commands are absent from alpha.5 binaries. Check{" "}
        <a href={migrationEvidence.publishedSource}>the release-pinned CLI reference</a>{" "}
        for exact options and errors; there is still no LSP or native{" "}
        <code>scarp compile</code> command.
      </p>
      <h2 id="what-to-retest">What needs testing after migration?</h2>
      <ul>
        <li>Program output, runtime failures and execution-budget behavior.</li>
        <li>Imports and filesystem paths, particularly inside a new project.</li>
        <li>Editor/CLI integrations that invoke the older command vocabulary.</li>
        <li>Syntax, manifest and embedding APIs: none have a stable v1 guarantee.</li>
      </ul>
      <p>
        The <a href="/compatibility/">compatibility evidence</a> names the
        exact three programs tested under the original baseline and{" "}
        {publishedCompiler.tag}. For binaries and checksums, use{" "}
        <a href="/downloads/">Downloads</a>. See the complete{" "}
        <a href="/releases/">release comparison</a> or{" "}
        <a href={migrationEvidence.publishedRelease}>official release notes</a>.
      </p>
    </Article>
  );
}
