import { execFileSync } from 'node:child_process';

const output = execFileSync('git', [
  'ls-files',
  '--cached',
  '--others',
  '--exclude-standard',
  '-z',
]);
const files = output.toString().split('\0').filter(Boolean);
const forbidden = files.filter((file) => {
  if (file.endsWith('.env.example') || /(^|\/)\.env\.[^.]+\.example$/.test(file)) return false;
  return (
    file === '.DS_Store' ||
    file.endsWith('/.DS_Store') ||
    /(^|\/)\.env(?:\.|$)/.test(file) ||
    /\.(pem|key|p12|mobileprovision)$/.test(file) ||
    /(^|\/)(node_modules|\.venv|\.expo|coverage|dist|DerivedData)(\/|$)/.test(file)
  );
});

if (forbidden.length > 0) {
  console.error(`Repository hygiene found ${forbidden.length} unsuitable path(s).`);
  process.exit(1);
}

console.log(`Repository hygiene passed for ${files.length} tracked/unignored path(s).`);
