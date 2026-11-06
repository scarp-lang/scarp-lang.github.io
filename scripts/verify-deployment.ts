import { publishedCompiler } from "../src/data/releases.ts";
import { waitForDeployment } from "./deployment-smoke-lib.ts";

const commit = process.env.GITHUB_SHA;
if (!commit) throw new Error("GITHUB_SHA is required; cannot verify an unknown deployed commit");
const attempt = await waitForDeployment(commit, publishedCompiler.tag);
console.log(`Live GitHub Pages is serving ${commit} and Scarp ${publishedCompiler.tag} (attempt ${attempt}).`);
