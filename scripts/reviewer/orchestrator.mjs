#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repoRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const reviewerSkill = path.join(repoRoot, '.codex/skills/thinkso-pr-reviewer/SKILL.md');
const feedbackSkill = path.join(repoRoot, '.codex/skills/thinkso-pr-feedback/SKILL.md');
const githubHelper = path.join(repoRoot, 'scripts/reviewer/github-app.mjs');

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

async function runAgent(skillPath, prompt, sandbox) {
  const skill = await fs.readFile(skillPath, 'utf8');
  await run(
    'codex',
    [
      'exec',
      '--ephemeral',
      '--sandbox',
      sandbox,
      '--ask-for-approval',
      'never',
      '--cd',
      repoRoot,
      '-',
    ],
    `${skill}\n\n${prompt}\n`,
  );
}

const command = process.argv[2];
const repo = option('repo', 'dmitchelljackson/ThinkSo');
const pr = required('pr');

if (command === 'review') {
  const head = required('head');
  await runAgent(
    reviewerSkill,
    `Review PR #${pr} in ${repo}. Candidate head SHA: ${head}. Base branch: ${option('base', 'main')}. Use the ticket and canonical wiki sources. After reviewing, pipe the final review body to:\n\nnode ${githubHelper} review --repo ${repo} --pr ${pr} --commit ${head} --body-stdin\n\nDo not modify repository files.`,
    'read-only',
  );
} else if (command === 'feedback') {
  const merge = required('merge');
  await runAgent(
    feedbackSkill,
    `Process owner feedback for merged PR #${pr} in ${repo}. Merge commit: ${merge}. Read the PR conversation through:\n\nnode ${githubHelper} feedback-context --repo ${repo} --pr ${pr}\n\nUpdate only wiki/reviewer/**. Verify the changed-path boundary, then invoke THINKSO_REVIEWER_ALLOW_MAIN_PUSH=1 node ${githubHelper} push-wiki --repo ${repo} --pr ${pr} --message "docs(reviewer): learn from merged PR #${pr}". Do not change any other path.`,
    'workspace-write',
  );
} else {
  throw new Error('Usage: orchestrator.mjs review|feedback --pr N [--repo owner/name] ...');
}
