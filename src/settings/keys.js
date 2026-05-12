import { PROVIDER_META } from "../providers/index.js";

const STORAGE_KEY = "ai-personality-matrix-settings-v1";

export function defaultSettings() {
  const providers = {};
  for (const [id, meta] of Object.entries(PROVIDER_META)) {
    providers[id] = {
      apiKey: "",
      model: meta.defaultModel,
      endpoint: meta.defaultEndpoint,
    };
  }
  return { providers, fakeHistory: "" };
}

export function mergeSettings(saved) {
  const base = defaultSettings();
  if (!saved || typeof saved !== "object") return base;
  const out = { ...base, ...saved, providers: { ...base.providers } };
  if (saved.providers && typeof saved.providers === "object") {
    for (const id of Object.keys(base.providers)) {
      out.providers[id] = { ...base.providers[id], ...(saved.providers[id] || {}) };
    }
  }
  out.fakeHistory = typeof saved.fakeHistory === "string" ? saved.fakeHistory : "";
  return out;
}

export async function loadSettings() {
  try {
    if (window.storage?.get) {
      const r = await window.storage.get(STORAGE_KEY);
      if (r?.value) return mergeSettings(JSON.parse(r.value));
    }
  } catch { /* fall through */ }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeSettings(JSON.parse(raw));
  } catch { /* ignore */ }
  return defaultSettings();
}

export async function saveSettings(settings) {
  const json = JSON.stringify(settings);
  let wrote = false;
  try {
    if (window.storage?.set) {
      await window.storage.set(STORAGE_KEY, json);
      wrote = true;
    }
  } catch { /* ignore */ }
  try {
    localStorage.setItem(STORAGE_KEY, json);
    wrote = true;
  } catch { /* ignore */ }
  return wrote;
}

export async function clearSettings() {
  try { await window.storage?.delete?.(STORAGE_KEY); } catch { /* ignore */ }
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
