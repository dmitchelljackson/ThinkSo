import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const checks = [
  ['mobile', 'apps/mobile/jest.config.ts', ['pnpm', '--filter', '@thinkso/mobile', 'test']],
  [
    'API client',
    'packages/api-client/jest.config.ts',
    ['pnpm', '--filter', '@thinkso/api-client', 'test'],
  ],
];

let ran = false;
for (const [name, config, command] of checks) {
  if (!existsSync(config)) {
    console.log(`SKIP ${name} tests: ${config} is not present yet`);
    continue;
  }
  ran = true;
  const result = spawnSync(command[0], command.slice(1), { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (!ran) console.log('No JavaScript test projects are configured yet; no tests were run.');
