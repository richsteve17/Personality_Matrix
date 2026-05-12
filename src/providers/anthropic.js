import { ProviderError, readErrorBody } from "./errors.js";

export async function runChat({ messages, apiKey, model, endpointOverride, signal }) {
  if (!apiKey) throw new ProviderError("claude", 401, "Missing Anthropic API key");

  const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n") || undefined;
  const turns = messages
    .filter(m => m.role !== "system")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

  const url = (endpointOverride || "https://api.anthropic.com") + "/v1/messages";
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system,
        messages: turns,
      }),
    });
  } catch (e) {
    throw new ProviderError("claude", 0, `Network error (CORS or offline): ${e.message}`);
  }

  if (!res.ok) {
    const msg = await readErrorBody(res);
    throw new ProviderError("claude", res.status, msg);
  }

  const data = await res.json();
  const text = (data?.content || []).filter(c => c.type === "text").map(c => c.text).join("");
  if (!text) throw new ProviderError("claude", 0, "Empty response from Anthropic", data);
  return { text, raw: data };
}
