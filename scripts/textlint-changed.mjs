import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const baseline = JSON.parse(await readFile(path.join(root, ".textlint-baseline.json"), "utf8"));
const base = process.env.TEXTLINT_BASE_SHA;
const git = spawnSync(
  "git",
  base
    ? ["diff", "--name-only", "--diff-filter=ACMRT", `${base}...HEAD`, "--", "src/content/posts"]
    : ["status", "--porcelain", "--untracked-files=all", "src/content/posts"],
  { cwd: root, encoding: "utf8" },
);

if (git.status !== 0) {
  console.error(git.stderr);
  process.exit(git.status ?? 1);
}

const candidates = git.stdout
  .split("\n")
  .map((line) => {
    if (base) return line;
    const status = line.slice(0, 2);
    if (status.includes("D")) return "";
    const file = line.slice(3);
    return file.includes(" -> ") ? file.split(" -> ").at(-1) : file;
  })
  .filter((file) => file.endsWith(".mdx"));
const changed = [];

for (const file of candidates) {
  const source = await readFile(path.join(root, file));
  const hash = createHash("sha256").update(source).digest("hex");
  if (baseline[file] !== hash) changed.push(file);
}

if (changed.length === 0) {
  console.log("No new or modified articles require textlint.");
  process.exit(0);
}

console.log(`Running textlint on ${changed.length} article(s).`);
const result = spawnSync(
  path.join(root, "node_modules", ".bin", "textlint"),
  ["--format", "pretty-error", ...changed],
  { cwd: root, stdio: "inherit" },
);
process.exit(result.status ?? 1);
