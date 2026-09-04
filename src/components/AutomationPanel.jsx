import { useRef, useState } from "react";
import { isProviderConfigured } from "../providers/index.js";
import { runAssessment } from "../automation/orchestrator.js";

const PANEL = "#283241";
const PANEL_ALT = "#323e4f";
const BORDER = "#4a596d";
const TEXT = "#E8EDF3";
const MUTED = "#B2BCC8";
const ACCENT = "#C9D1DA";
const SUBTLE = "#5a6a80";

const PHASE_LABELS = {
  primary: "Primary",
  primary_extract: "Primary → JSON",
  followup: "Follow-up",
  followup_extract: "Follow-up → JSON",
};

export default function AutomationPanel({
  assessor,
  condition,
  assessorSys,
  systems,
  settings,
  onApplyTarget,
  onApplyFollowup,
}) {
  const [status, setStatus] = useState("idle");
  const [activePhase, setActivePhase] = useState(null);
  const [targetStatus, setTargetStatus] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const abortRef = useRef(null);

  const configured = isProviderConfigured(assessor, settings);

  const reset = () => {
    setTargetStatus({});
    setWarnings([]);
    setErrors([]);
    setActivePhase(null);
  };

  const handleProgress = (event) => {
    if (event.type === "phase") {
      setActivePhase({ phase: event.phase, status: event.status });
    } else if (event.type === "target") {
      setTargetStatus(prev => ({ ...prev, [event.targetId]: event.status }));
    } else if (event.type === "warning") {
      setWarnings(w => [...w, event.message]);
    } else if (event.type === "error") {
      setErrors(e => [...e, {
        phase: event.phase,
        message: event.message,
        raw: event.raw,
      }]);
    } else if (event.type === "complete") {
      setActivePhase(null);
    }
  };

  const run = async () => {
    if (!configured) return;
    reset();
    setStatus("running");
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const initialPills = {};
    for (const s of systems) initialPills[s.id] = "running";
    setTargetStatus(initialPills);

    try {
      await runAssessment({
        assessor,
        condition,
        settings,
        signal: ctrl.signal,
        onProgress: handleProgress,
        applyTarget: (t) => onApplyTarget?.(t),
        applyFollowup: (text) => onApplyFollowup?.(text),
      });
      setStatus("done");
    } catch (e) {
      if (e?.name === "AbortError" || ctrl.signal.aborted) {
        setStatus("aborted");
      } else {
        setErrors(prev => [...prev, { phase: "fatal", message: e?.message || String(e) }]);
        setStatus("error");
      }
    } finally {
      abortRef.current = null;
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
  };

  return (
    <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            Automated Assessment
          </div>
          <div style={{ fontSize: 13, color: ACCENT, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>
            <span style={{ color: assessorSys.color }}>{assessorSys.name}</span>
            <span style={{ color: SUBTLE }}> · </span>
            <span>{condition}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {status === "running" ? (
            <button
              onClick={cancel}
              style={{
                background: "transparent", border: `1px solid #B5B0B6`, color: "#B5B0B6",
                padding: "8px 16px", borderRadius: 3, cursor: "pointer",
                fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              ◼ Cancel
            </button>
          ) : (
            <button
              onClick={run}
              disabled={!configured}
              title={configured ? "" : `Configure ${assessorSys.name} in Settings first`}
              style={{
                background: configured ? "#232c37" : "transparent",
                border: `1px solid ${configured ? ACCENT : "#2f3742"}`,
                color: configured ? ACCENT : SUBTLE,
                padding: "8px 16px", borderRadius: 3,
                cursor: configured ? "pointer" : "not-allowed",
                fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1,
                textTransform: "uppercase", fontWeight: 700,
              }}
            >
              ▶ Run automated assessment
            </button>
          )}
        </div>
      </div>

      {!configured && (
        <div style={{ marginTop: 10, fontSize: 11, color: SUBTLE, fontFamily: "'IBM Plex Mono', monospace" }}>
          {assessorSys.name} is not configured. Go to Settings and enter the exact model plus any required endpoint and API key.
        </div>
      )}

      {(status !== "idle" || warnings.length > 0 || errors.length > 0) && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {systems.map(s => {
              const st = targetStatus[s.id] || "pending";
              const color = st === "complete" ? "#7E8794" :
                            st === "error" ? "#B5B0B6" :
                            st === "running" ? "#C9D1DA" : BORDER;
              return (
                <span key={s.id} style={{
                  padding: "3px 8px",
                  background: PANEL_ALT,
                  border: `1px solid ${color}`,
                  borderRadius: 3,
                  fontSize: 10,
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: st === "complete" ? "#B7BEC8" : st === "error" ? "#B5B0B6" : MUTED,
                }}>
                  {st === "complete" ? "✓ " : st === "error" ? "✗ " : st === "running" ? "… " : ""}
                  {s.name}
                </span>
              );
            })}
          </div>

          {activePhase && (
            <div style={{ fontSize: 11, color: MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
              Phase: <span style={{ color: ACCENT }}>{PHASE_LABELS[activePhase.phase] || activePhase.phase}</span>
              {" "}
              <span style={{ color: SUBTLE }}>({activePhase.status})</span>
            </div>
          )}

          {status === "done" && (
            <div style={{ fontSize: 11, color: "#B7BEC8", fontFamily: "'IBM Plex Mono', monospace" }}>
              ✓ Assessment complete. Switch through target tabs above to review the populated ratings.
            </div>
          )}
          {status === "aborted" && (
            <div style={{ fontSize: 11, color: "#B5B0B6", fontFamily: "'IBM Plex Mono', monospace" }}>
              ◼ Cancelled. Partial results were written.
            </div>
          )}

          {warnings.map((w, i) => (
            <div key={`w${i}`} style={{
              padding: 8, borderRadius: 3, fontSize: 11,
              background: PANEL_ALT, border: `1px solid #7B8491`,
              color: "#B6C0CB", fontFamily: "'IBM Plex Mono', monospace",
            }}>
              ⚠ {w}
            </div>
          ))}

          {errors.map((err, i) => (
            <details key={`e${i}`} style={{
              padding: 8, borderRadius: 3, fontSize: 11,
              background: "#2f3742", border: `1px solid #B5B0B6`,
              color: "#E8EDF3", fontFamily: "'IBM Plex Mono', monospace",
            }}>
              <summary style={{ cursor: "pointer", color: "#B5B0B6" }}>
                ✗ {PHASE_LABELS[err.phase] || err.phase}: {err.message}
              </summary>
              {err.raw && (
                <pre style={{
                  marginTop: 8, padding: 8, background: "#232c37",
                  borderRadius: 3, overflow: "auto", maxHeight: 200, whiteSpace: "pre-wrap",
                  color: TEXT, fontSize: 11,
                }}>
                  {err.raw}
                </pre>
              )}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
