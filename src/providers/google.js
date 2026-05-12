import { ProviderError, readErrorBody } from "./errors.js";

export async function runChat({ messages, apiKey, model, endpointOverride, signal }) {
  if (!apiKey) throw new ProviderError("gemini", 401, "Missing Google API key");

  const systemText = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const contents = messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const base = (endpointOverride || "https://generativelanguage.googleapis.com").replace(/\/+$/, "");
  const url = `${base}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = { contents };
  if (systemText) body.systemInstruction = { parts: [{ text: systemText }] };

  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new ProviderError("gemini", 0, `Network error: ${e.message}`);
  }

  if (!res.ok) {
    const msg = await readErrorBody(res);
    throw new ProviderError("gemini", res.status, msg);
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || "")
    .join("");
  if (!text) throw new ProviderError("gemini", 0, "Empty response from Gemini", data);
  return { text, raw: data };
}
