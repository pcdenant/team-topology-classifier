import { BA } from "../data/questions";
import { W, BP, BS } from "../styles";
import QuestionRow from "../components/QuestionRow";
import EvalHeader from "./EvalHeader";

export default function EvalBlocA({ team, sCA, sTA, onNext, onCancel }) {
  return (
    <div style={W}>
      <EvalHeader title="Bloc A — Profil" teamName={team.name} />
      <p style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>1 = Pas du tout · 5 = Tout à fait</p>
      <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#999", marginBottom: 8 }}>
        <span><b>Auj.</b> = réalité</span><span><b>Idéal</b> = objectif</span>
      </div>
      {BA.map(q => (
        <QuestionRow key={q.id} q={q} cur={team.cA?.[q.id]} tgt={team.tA?.[q.id]} onC={v => sCA(q.id, v)} onT={v => sTA(q.id, v)} />
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={BS} onClick={onCancel}>← Annuler</button>
        <button style={BP} onClick={onNext}>Bloc B →</button>
      </div>
    </div>
  );
}
