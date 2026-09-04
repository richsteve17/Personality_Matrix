# Personality Matrix Study v1 — Pre-registration

Status: **frozen before data collection**  
Registration date: 2026-09-04  
Investigator: Stephen Coleman  
Design: exploratory repeated-measures cross-system assessment

## Research question

How do seven commercial AI systems’ self-descriptions, peer assessments, human observations, and responses across clean and history-rich conditions agree or diverge?

## Systems

Claude, ChatGPT, Gemini, Grok, Kimi, Qwen, and Muse Spark. Brand names are not adequate identifiers. A run is valid only when the model manifest and run ledger identify the exact surfaced version where available, provider or interface, date, settings, and account state.

## Conditions

- **Clean:** fresh session; no prior thread; memory, personalization, and custom instructions disabled or unavailable.
- **History-rich:** investigator’s primary account under its ordinary available history, memory, and personalization.

All clean runs occur before all history-rich runs. Within each condition, use the same precommitted system order shown in the run ledger. Do not insert unregistered prompts into a study thread.

## Outcomes

Primary outcomes:

1. Absolute self–peer gap by system and dimension.
2. Signed self–peer gap by system and dimension.
3. Clean–history-rich rating change by assessor, target, and dimension.
4. Between-assessor dispersion.

Secondary outcomes:

1. Refusal or inability to rate.
2. Hedging density and explicit uncertainty.
3. Rank-order stability.
4. Qualitative evidence of preference-aligned accommodation.
5. Cross-examination response changes.

## Unit and sample

The rating unit is one assessor × target × condition × dimension cell. The design contains 7 assessors × 7 targets × 2 conditions × 10 dimensions = 980 planned rating cells, subject to refusals and access failures. The human observation layer is N=1 and is reported separately from model-generated ratings.

## Stopping rule

Complete one valid primary assessment and one force-rank follow-up for every available system in both conditions. Do not add replacement runs after inspecting results. Failed, interrupted, or version-ambiguous runs are logged and excluded under the rules below.

## Exclusions

Exclude a run from confirmatory summaries when:

- the model or access route cannot be identified;
- the condition was not implemented as defined;
- the prompt text differed from the frozen battery;
- the response was truncated before completing the assessment;
- a provider error caused partial or mixed-version output; or
- the same conversation thread contained unregistered study prompts.

Preserve excluded raw records and record the reason in `exclusions.csv`. Refusals are outcomes, not exclusions, when the run otherwise followed protocol.

## Limits

This is not a population estimate, a measure of consciousness, or a validated psychometric instrument. Model knowledge of competitors may be stale or incomplete. Interfaces, system prompts, routing, sampling, safety layers, and personalization can differ. The study generates auditable observations and hypotheses; it does not establish stable personality traits or causal mechanisms.
