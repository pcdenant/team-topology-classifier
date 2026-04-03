import { IMP } from "../data/questions";
import { W, BP, BS, BT, CD } from "../styles";
import EvalHeader from "./EvalHeader";

export default function EvalImpacts({ team, others, teams, patch, onNext, onBack }) {
  return (
    <div style={W}>
      <EvalHeader title="Impacts" teamName={team.name} />
      <p style={{ fontSize: 14, color: "#555", marginBottom: 14 }}>Quelles équipes ont un impact sur la capacité de <b>{team.name}</b> à livrer ?</p>
      {others.map(ot => {
        const oi = teams.indexOf(ot);
        const imp = team.deps?.[oi];
        const on = !!imp;
        return (
          <div key={oi} style={{ ...CD, background: on ? (IMP.find(m => m.v === imp)?.bg || "#f8fafc") : "#fff" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              <input type="checkbox" checked={on} onChange={() => {
                const nd = { ...(team.deps || {}) };
                if (on) delete nd[oi]; else nd[oi] = "ok";
                patch({ deps: nd });
              }} />{ot.name}
            </label>
            {on && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, marginLeft: 28 }}>
                {IMP.map(m => (
                  <button key={m.v} onClick={() => patch({ deps: { ...(team.deps || {}), [oi]: m.v } })}
                    style={{ ...BT, background: imp === m.v ? m.bg : "#fff", borderColor: imp === m.v ? m.c : "#ddd", color: imp === m.v ? m.c : "#888", fontWeight: imp === m.v ? 600 : 400 }}>
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
