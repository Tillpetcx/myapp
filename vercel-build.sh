#!/bin/bash
set -e

echo "========================================="
echo "🚀 Vercel Build Script Started"
echo "========================================="

branch="${VERCEL_GIT_COMMIT_REF:-unknown}"
env="${VERCEL_ENV:-preview}"
pull_request_id="${PULL_REQUEST_ID:-none}"

echo "📋 Environment Information:"
echo "   - Branch: $branch"
echo "   - Environment: $env"
echo "   - Pull Request: $pull_request_id"
echo "========================================="

detect_build_type() {
  if [[ "$env" == "production" && "$branch" == "main" ]]; then
    echo "production"
  elif [[ "$branch" == "dev" || "$branch" == "develop" ]]; then
    echo "preview"
  elif [[ "$branch" == "stage" || "$branch" == "staging" ]]; then
    echo "preview"
  elif [[ "$pull_request_id" != "none" ]]; then
    echo "preview"
  else
    echo "preview"
  fi
}

build_type=$(detect_build_type)

echo "🎯 Detected Build Type: $build_type"
echo "========================================="

case "$build_type" in
  "production")
    echo "🏭 Building for PRODUCTION environment"
    echo "   - Running: npm run build:prod"
    npm run build:prod
    echo "✅ Production build completed successfully"
    ;;
  "staging")
    echo "🧪 Building for STAGING environment"
    echo "   - Running: npx prisma generate && npm run build:staging"
    npx prisma generate && npm run build:staging
    echo "✅ Staging build completed successfully"
    ;;
  "preview")
    echo "👀 Building for PREVIEW environment"
    echo "   - Running: npm run build:preview"
    npx prisma generate && npm run build:dev
    echo "✅ Preview build completed successfully"
    ;;
  *)
    echo "❌ Unknown build type: $build_type"
    exit 1
    ;;
esac

echo "========================================="
echo "🎉 Build Script Finished Successfully!"
echo "========================================="