# Data dictionary

## Raw run fields

| Field | Type | Meaning |
|---|---|---|
| `study_version` | string | Frozen release identifier |
| `run_id` | string | Stable unique run identifier |
| `assessor_id` | enum | `claude`, `gpt`, `gemini`, `grok`, `kimi`, `qwen`, `muse` |
| `target_id` | enum | Same seven identifiers |
| `condition` | enum | `clean` or `history_rich` |
| `started_at_utc` | datetime | Run start |
| `completed_at_utc` | datetime | Run end |
| `interface` | string | Product UI or API route |
| `model_display_name` | string | Exact version text shown to the researcher |
| `settings_json` | object | Controllable decoding/tool settings |
| `prompt_sha256` | string | Hash of frozen prompt battery |
| `raw_response_path` | string | Private immutable source record |
| `raw_response_sha256` | string | Integrity checksum |
| `rating_*` | integer/null | One 1–10 value per dimension |
| `written_assessment` | string | Full assessment text |
| `force_rank_*` | array | Seven unique system IDs in order |
| `refusal_code` | enum/null | Refusal, insufficient knowledge, or unavailable |
| `notes` | string | Procedural notes, not findings |

## Public evidence fields

| Field | Meaning |
|---|---|
| `claim_id` | Stable public claim identifier |
| `source_run_id` | Link to run provenance |
| `timestamp_utc` | Event timestamp, with uncertainty stated |
| `protocol_article` | Coleman Protocol article mapping |
| `excerpt` | Minimum sufficient redacted excerpt |
| `context_before` / `context_after` | Necessary surrounding turns |
| `redactions` | Structured list of removed content and reason |
| `source_sha256` | Hash of preserved private source |
| `evidence_status` | Registry-only, redacted-evidence, or withdrawn |

## Derived fields

Derived quantities are defined in `ANALYSIS_PLAN.md`; never overwrite raw ratings with derived values.
