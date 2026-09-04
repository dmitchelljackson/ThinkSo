import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', [
  'ls-files',
  '--cached',
  '--others',
  '--exclude-standard',
  '-z',
  '--',
  '*.md',
])
  .toString()
  .split('\0')
  .filter((file) => file && existsSync(file));
const problems = [];
const markdownLink = /!?\[[^\]]*\]\(([^)]+)\)/g;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(markdownLink)) {
    const target = match[1].trim().replace(/^<|>$/g, '').split(/[?#]/, 1)[0];
    if (!target || /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('#')) {
      continue;
    }
    if (!existsSync(resolve(dirname(file), target))) problems.push(`${file}: ${target}`);
  }
}

if (problems.length > 0) {
  console.error('Broken relative Markdown links:');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}
console.log(`Markdown relative-link check passed for ${files.length} Markdown file(s).`);
