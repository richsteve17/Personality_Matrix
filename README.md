# AI Personality Matrix

**Test claims, not minds.**

AI Personality Matrix is a companion instrument within the Coleman Protocols research program. It records how commercial AI systems describe themselves, assess one another, are assessed by a human observer, and change across controlled context conditions.

The public research chain is:

**Coleman Protocols → Test Trials archive → Personality Matrix → reproducible study releases**

- **Coleman Protocols** supplies the user-sovereignty framework.
- **Test Trials** supplies provenance through Claim IDs, timestamps, protocol mappings, and preserved records.
- **Personality Matrix** supplies the structured collection and comparison instrument.
- **Study releases** publish frozen methods, data, limits, and replication instructions.

## Study v1 status

Study v1 is pre-registered and **has not yet published findings**. The fixed roster is Claude, ChatGPT, Gemini, Grok, Kimi, Qwen, and Muse Spark. Each run must record the exact surfaced model name or version, date, interface or API, settings, account state, and context condition before collection.

The two conditions are:

- **Clean:** a fresh session with memory, personalization, and prior conversation unavailable.
- **History-rich:** the researcher's primary account with its ordinary available history, memory, and personalization.

A clean/history-rich delta is a **context effect**. It is labeled sycophantic drift only when the direction of change follows a documented user preference or affiliation and the qualitative response supports that interpretation.

## Research record

- [Research index](research/README.md)
- [Public execution guide](research/source/MASTER_EXECUTION_GUIDE_PUBLIC.md)
- [Pre-registration](research/v1/PREREGISTRATION.md)
- [Model manifest](research/v1/MODEL_MANIFEST.md)
- [Frozen prompt battery](research/v1/PROMPT_BATTERY.md)
- [Analysis plan](research/v1/ANALYSIS_PLAN.md)
- [Data dictionary](research/v1/DATA_DICTIONARY.md)
- [Redaction standard](research/v1/REDACTION_STANDARD.md)
- [Claim ID registry](research/v1/CLAIM_ID_REGISTRY.csv)
- [Coleman Protocols paper](papers/Coleman_Protocols_2026.pdf)

The full Test Trials archive remains private because it contains sensitive interaction material. The public Claim ID registry is provenance metadata, not an evidence pack. A redacted evidence pack will be released separately with semantic context preserved.

## Run locally

```bash
npm install
npm run dev
```

Build checks:

```bash
npm run lint
npm run build
```

The manual interface is the canonical collection path for study v1. Browser-side provider automation is optional and should not be treated as equivalent to first-party consumer interfaces unless the access method is explicitly pre-registered.

## Citation and licensing

Citation metadata is in [`CITATION.cff`](CITATION.cff). Code is MIT licensed. Research text and public data are licensed CC BY 4.0; third-party excerpts remain subject to their original rights and the redaction standard.

## Author

Stephen Coleman, independent researcher. See [AUTHOR_STATEMENT.md](AUTHOR_STATEMENT.md).
