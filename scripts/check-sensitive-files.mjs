import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', 'node_modules', 'coverage']);
const forbiddenExtensions = new Set(['.key', '.pem', '.p12', '.pfx', '.sql', '.sqlite', '.sqlite3']);
const forbiddenNames = new Set(['.env', '.npmrc']);
const sensitivePatterns = [
  /-----BEGIN (?:OPENSSH|RSA|EC)? ?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\b(?:password|secret|token)\s*[:=]\s*["'][^"']{8,}["']/i,
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const findings = [];
for (const path of walk(root)) {
  const name = path.split(/[\\/]/).at(-1);
  const projectPath = relative(root, path).replaceAll('\\', '/');
  if (forbiddenNames.has(name) || forbiddenExtensions.has(extname(name))) {
    findings.push(`${projectPath}: forbidden file type`);
    continue;
  }
  if (statSync(path).size > 1_000_000) continue;
  const content = readFileSync(path, 'utf8');
  if (sensitivePatterns.some((pattern) => pattern.test(content))) {
    findings.push(`${projectPath}: sensitive-looking content`);
  }
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('Sensitive-content check passed.');
