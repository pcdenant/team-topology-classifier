import { BA } from "../data/questions";
import { BP, BS, C, CARD } from "../styles";
import QuestionRow from "../components/QuestionRow";
import EvalHeader from "./EvalHeader";

export default function EvalBlocA({ team, sCA, sTA, onNext, onCancel }) {
  return (
    <div>
      <EvalHeader title="Bloc A — Profil" teamName={team.name} step={0} total={4} />
      <div style={CARD}>
        <div style={{ display: "flex", gap: 20, fontSize: 11, color: C.textLight, marginBottom: 4, fontWeight: 600 }}>
          <span>1 = Pas du tout · 5 = Tout à fait</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.textLight, marginBottom: 8 }}>
          <span><b style={{ color: C.vert }}>Auj.</b> = réalité</span>
          <span><b style={{ color: C.vert }}>Idéal</b> = objectif</span>
        </div>
        {BA.map(q => <QuestionRow key={q.id} q={q} cur={team.cA?.[q.id]} tgt={team.tA?.[q.id]} onC={v => sCA(q.id, v)} onT={v => sTA(q.id, v)} />)}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={BS} onClick={onCancel}>← Annuler</button>
        <button style={BP} onClick={onNext}>Bloc B →</button>
      </div>
    </div>
  );
}
