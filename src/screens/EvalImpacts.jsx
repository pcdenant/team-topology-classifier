import { IMP } from "../data/questions";
import { BP, BS, BT, C, CARD } from "../styles";
import EvalHeader from "./EvalHeader";

export default function EvalImpacts({ team, others, teams, patch, onNext, onBack }) {
  return (
    <div>
      <EvalHeader title="Impacts" teamName={team.name} step={3} total={4} />
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
        Quelles équipes ont un impact sur la capacité de <b style={{ color: C.text }}>{team.name}</b> à livrer ?
      </p>
      {others.map(ot => {
        const oi = teams.indexOf(ot);
        const imp = team.deps?.[oi];
        const on = !!imp;
        const active = IMP.find(m => m.v === imp);
        return (
          <div key={oi} style={{ ...CARD, marginBottom: 10, background: on ? (active?.bg || C.creme) : C.white, transition: "background 0.15s" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              <input type="checkbox" checked={on} style={{ accentColor: C.vert, width: 16, height: 16 }}
                onChange={() => { const nd = { ...(team.deps || {}) }; if (on) delete nd[oi]; else nd[oi] = "ok"; patch({ deps: nd }); }} />
              {ot.name}
            </label>
            {on && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, marginLeft: 26 }}>
                {IMP.map(m => (
                  <button key={m.v} onClick={() => patch({ deps: { ...(team.deps || {}), [oi]: m.v } })}
                    style={{
                      ...BT, padding: "6px 16px",
                      background: imp === m.v ? m.bg : C.white,
                      borderColor: imp === m.v ? m.c : C.border,
                      color: imp === m.v ? m.c : C.textLight,
                      fontWeight: imp === m.v ? 700 : 500,
                    }}>
                    {m.l}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={BS} onClick={onBack}>← Bloc C</button>
        <button style={BP} onClick={onNext}>Résultats →</button>
      </div>
    </div>
  );
}
