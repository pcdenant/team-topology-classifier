import Slider from './Slider';
import { BT, C } from '../styles';

export default function QuestionRow({ q, cur, tgt, onC, onT, idk, onIDK }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.borderLight}` }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontWeight: 700, color: C.textLight, fontSize: 11 }}>{q.id}</span>
        {q.flag && (
          <span style={{
            fontSize: 10, marginLeft: 6, padding: "2px 7px", borderRadius: 4,
            background: q.flag === "anti-pattern" ? C.dangerBg : C.warningBg,
            color: q.flag === "anti-pattern" ? C.danger : C.warning, fontWeight: 600,
          }}>{q.flag}</span>
        )}
        <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.6, color: C.text }}>{q.text}</p>
      </div>
      {idk ? (
        <div style={{ padding: "8px 0", fontSize: 13, color: C.textLight, fontStyle: "italic" }}>
          Marquée "je ne sais pas" <button onClick={() => onIDK(false)} style={{ ...BT, marginLeft: 8 }}>Répondre</button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Slider value={cur} onChange={onC} label="Auj." />
            <Slider value={tgt} onChange={onT} label="Idéal" />
          </div>
          {q.hasIDK && <button onClick={() => onIDK(true)} style={{ ...BT, marginTop: 8, fontSize: 11 }}>Je ne sais pas</button>}
        </div>
      )}
    </div>
  );
}
