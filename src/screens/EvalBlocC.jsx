import { C1O, C3O } from "../data/questions";
import { BP, BS, C, CARD, LABEL } from "../styles";
import EvalHeader from "./EvalHeader";

export default function EvalBlocC({ team, patch, hasOthers, onNext, onBack }) {
  const radioStyle = (selected) => ({
    display: "flex", alignItems: "center", gap: 10, fontSize: 14, padding: "8px 12px",
    borderRadius: 8, cursor: "pointer", transition: "background 0.12s",
    background: selected ? C.vertLight : "transparent",
    fontWeight: selected ? 600 : 400,
  });

  return (
    <div>
      <EvalHeader title="Bloc C — Validation" teamName={team.name} step={2} total={4} />
      <div style={CARD}>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={LABEL}>C1</div>
          <p style={{ margin: "6px 0 10px", fontSize: 14, lineHeight: 1.6 }}>Si un de vos pairs managers devait décrire cette équipe à un nouvel arrivant :</p>
          {C1O.map(o => (
            <label key={o.v} style={radioStyle(team.c1 === o.v)}>
              <input type="radio" name="c1" checked={team.c1 === o.v} onChange={() => patch({ c1: o.v })}
                style={{ accentColor: C.vert }} />{o.l}
            </label>
          ))}
        </div>

        <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={LABEL}>C2</div>
          <p style={{ margin: "6px 0 10px", fontSize: 14, lineHeight: 1.6 }}>% de la capacité consacré aux besoins d'autres équipes internes :</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>0%</span>
            <input type="range" min={0} max={100} step={5} value={team.c2 ?? 50}
              onChange={e => patch({ c2: Number(e.target.value) })} style={{ flex: 1 }} />
            <span style={{ fontSize: 11, color: C.textLight, fontWeight: 600 }}>100%</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: C.vert, marginTop: 4 }}>{team.c2 ?? 50}%</div>
        </div>

        <div style={{ padding: "14px 0" }}>
          <div style={LABEL}>C3</div>
          <p style={{ margin: "6px 0 10px", fontSize: 14, lineHeight: 1.6 }}>Si vous pouviez renforcer une compétence demain :</p>
          {C3O.map(o => (
            <label key={o.v} style={radioStyle(team.c3 === o.v)}>
              <input type="radio" name="c3" checked={team.c3 === o.v} onChange={() => patch({ c3: o.v })}
                style={{ accentColor: C.vert }} />{o.l}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={BS} onClick={onBack}>← Bloc B</button>
        <button style={BP} onClick={onNext}>{hasOthers ? "Impacts →" : "Résultats →"}</button>
      </div>
    </div>
  );
}
