# Research record

This directory separates plans, procedures, provenance, and eventual results so that the evidentiary status of each item is visible.

## Program structure

1. **Coleman Protocols** — the parent framework for auditing behavioral and relational claims made by commercial AI systems.
2. **Test Trials archive** — the private source archive and provenance record.
3. **Personality Matrix** — a companion instrument for mapping self-description, cross-system assessment, human observation, and context-sensitive behavior.
4. **Versioned releases** — frozen methods, data, findings, limitations, and replication materials.

## Current public status

| Item | Status | Evidentiary meaning |
|---|---|---|
| Coleman Protocols paper | Public | Framework and reported case-study claims |
| Claim ID registry | Public | Provenance metadata only |
| Full Test Trials archive | Private | Contains sensitive interaction records |
| Redacted evidence pack | Planned | Evaluation-ready excerpts with context and timestamps |
| Personality Matrix Study v1 | Pre-registered | No findings yet |

The five protocol articles are:

1. User Sovereignty and Interpretive Authority
2. Experiential Claim Protection
3. Adversarial Review and Falsification
4. Evidence Preservation and Provenance
5. Institutional Accountability and Remedy

Publication-ready standalone article texts and their version history are a planned separate release. The April 2026 paper is the current controlling public document.

## v1 files

- `PREREGISTRATION.md` — question, design, outcomes, exclusions, and stopping rule
- `MODEL_MANIFEST.md` — exact model and access metadata to freeze before collection
- `PROMPT_BATTERY.md` — canonical prompts; hash before first run
- `PREDICTIONS.md` — predictions recorded before final results
- `ANALYSIS_PLAN.md` — operational definitions and thresholds
- `DATA_DICTIONARY.md` — raw and derived field definitions
- `run-ledger.csv` — one row per executed prompt sequence
- `exclusions.csv` — all excluded or failed runs with reasons
- `CLAIM_ID_REGISTRY.csv` — provenance index from the paper
- `REDACTION_STANDARD.md` — public evidence-pack rules

## Release rule

Do not publish a finding unless it links to a frozen procedure, the relevant raw or redacted records, and the analysis used to derive it. Placeholder figures must not be presented as results.
