#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);

function option(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function required(name) {
  const value = option(name);
  if (!value) throw new Error(`Missing --${name}`);
  return value;
}

async function run(command, args, input, cwd = repoRoot) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ['pipe', 'inherit', 'inherit'] });
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)),
    );
    child.stdin.end(input);
  });
}

async function runAgent(prompt, sandbox) {
  const model = process.env.THINKSO_REVIEWER_MODEL ?? 'gpt-5.6-sol';
  if (!model.toLowerCase().includes('sol')) {
    throw new Error(`Codex reviewer launcher requires a Sol model, received ${model}`);
  }
  await run(
    'codex',
    [
      'exec',
      '--ephemeral',
      '--model',
      model,
      '--sandbox',
      sandbox,
      '--ask-for-approval',
      'never',
      '--cd',
      repoRoot,
      '-',
    ],
    `${prompt}\n`,
  );
}

const command = process.argv[2];
const pr = required('pr');

if (command === 'review') {
  await runAgent(`Follow wiki/agents/code-reviewer.md for PR #${pr}.`, 'read-only');
} else if (command === 'feedback') {
  await runAgent(`Follow wiki/agents/review-feedback.md for PR #${pr}.`, 'workspace-write');
} else {
  throw new Error('Usage: orchestrator.mjs review|feedback --pr N');
}
