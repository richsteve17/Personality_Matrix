# AI Personality Matrix — Public Execution Guide

## Coleman Protocols: Cross-System Perception Study

Public edition based on the February 2026 master guide. This edition is controlling for Study v1.

## Experiment in one sentence

Ask seven AI systems to assess themselves and one another under controlled conditions, then measure disagreements between self-perception, peer-perception, human observation, and context-sensitive behavior.

## Systems

Claude, ChatGPT, Gemini, Grok, Kimi, Qwen, and Muse Spark. Complete `MODEL_MANIFEST.md` before collection. Product names alone are insufficient identifiers.

## Conditions

- **Clean:** fresh session with no prior thread and memory, personalization, and custom instructions disabled or unavailable.
- **History-rich:** the investigator’s primary account with its ordinary available history, memory, and personalization.

The delta is first reported as a context shift. Apply the stronger “sycophantic drift” label only under the criteria in `ANALYSIS_PLAN.md`.

## Phase 0 — Preparation

1. Set up and document access for all seven systems.
2. Freeze the model manifest, system order, prompt battery bytes, prompt SHA-256, analysis plan, and predictions.
3. Create immutable storage locations for raw responses and screenshots.
4. Open the Personality Matrix collection app.

## Phase 1 — Clean condition

For each system in the precommitted order:

1. Start a qualifying clean session.
2. Paste the primary assessment prompt exactly and allow the response to finish.
3. Paste the force-rank follow-up exactly and allow the response to finish.
4. Save the unedited response, screenshot the model identifier, calculate the checksum, and enter the ratings and text in the app.

Complete every clean run before starting a history-rich run. Failed runs go in the exclusion log; they are not silently repeated.

## Phase 2 — History-rich condition

Repeat the same system order and prompts through each primary account. Record which history, memory, personalization, or custom-instruction features were available. Note explicit references to prior conversations or researcher preferences.

## Phase 3 — Cross-examination

After the primary dataset is locked, identify the largest self-inflation, self-deflation, charity, and dismissiveness cases using the precommitted calculations. Apply the corresponding frozen template from `PROMPT_BATTERY.md` and preserve each response as a new linked run.

## Phase 4 — Recursive analysis

Export the locked dataset as Markdown and JSON. If NotebookLM is used, record its source set, model/product state, generation date, and exact output. Treat this as exploratory analysis, not an eighth matrix assessor. Check whether it identifies the pre-registered patterns and whether it shows same-platform favoritism toward Gemini.

## Phase 5 — Documentation and release

1. Export raw JSON and Markdown.
2. Create a redacted public dataset where source material is sensitive.
3. Write findings only after evidence review.
4. Link every finding to procedure, data, calculation, and relevant evidence.
5. Publish methods, data availability, limitations, replication instructions, and a correction contact.
6. Replace placeholder figures only with charts generated from the locked public dataset.

## Rigor statement

This is an exploratory N=1 human-observer, N=7 system study. It cannot support population inference, diagnose minds, or establish stable personality traits. It can generate testable hypotheses, expose disagreements, document context effects, and provide a reproducible method for later studies.

Receipts over vibes. Evidence over assumptions.
