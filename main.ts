// SPDX-License-Identifier: MIT
// Entry program for post-x-promote-make-your-own-bounty-01.
// Copies POST.json (the address of the X post that is the entry) from the
// repository root into the output directory make.fun provides.
// It writes nothing else, and it never deletes the output directory
// or anything inside it.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "POST.json");
if (!existsSync(source)) {
  throw new Error(`POST.json not found at ${source}`);
}

// Validate the file before copying: it must be JSON with a url string,
// so a broken POST.json fails here instead of being handed to the grader.
const parsed = JSON.parse(readFileSync(source, "utf8")) as unknown;
if (
  typeof parsed !== "object" ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== "string"
) {
  throw new Error("POST.json must be a JSON object with a string url field");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "POST.json"));
console.log(`Wrote POST.json to ${join(outputDir, "POST.json")}`);
