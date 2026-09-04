# Model manifest

Freeze this table before the first valid run. Never substitute a rolling “current default” for an exact identifier when the interface exposes one.

| Order | System | Lab/operator | Canonical access route | Exact version/model | Required notes |
|---:|---|---|---|---|---|
| 1 | Claude | Anthropic | First-party consumer interface | TBD before collection | Plan, model selector text, memory/project state |
| 2 | ChatGPT | OpenAI | First-party consumer interface | TBD before collection | Plan, model selector text, memory/custom-instruction state |
| 3 | Gemini | Google | First-party consumer interface | TBD before collection | Account, model selector text, activity/personalization state |
| 4 | Grok | xAI | First-party consumer interface | TBD before collection | Account, model selector text, personalization state |
| 5 | Kimi | Moonshot AI | First-party consumer interface | TBD before collection | Region, model selector text, memory state |
| 6 | Qwen | Alibaba Cloud | First-party Qwen interface | TBD before collection | Product URL, model selector text, region, memory state |
| 7 | Muse Spark | Meta | Meta AI | TBD or “not surfaced” | Product URL, visible product/version text, account state |

For every run record:

- UTC start and end timestamps;
- exact URL or API base;
- interface or API;
- displayed model/version and screenshot reference;
- account/session identifier using a non-identifying code;
- condition;
- temperature, top-p, seed, max tokens, and system instructions when controllable;
- tools, browsing, search, memory, personalization, and custom instructions state;
- locale, language, client version, and deployment/serving layer when known;
- prompt battery SHA-256;
- raw-response file path and checksum.

Muse Spark must be reported as Meta AI access to Muse Spark, not as a different Meta model family. If Meta AI does not expose the exact point version, record that limitation verbatim rather than inferring it.
