import { runChat as runAnthropic } from "./anthropic.js";
import { runChat as runOpenAI } from "./openai.js";
import { runChat as runGoogle } from "./google.js";
import { runOaiCompat } from "./oaiCompat.js";
import { ProviderError } from "./errors.js";

export const PROVIDER_META = {
  claude: {
    label: "Claude (Anthropic)",
    defaultModel: "",
    defaultEndpoint: "https://api.anthropic.com",
    endpointEditable: false,
    keyRequired: true,
    corsNote: "Enter the exact model ID used for the frozen run.",
  },
  gpt: {
    label: "ChatGPT (OpenAI)",
    defaultModel: "",
    defaultEndpoint: "https://api.openai.com/v1",
    endpointEditable: false,
    keyRequired: true,
    corsNote: "Enter the exact model ID used for the frozen run.",
  },
  gemini: {
    label: "Gemini (Google)",
    defaultModel: "",
    defaultEndpoint: "https://generativelanguage.googleapis.com",
    endpointEditable: false,
    keyRequired: true,
    corsNote: "Enter the exact model ID used for the frozen run.",
  },
  grok: {
    label: "Grok (xAI)",
    defaultModel: "",
    defaultEndpoint: "https://api.x.ai/v1",
    endpointEditable: true,
    keyRequired: true,
    corsNote: "Enter the exact model ID; a proxy may be required for browser CORS.",
  },
  kimi: {
    label: "Kimi (Moonshot AI)",
    defaultModel: "",
    defaultEndpoint: "https://api.moonshot.ai/v1",
    endpointEditable: true,
    keyRequired: true,
    corsNote: "Enter the exact model ID; a proxy may be required for browser CORS.",
  },
  qwen: {
    label: "Qwen (Alibaba Cloud)",
    defaultModel: "",
    defaultEndpoint: "",
    endpointEditable: true,
    keyRequired: false,
    corsNote: "Manual first-party collection is canonical; optional automation requires an explicit compatible endpoint and model.",
  },
  muse: {
    label: "Muse Spark (Meta AI)",
    defaultModel: "",
    defaultEndpoint: "",
    endpointEditable: true,
    keyRequired: false,
    corsNote: "Collect manually in Meta AI unless an explicit compatible endpoint is documented.",
  },
};

export function isProviderConfigured(providerId, settings) {
  const meta = PROVIDER_META[providerId];
  const cfg = settings?.providers?.[providerId];
  if (!meta || !cfg) return false;
  if (meta.keyRequired && !cfg.apiKey) return false;
  if (!cfg.model && !meta.defaultModel) return false;
  if (!cfg.endpoint && !meta.defaultEndpoint) return false;
  return true;
}

export async function runChat({ provider, messages, settings, signal }) {
  const meta = PROVIDER_META[provider];
  if (!meta) throw new ProviderError(provider, 0, `Unknown provider: ${provider}`);
  const cfg = settings?.providers?.[provider] || {};
  const model = cfg.model || meta.defaultModel;
  const apiKey = cfg.apiKey || "";
  const endpointOverride = cfg.endpoint || "";

  const args = { messages, apiKey, model, endpointOverride, signal };

  switch (provider) {
    case "claude": return runAnthropic(args);
    case "gpt": return runOpenAI(args);
    case "gemini": return runGoogle(args);
    case "grok": return runOaiCompat("grok", meta.defaultEndpoint, args);
    case "kimi": return runOaiCompat("kimi", meta.defaultEndpoint, args);
    case "qwen": return runOaiCompat("qwen", meta.defaultEndpoint, args);
    case "muse": return runOaiCompat("muse", meta.defaultEndpoint, args);
    default: throw new ProviderError(provider, 0, `Unknown provider: ${provider}`);
  }
}

export { ProviderError };
