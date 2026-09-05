import { existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const schema = 'services/api/openapi.json';
const generated = 'packages/api-client/src';
const untracked = execFileSync('git', [
  'ls-files',
  '--others',
  '--exclude-standard',
  '-z',
  '--',
  schema,
  generated,
])
  .toString()
  .split('\0')
  .filter(Boolean);
if (untracked.length > 0 && process.env.OPENAPI_ALLOW_UNTRACKED !== '1') {
  console.error(
    'OpenAPI generated output contains untracked files; commit generated output first.',
  );
  process.exit(1);
}
if (!existsSync(schema) || !existsSync(generated)) {
  console.log('SKIP OpenAPI drift: API schema and generated client are not present yet.');
  process.exit(0);
}

// T-010 supplies the canonical atomic generator command when the API exists.
const command = process.env.OPENAPI_GENERATE_COMMAND ?? 'pnpm openapi:generate';
const result = spawnSync(command, { shell: true, stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);
const diff = spawnSync('git', ['diff', '--exit-code', '--', schema, generated], {
  stdio: 'inherit',
});
process.exit(diff.status ?? 1);
