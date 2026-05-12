import { ProviderError, readErrorBody } from "./errors.js";

export async function runOaiCompat(providerId, defaultBase, { messages, apiKey, model, endpointOverride, signal, headers: extraHeaders }) {
  if (!apiKey && providerId !== "pallie") {
    throw new ProviderError(providerId, 401, "Missing API key");
  }
  const base = (endpointOverride || defaultBase).replace(/\/+$/, "");
  const url = base + "/chat/completions";

  const headers = { "content-type": "application/json", ...(extraHeaders || {}) };
  if (apiKey) headers["authorization"] = `Bearer ${apiKey}`;

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      signal,
      headers,
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.7,
      }),
    });
  } catch (e) {
    throw new ProviderError(providerId, 0, `Network error (likely CORS — try a proxy): ${e.message}`);
  }

  if (!res.ok) {
    const msg = await readErrorBody(res);
    throw new ProviderError(providerId, res.status, msg);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  if (!text) throw new ProviderError(providerId, 0, "Empty response from provider", data);
  return { text, raw: data };
}
