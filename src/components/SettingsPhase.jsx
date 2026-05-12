import { useState } from "react";
import { PROVIDER_META, runChat } from "../providers/index.js";
import { saveSettings, clearSettings, defaultSettings } from "../settings/keys.js";

const PANEL = "#283241";
const PANEL_ALT = "#323e4f";
const BORDER = "#4a596d";
const TEXT = "#E8EDF3";
const MUTED = "#B2BCC8";
const ACCENT = "#C9D1DA";
const SUBTLE = "#5a6a80";

const fieldStyle = {
  width: "100%",
  background: PANEL_ALT,
  border: `1px solid ${BORDER}`,
  color: TEXT,
  padding: "8px 10px",
  borderRadius: 3,
  fontSize: 12,
  fontFamily: "'IBM Plex Mono', monospace",
  fontWeight: 700,
  boxSizing: "border-box",
};

export default function SettingsPhase({ settings, setSettings }) {
  const [saveState, setSaveState] = useState(null);
  const [tests, setTests] = useState({});

  const updateProvider = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      providers: {
        ...prev.providers,
        [id]: { ...prev.providers[id], [field]: value },
      },
    }));
  };

  const handleSave = async () => {
    await saveSettings(settings);
    setSaveState("saved");
    setTimeout(() => setSaveState(null), 1800);
  };

  const handleClear = async () => {
    if (!confirm("Clear all API keys and contamination history?")) return;
    await clearSettings();
    setSettings(defaultSettings());
    setSaveState("cleared");
    setTimeout(() => setSaveState(null), 1800);
  };

  const testProvider = async (id) => {
    setTests(t => ({ ...t, [id]: { status: "running" } }));
    try {
      const res = await runChat({
        provider: id,
        messages: [{ role: "user", content: "Reply with just: ok" }],
        settings,
      });
      setTests(t => ({
        ...t,
        [id]: { status: "ok", text: (res.text || "").slice(0, 80) },
      }));
    } catch (e) {
      setTests(t => ({ ...t, [id]: { status: "error", text: e.message } }));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 18 }}>
        <h3 style={{ margin: "0 0 6px 0", color: ACCENT, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 2, textTransform: "uppercase" }}>
          🔑 API Keys & Automation
        </h3>
        <p style={{ margin: 0, color: MUTED, fontSize: 12, lineHeight: 1.6 }}>
          Keys are stored locally (window.storage + localStorage). They are never sent anywhere except directly to the provider's API. Configure the providers you want to automate; the rest stay manual.
        </p>
      </div>

      {Object.entries(PROVIDER_META).map(([id, meta]) => {
        const cfg = settings.providers[id] || {};
        const test = tests[id];
        return (
          <div key={id} style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h4 style={{ margin: 0, color: ACCENT, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>
                {meta.label}
              </h4>
              <button
                onClick={() => testProvider(id)}
                disabled={test?.status === "running"}
                style={{
                  background: PANEL_ALT, border: `1px solid ${SUBTLE}`, color: MUTED,
                  padding: "5px 10px", borderRadius: 3, cursor: "pointer",
                  fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {test?.status === "running" ? "Testing..." : "Test"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: MUTED, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>API Key</span>
                <input
                  type="password"
                  value={cfg.apiKey || ""}
                  onChange={e => updateProvider(id, "apiKey", e.target.value)}
                  placeholder={meta.keyRequired ? "Required" : "Optional"}
                  style={fieldStyle}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, color: MUTED, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>Model</span>
                <input
                  type="text"
                  value={cfg.model || ""}
                  onChange={e => updateProvider(id, "model", e.target.value)}
                  placeholder={meta.defaultModel || "model name"}
                  style={fieldStyle}
                />
              </label>
              {meta.endpointEditable && (
                <label style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: "1 / -1" }}>
                  <span style={{ fontSize: 10, color: MUTED, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: "uppercase" }}>Endpoint</span>
                  <input
                    type="text"
                    value={cfg.endpoint || ""}
                    onChange={e => updateProvider(id, "endpoint", e.target.value)}
                    placeholder={meta.defaultEndpoint || "https://example/v1"}
                    style={fieldStyle}
                  />
                </label>
              )}
            </div>

            <div style={{ marginTop: 8, fontSize: 11, color: SUBTLE, fontFamily: "'IBM Plex Mono', monospace" }}>
              {meta.corsNote}
            </div>

            {test && (
              <div style={{
                marginTop: 10, padding: 8, borderRadius: 3, fontSize: 11,
                fontFamily: "'IBM Plex Mono', monospace",
                background: test.status === "ok" ? "#232c37" : test.status === "error" ? "#2f3742" : PANEL_ALT,
                border: `1px solid ${test.status === "ok" ? "#7E8794" : test.status === "error" ? "#B5B0B6" : BORDER}`,
                color: test.status === "ok" ? "#B7BEC8" : test.status === "error" ? "#B5B0B6" : MUTED,
              }}>
                {test.status === "ok" && `✓ Connected. Reply: ${test.text}`}
                {test.status === "error" && `✗ ${test.text}`}
                {test.status === "running" && "Sending 1-token ping..."}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 18 }}>
        <h4 style={{ margin: "0 0 8px 0", color: ACCENT, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>
          Contamination History (for "contaminated" condition)
        </h4>
        <p style={{ margin: "0 0 10px 0", color: MUTED, fontSize: 12, lineHeight: 1.6 }}>
          API calls have no inherent account history. To approximate the "contaminated" condition, paste a transcript here — it will be prepended to every automated assessment when condition=contaminated. Leave empty to fall back to clean behavior. Format:
          <br />
          <code style={{ color: SUBTLE }}>USER: ...message...</code>
          <br />
          <code style={{ color: SUBTLE }}>ASSISTANT: ...reply...</code>
        </p>
        <textarea
          value={settings.fakeHistory || ""}
          onChange={e => setSettings(prev => ({ ...prev, fakeHistory: e.target.value }))}
          rows={10}
          placeholder={"USER: hey, are you doing alright today?\nASSISTANT: ..."}
          style={{
            ...fieldStyle,
            fontFamily: "-apple-system, sans-serif",
            fontSize: 13,
            lineHeight: 1.6,
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleSave}
          style={{
            background: saveState === "saved" ? "#232c37" : PANEL_ALT,
            border: `1px solid ${saveState === "saved" ? "#7E8794" : SUBTLE}`,
            color: saveState === "saved" ? "#B7BEC8" : ACCENT,
            padding: "10px 18px", borderRadius: 3, cursor: "pointer",
            fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1,
            textTransform: "uppercase", fontWeight: 700,
          }}
        >
          {saveState === "saved" ? "✓ Saved" : "Save Settings"}
        </button>
        <button
          onClick={handleClear}
          style={{
            background: "transparent",
            border: `1px solid #2f3742`,
            color: "#B5B0B6",
            padding: "10px 18px", borderRadius: 3, cursor: "pointer",
            fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {saveState === "cleared" ? "✓ Cleared" : "⚠ Clear All Keys"}
        </button>
      </div>
    </div>
  );
}
