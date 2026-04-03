import { C1O, C3O } from "../data/questions";
import { W, BP, BS, UP } from "../styles";
import EvalHeader from "./EvalHeader";

export default function EvalBlocC({ team, patch, hasOthers, onNext, onBack }) {
  return (
    <div style={W}>
      <EvalHeader title="Bloc C — Validation" teamName={team.name} />

      <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={UP}>C1</div>
        <p style={{ margin: "4px 0 8px", fontSize: 14 }}>Si un de vos pairs managers devait décrire cette équipe à un nouvel arrivant :</p>
        {C1O.map(o => (
          <label key={o.v} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "4px 8px", borderRadius: 4, cursor: "pointer", background: team.c1 === o.v ? "#eff6ff" : "transparent" }}>
            <input type="radio" name="c1" checked={team.c1 === o.v} onChange={() => patch({ c1: o.v })} />{o.l}
          </label>
        ))}
      </div>

      <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={UP}>C2</div>
        <p style={{ margin: "4px 0 8px", fontSize: 14 }}>% de la capacité consacré aux besoins d'autres équipes internes :</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "#888" }}>0%</span>
          <input type="range" min={0} max={100} step={5} value={team.c2 ?? 50} onChange={e => patch({ c2: Number(e.target.value) })} style={{ flex: 1, accentColor: "#2563eb" }} />
          <span style={{ fontSize: 11, color: "#888" }}>100%</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 700 }}>{team.c2 ?? 50}%</div>
      </div>

      <div style={{ padding: "12px 0" }}>
        <div style={UP}>C3</div>
        <p style={{ margin: "4px 0 8px", fontSize: 14 }}>Si vous pouviez renforcer une compétence demain :</p>
        {C3O.map(o => (
          <label key={o.v} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "4px 8px", borderRadius: 4, cursor: "pointer", background: team.c3 === o.v ? "#eff6ff" : "transparent" }}>
            <input type="radio" name="c3" checked={team.c3 === o.v} onChange={() => patch({ c3: o.v })} />{o.l}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={BS} onClick={onBack}>← Bloc B</button>
        <button style={BP} onClick={onNext}>{hasOthers ? "Impacts →" : "Résultats →"}</button>
      </div>
    </div>
  );
}
