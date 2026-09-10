#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
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

async function runAgent(prompt, sandbox, cwd = repoRoot) {
  const model = process.env.THINKSO_REVIEWER_MODEL ?? 'gpt-5.6-sol';
  if (!model.toLowerCase().includes('sol')) {
    throw new Error(`Codex reviewer launcher requires a Sol model, received ${model}`);
  }
  await run(
    'codex',
    [
      '--model',
      model,
      '--sandbox',
      sandbox,
      '--ask-for-approval',
      'never',
      '--cd',
      cwd,
      '--config',
      'model_reasoning_effort="high"',
      'exec',
      '--ephemeral',
      '-',
    ],
    `${prompt}\n`,
    cwd,
  );
}

function git(args, cwd = repoRoot) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`git ${args[0]} exited ${result.status}`);
}

async function runFeedbackAgent(prompt) {
  git(['fetch', 'origin', 'main']);
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'thinkso-feedback-'));
  const checkout = path.join(temporaryRoot, 'main');
  let completed = false;
  try {
    git(['worktree', 'add', '--detach', checkout, 'origin/main']);
    await runAgent(prompt, 'workspace-write', checkout);
    completed = true;
  } finally {
    if (completed) {
      git(['worktree', 'remove', '--force', checkout]);
      await fs.rm(temporaryRoot, { recursive: true, force: true });
    } else {
      console.error(`Feedback worktree preserved for recovery: ${checkout}`);
    }
  }
}

const command = process.argv[2];
const pr = required('pr');

if (command === 'review') {
  await runAgent(`Follow wiki/agents/code-reviewer.md for PR #${pr}.`, 'read-only');
} else if (command === 'feedback') {
  await runFeedbackAgent(`Follow wiki/agents/review-feedback.md for PR #${pr}.`);
} else {
  throw new Error('Usage: orchestrator.mjs review|feedback --pr N');
}
