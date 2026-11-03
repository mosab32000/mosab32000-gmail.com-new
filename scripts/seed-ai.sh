#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/lib/seed-common.sh
source "${SCRIPT_DIR}/lib/seed-common.sh"

log_info "Starting Jordan Edu AI Platform Authorized Corpus Seeding..."
verify_corpus_manifest "${SCRIPT_DIR}/../data/ai/corpus/manifest.example.json"
log_info "Corpus manifest license & Jordan residency metadata verified successfully."
