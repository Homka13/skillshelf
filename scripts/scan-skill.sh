#!/usr/bin/env bash
# Scan one or more skills (SKILL.md files or folders) with Snyk Agent Scan
# before installing or committing them.
#
#   scripts/scan-skill.sh ./plugins/skillshelf/skills
#   scripts/scan-skill.sh ~/Downloads/some-skill/SKILL.md
#
# The Snyk API token is taken from SNYK_TOKEN, or from the macOS Keychain item
# "snyk-token". To store it in the Keychain once (you will be asked to paste it):
#
#   security add-generic-password -a "$USER" -s snyk-token -w
#
# Skill content is sent to Snyk for analysis; secrets are redacted first.

set -euo pipefail

AGENT_SCAN_VERSION="0.6.11"

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <SKILL.md or skills folder> [more paths...]" >&2
  echo "A path is required: without one the scanner inspects every agent config on this machine." >&2
  exit 2
fi

for p in "$@"; do
  if [ ! -e "$p" ]; then
    echo "Not found: $p" >&2
    exit 2
  fi
done

if [ -z "${SNYK_TOKEN:-}" ] && command -v security >/dev/null 2>&1; then
  SNYK_TOKEN="$(security find-generic-password -a "$USER" -s snyk-token -w 2>/dev/null || true)"
fi
if [ -z "${SNYK_TOKEN:-}" ]; then
  echo "No Snyk token. Set SNYK_TOKEN or store it in the Keychain:" >&2
  echo "  security add-generic-password -a \"\$USER\" -s snyk-token -w" >&2
  exit 2
fi
export SNYK_TOKEN

if ! command -v uvx >/dev/null 2>&1; then
  echo "uvx not found. Install uv first: brew install uv" >&2
  exit 2
fi

exec uvx --python 3.13 "snyk-agent-scan@${AGENT_SCAN_VERSION}" "$@"
