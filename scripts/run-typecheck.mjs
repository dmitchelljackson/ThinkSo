import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [
  ['mobile', 'apps/mobile/tsconfig.json', ['pnpm', '--filter', '@thinkso/mobile', 'typecheck']],
  [
    'API client',
    'packages/api-client/tsconfig.json',
    ['pnpm', '--filter', '@thinkso/api-client', 'typecheck'],
  ],
];

let ran = false;
for (const [name, config, command] of checks) {
  if (!existsSync(config)) {
    console.log(`SKIP ${name} typecheck: ${config} is not present yet`);
    continue;
  }
  ran = true;
  const result = spawnSync(command[0], command.slice(1), { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (!ran) console.log('No TypeScript projects are configured yet; no typechecks were run.');
