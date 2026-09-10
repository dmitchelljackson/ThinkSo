#!/usr/bin/env node

import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const apiBase = 'https://api.github.com';
const apiVersion = '2022-11-28';

async function loadLocalConfig() {
  const configPath =
    process.env.THINKSO_REVIEWER_CONFIG_PATH ??
    path.join(os.homedir(), '.config', 'thinkso-local-reviewer', 'config.json');
  try {
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
    process.env.THINKSO_REVIEWER_APP_ID ??= String(config.app_id ?? '');
    process.env.THINKSO_REVIEWER_INSTALLATION_ID ??= String(config.installation_id ?? '');
    process.env.THINKSO_REVIEWER_PRIVATE_KEY_PATH ??= config.private_key_path;
    process.env.THINKSO_REVIEWER_REPOSITORY ??= config.repository;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

await loadLocalConfig();

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
      head_ref: result.head.ref,
      base: result.base.sha,
      base_ref: result.base.ref,
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
  const fetch = spawnSync('git', ['fetch', 'origin', 'main'], { encoding: 'utf8' });
  if (fetch.status !== 0) throw new Error(fetch.stderr || 'Unable to fetch origin/main');

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
  if (changedPaths.length) {
    const add = spawnSync('git', ['add', '--', 'wiki/reviewer'], {
      encoding: 'utf8',
      stdio: 'inherit',
    });
    if (add.status !== 0) throw new Error('Unable to stage reviewer knowledge');
  }
  const staged = spawnSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' });
  const stagedPaths = staged.stdout.split('\n').filter(Boolean);
  if (stagedPaths.some((value) => !value.startsWith('wiki/reviewer/'))) {
    throw new Error(`Refusing staged path outside wiki/reviewer: ${stagedPaths.join(', ')}`);
  }
  if (stagedPaths.length) {
    const message =
      options.message ?? `docs(reviewer): learn from merged PR #${options.pr ?? 'unknown'}`;
    const commit = spawnSync('git', ['commit', '-m', message], {
      encoding: 'utf8',
      stdio: 'inherit',
    });
    if (commit.status !== 0) throw new Error('Unable to create reviewer knowledge commit');
  }

  const ahead = spawnSync('git', ['log', '--format=', '--name-only', 'origin/main..HEAD'], {
    encoding: 'utf8',
  });
  if (ahead.status !== 0) throw new Error(ahead.stderr || 'Unable to inspect commits for main');
  const aheadPaths = [...new Set(ahead.stdout.split('\n').filter(Boolean))];
  if (aheadPaths.some((value) => !value.startsWith('wiki/reviewer/'))) {
    throw new Error(`Refusing commits outside wiki/reviewer: ${aheadPaths.join(', ')}`);
  }
  if (!aheadPaths.length) {
    console.log(JSON.stringify({ committed: false, reason: 'no reviewer knowledge changes' }));
    process.exit(0);
  }

  const ancestor = spawnSync('git', ['merge-base', '--is-ancestor', 'origin/main', 'HEAD']);
  if (ancestor.status !== 0) {
    const rebase = spawnSync('git', ['rebase', 'origin/main'], { stdio: 'inherit' });
    if (rebase.status !== 0) {
      throw new Error(
        'Rebase conflict: resolve only wiki/reviewer/** semantically, continue the rebase, then rerun push-wiki',
      );
    }
  }

  const appToken = token;
  const temporaryDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thinkso-reviewer-'));
  const askpassPath = path.join(temporaryDir, 'askpass.sh');
  await fs.writeFile(askpassPath, '#!/bin/sh\nprintf "%s\\n" "$THINKSO_REVIEWER_GIT_TOKEN"\n', {
    mode: 0o700,
  });
  const push = spawnSync(
    'git',
    ['push', `https://x-access-token@github.com/${repo}.git`, 'HEAD:main'],
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
