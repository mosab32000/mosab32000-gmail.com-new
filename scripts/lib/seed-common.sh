#!/usr/bin/env bash
set -euo pipefail

log_info() {
  printf '{"timestamp":"%s","level":"INFO","component":"seed-ai","message":"%s"}\n' "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$1"
}

verify_corpus_manifest() {
  local manifest_path="$1"
  if [[ ! -f "${manifest_path}" ]]; then
    printf '{"level":"ERROR","message":"Manifest file missing: %s"}\n' "${manifest_path}" >&2
    exit 1
  fi
  if grep -q '"copyrightedFullText": true' "${manifest_path}"; then
    printf '{"level":"ERROR","message":"Copyrighted full-text ingestion is strictly prohibited."}\n' >&2
    exit 1
  fi
}
