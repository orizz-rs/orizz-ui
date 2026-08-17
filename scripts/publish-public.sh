#!/usr/bin/env bash

set -Eeuo pipefail

ORIZZ_SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ORIZZ_REPOSITORY_ROOT="$(cd -- "${ORIZZ_SCRIPT_DIRECTORY}/.." && pwd)"
ORIZZ_REGISTRY_URL="https://registry.npmjs.org"

cd "${ORIZZ_REPOSITORY_ROOT}"

if ! command -v bun >/dev/null 2>&1; then
  printf 'Bun is required. Install it before publishing.\n' >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  printf 'Commit or stash all repository changes before publishing.\n' >&2
  exit 1
fi

ORIZZ_PACKAGE_NAME="$(
  bun -e 'const value = await Bun.file("package.json").json(); process.stdout.write(value.name)'
)"
ORIZZ_PACKAGE_VERSION="$(
  bun -e 'const value = await Bun.file("package.json").json(); process.stdout.write(value.version)'
)"

if [[ -z "${NPM_CONFIG_TOKEN:-}" ]]; then
  read -r -s -p 'npm granular access token: ' ORIZZ_NPM_PUBLISH_TOKEN
  printf '\n'

  if [[ -z "${ORIZZ_NPM_PUBLISH_TOKEN}" ]]; then
    printf 'An npm token is required.\n' >&2
    exit 1
  fi

  export NPM_CONFIG_TOKEN="${ORIZZ_NPM_PUBLISH_TOKEN}"
fi

cleanup_publish_credentials() {
  unset NPM_CONFIG_TOKEN ORIZZ_NPM_PUBLISH_TOKEN
}

trap cleanup_publish_credentials EXIT

printf 'Checking npm authentication...\n'
ORIZZ_NPM_USERNAME="$(bun pm whoami)"
printf 'Authenticated as %s.\n' "${ORIZZ_NPM_USERNAME}"

printf 'Validating %s@%s...\n' "${ORIZZ_PACKAGE_NAME}" "${ORIZZ_PACKAGE_VERSION}"
bun run prepublishOnly
bun run pack:check

printf 'Publishing %s@%s to public npm...\n' \
  "${ORIZZ_PACKAGE_NAME}" \
  "${ORIZZ_PACKAGE_VERSION}"
bun publish \
  --access public \
  --auth-type legacy \
  --registry "${ORIZZ_REGISTRY_URL}"

ORIZZ_LATEST_VERSION="$(
  bun info "${ORIZZ_PACKAGE_NAME}" version --registry "${ORIZZ_REGISTRY_URL}"
)"

if [[ "${ORIZZ_LATEST_VERSION}" != "${ORIZZ_PACKAGE_VERSION}" ]]; then
  printf 'Registry verification failed: expected %s but found %s.\n' \
    "${ORIZZ_PACKAGE_VERSION}" \
    "${ORIZZ_LATEST_VERSION}" >&2
  exit 1
fi

printf 'Published successfully. Install with: bun add %s\n' \
  "${ORIZZ_PACKAGE_NAME}"
