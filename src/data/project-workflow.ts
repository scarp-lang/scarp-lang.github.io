/** Exact alpha.8 test sources shown in the website guide and executed in CI. */
export const alpha8ProjectWorkflow = {
  releaseTag: "v0.0.6-alpha.8",
  additionSource: 'assert(2 + 3 == 5, "addition should produce five");\nprint("captured test output");\n',
  greetingSource: 'bind greeting = read_line();\nassert(greeting == "नमस्ते", "per-test input mismatch");\n',
  greetingInput: "नमस्ते\n",
  failureSource: 'assert(false, "intentional failure");\n',
} as const;
