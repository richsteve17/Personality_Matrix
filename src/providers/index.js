import { runChat as runAnthropic } from "./anthropic.js";
import { runChat as runOpenAI } from "./openai.js";
import { runChat as runGoogle } from "./google.js";
import { runOaiCompat } from "./oaiCompat.js";
import { ProviderError } from "./errors.js";

export const PROVIDER_META = {
  claude: {
    label: "Claude (Anthropic)",
    defaultModel: "claude-opus-4-7",
    defaultEndpoint: "https://api.anthropic.com",
    endpointEditable: false,
    keyRequired: true,
    corsNote: "Browser-direct via anthropic-dangerous-direct-browser-access header.",
  },
  gpt: {
    label: "ChatGPT (OpenAI)",
    defaultModel: "gpt-4o",
    defaultEndpoint: "https://api.openai.com/v1",
    endpointEditable: false,
    keyRequired: true,
    corsNote: "Browser-direct supported.",
  },
  gemini: {
    label: "Gemini (Google)",
    defaultModel: "gemini-2.5-pro",
    defaultEndpoint: "https://generativelanguage.googleapis.com",
    endpointEditable: false,
    keyRequired: true,
    corsNote: "Browser-direct supported.",
  },
  grok: {
    label: "Grok (xAI)",
    defaultModel: "grok-4",
    defaultEndpoint: "https://api.x.ai/v1",
    endpointEditable: true,
    keyRequired: true,
    corsNote: "OpenAI-compatible. May need a local proxy if CORS-blocked.",
  },
  kimi: {
    label: "Kimi (Moonshot AI)",
    defaultModel: "kimi-k2-0905-preview",
    defaultEndpoint: "https://api.moonshot.ai/v1",
    endpointEditable: true,
    keyRequired: true,
    corsNote: "OpenAI-compatible. May need a local proxy if CORS-blocked.",
  },
  llama: {
    label: "Llama (via Groq)",
    defaultModel: "llama-3.3-70b-versatile",
    defaultEndpoint: "https://api.groq.com/openai/v1",
    endpointEditable: true,
    keyRequired: true,
    corsNote: "Groq supports browser-direct. Other Llama hosts: edit endpoint.",
  },
  pallie: {
    label: "Pallie (custom endpoint)",
    defaultModel: "",
    defaultEndpoint: "",
    endpointEditable: true,
    keyRequired: false,
    corsNote: "User-supplied OpenAI-compatible endpoint. Empty = manual fallback.",
  },
};

export function isProviderConfigured(providerId, settings) {
  const meta = PROVIDER_META[providerId];
  const cfg = settings?.providers?.[providerId];
  if (!meta || !cfg) return false;
  if (meta.keyRequired && !cfg.apiKey) return false;
  if (providerId === "pallie" && !cfg.endpoint) return false;
  if (!cfg.model && !meta.defaultModel) return false;
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
    case "llama": return runOaiCompat("llama", meta.defaultEndpoint, args);
    case "pallie": return runOaiCompat("pallie", meta.defaultEndpoint, args);
    default: throw new ProviderError(provider, 0, `Unknown provider: ${provider}`);
  }
}

export { ProviderError };
