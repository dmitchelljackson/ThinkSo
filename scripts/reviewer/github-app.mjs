#!/usr/bin/env node

import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const apiBase = 'https://api.github.com';
const apiVersion = '2022-11-28';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function encode(value) {
  return Buffer.from(value).toString('base64url');
}

async function appJwt() {
  const appId = required('THINKSO_REVIEWER_APP_ID');
  const keyPath = required('THINKSO_REVIEWER_PRIVATE_KEY_PATH');
  const privateKey = await fs.readFile(keyPath, 'utf8');
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ iat: now - 60, exp: now + 540, iss: appId }));
  const unsigned = `${header}.${payload}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey, 'base64url');
  return `${unsigned}.${signature}`;
}

async function github(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': apiVersion,
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${JSON.stringify(parsed)}`);
  return parsed;
}

async function stdinText() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function installationToken(repo) {
  const installationId = required('THINKSO_REVIEWER_INSTALLATION_ID');
  const jwt = await appJwt();
  return github(`/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    token: jwt,
    body: { repositories: [repo.split('/')[1]] },
  }).then((result) => result.token);
}

function args() {
  const values = {};
  for (let index = 2; index < process.argv.length; index += 1) {
    const argument = process.argv[index];
    if (!argument.startsWith('--')) continue;
    const [key, inline] = argument.slice(2).split('=', 2);
    if (inline !== undefined) values[key] = inline;
    else if (key === 'body-stdin') values[key] = true;
    else values[key] = process.argv[++index];
  }
  return values;
}

const command = process.argv[2];
const options = args();
const repo = options.repo ?? required('THINKSO_REVIEWER_REPOSITORY');
const token = await installationToken(repo);

if (command === 'review') {
  const body =
    options['body-stdin'] === 'true' || options['body-stdin'] === true
      ? await stdinText()
      : await fs.readFile(required('THINKSO_REVIEWER_BODY_FILE'), 'utf8');
  const result = await github(`/repos/${repo}/pulls/${options.pr}/reviews`, {
    method: 'POST',
    token,
    body: { body, event: 'COMMENT', ...(options.commit ? { commit_id: options.commit } : {}) },
  });
  console.log(JSON.stringify({ id: result.id, html_url: result.html_url }));
} else if (command === 'pr') {
  const result = await github(`/repos/${repo}/pulls/${options.pr}`, { token });
  console.log(
    JSON.stringify({
      number: result.number,
      state: result.state,
      merged_at: result.merged_at,
      merge_commit: result.merge_commit_sha,
      head: result.head.sha,
    }),
  );
} else if (command === 'feedback-context') {
  const [pull, reviews, reviewComments, issueComments] = await Promise.all([
    github(`/repos/${repo}/pulls/${options.pr}`, { token }),
    github(`/repos/${repo}/pulls/${options.pr}/reviews?per_page=100`, { token }),
    github(`/repos/${repo}/pulls/${options.pr}/comments?per_page=100`, { token }),
    github(`/repos/${repo}/issues/${options.pr}/comments?per_page=100`, { token }),
  ]);
  console.log(
    JSON.stringify({
      pull,
      reviews,
      review_comments: reviewComments,
      issue_comments: issueComments,
    }),
  );
} else if (command === 'push-wiki') {
  if (process.env.THINKSO_REVIEWER_ALLOW_MAIN_PUSH !== '1') {
    throw new Error('Refusing wiki push without THINKSO_REVIEWER_ALLOW_MAIN_PUSH=1');
  }
  const status = spawnSync('git', ['status', '--porcelain=v1'], { encoding: 'utf8' });
  if (status.status !== 0) throw new Error(status.stderr || 'Unable to inspect git status');
  const changedPaths = status.stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3));
  if (changedPaths.some((value) => !value.startsWith('wiki/reviewer/'))) {
    throw new Error(
      `Refusing commit with changes outside wiki/reviewer: ${changedPaths.join(', ')}`,
    );
  }
  const add = spawnSync('git', ['add', '--', 'wiki/reviewer'], {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (add.status !== 0) throw new Error('Unable to stage reviewer knowledge');
  const staged = spawnSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' });
  const stagedPaths = staged.stdout.split('\n').filter(Boolean);
  if (!stagedPaths.length) {
    console.log(JSON.stringify({ committed: false, reason: 'no reviewer knowledge changes' }));
    process.exit(0);
  }
  if (stagedPaths.some((value) => !value.startsWith('wiki/reviewer/'))) {
    throw new Error(`Refusing staged path outside wiki/reviewer: ${stagedPaths.join(', ')}`);
  }
  const message =
    options.message ?? `docs(reviewer): learn from merged PR #${options.pr ?? 'unknown'}`;
  const commit = spawnSync('git', ['commit', '-m', message], {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (commit.status !== 0) throw new Error('Unable to create reviewer knowledge commit');

  const appToken = token;
  const temporaryDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thinkso-reviewer-'));
  const askpassPath = path.join(temporaryDir, 'askpass.sh');
  await fs.writeFile(askpassPath, '#!/bin/sh\nprintf "%s\\n" "$THINKSO_REVIEWER_GIT_TOKEN"\n', {
    mode: 0o700,
  });
  const push = spawnSync(
    'git',
    ['push', `https://x-access-token@github.com/${repo}.git`, `HEAD:${options.branch ?? 'main'}`],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        GIT_ASKPASS: askpassPath,
        GIT_TERMINAL_PROMPT: '0',
        THINKSO_REVIEWER_GIT_TOKEN: appToken,
      },
    },
  );
  await fs.rm(temporaryDir, { recursive: true, force: true });
  if (push.status !== 0) throw new Error('Unable to push reviewer knowledge commit');
  console.log(JSON.stringify({ committed: true, paths: stagedPaths }));
} else {
  throw new Error(
    'Usage: github-app.mjs review|pr|feedback-context --repo owner/name --pr number [--commit sha]',
  );
}
