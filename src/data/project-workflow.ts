/**
 * Copy-ready Scarp alpha.8 starter project, verified by the published compiler
 * in both website CI and GitHub Pages deployment. This is NOT alpha.1 syntax.
 */
export const alpha8ProjectWorkflow = {
  releaseTag: "v0.0.6-alpha.8",
  manifestSource: 'project "calculator" {\n    version: "0.1.0"\n    entry: "src/main.srp"\n    type: "application"\n    dependencies {}\n}\n',
  moduleSource: 'pub pure funcra add(left: integer, right: integer) -> integer {\n    return left + right;\n}\n',
  mainSource: 'import "math.srp" as math;\nprint(math.add(20, 22));\n',
  expectedMainStdout: "42\n",
  additionSource: 'import "../src/math.srp" as math;\nassert(math.add(2, 3) == 5, "addition should produce five");\nprint("captured test output");\n',
  greetingSource: 'bind greeting = read_line();\nassert(greeting == "नमस्ते", "per-test input mismatch");\n',
  greetingInput: "नमस्ते\n",
  failureSource: 'assert(false, "intentional failure");\n',
} as const;
