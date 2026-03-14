#!/bin/bash
set -e

branch="${VERCEL_GIT_COMMIT_REF:-unknown}"
env="${VERCEL_ENV:-preview}"

echo "Branch: $branch | Env: $env"

if [[ "$env" == "production" || "$branch" == "main" ]]; then
  npm ci && npm run build:prod
else
  npm ci && npx prisma generate && npm run build:staging   # 或根据分支细分
fi