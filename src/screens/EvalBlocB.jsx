import { BB } from "../data/questions";
import { W, BP, BS } from "../styles";
import QuestionRow from "../components/QuestionRow";
import EvalHeader from "./EvalHeader";

export default function EvalBlocB({ team, sCB, sTB, patch, onNext, onBack }) {
  return (
    <div style={W}>
      <EvalHeader title="Bloc B — Interactions" teamName={team.name} />
      {BB.map(q => (
        <QuestionRow key={q.id} q={q} cur={team.cB?.[q.id]} tgt={team.tB?.[q.id]}
          onC={v => sCB(q.id, v)} onT={v => sTB(q.id, v)}
          idk={q.hasIDK && team.b5idk} onIDK={v => patch({ b5idk: v })} />
      ))}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={BS} onClick={onBack}>← Bloc A</button>
        <button style={BP} onClick={onNext}>Bloc C →</button>
      </div>
    </div>
  );
}
