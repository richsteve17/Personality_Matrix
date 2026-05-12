export class ProviderError extends Error {
  constructor(provider, status, message, raw) {
    super(`[${provider}] ${status ?? "ERR"}: ${message}`);
    this.name = "ProviderError";
    this.provider = provider;
    this.status = status;
    this.raw = raw;
    this.retryable = status === 429 || (typeof status === "number" && status >= 500 && status < 600);
    this.auth = status === 401 || status === 403;
  }
}

export async function readErrorBody(res) {
  try {
    const text = await res.text();
    try {
      const j = JSON.parse(text);
      return j?.error?.message || j?.message || text.slice(0, 500);
    } catch {
      return text.slice(0, 500);
    }
  } catch {
    return res.statusText || "unknown error";
  }
}
