import Slider from './Slider';
import { BT } from '../styles';

export default function QuestionRow({ q, cur, tgt, onC, onT, idk, onIDK }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontWeight: 600, color: "#999", fontSize: 11 }}>{q.id}</span>
        {q.flag && (
          <span style={{
            fontSize: 10, marginLeft: 6, padding: "1px 5px", borderRadius: 3,
            background: q.flag === "anti-pattern" ? "#fee2e2" : "#fef3c7",
            color: q.flag === "anti-pattern" ? "#991b1b" : "#92400e"
          }}>{q.flag}</span>
        )}
        <p style={{ margin: "2px 0 0", fontSize: 14, lineHeight: 1.5 }}>{q.text}</p>
      </div>
      {idk ? (
        <div style={{ padding: "8px 0", fontSize: 13, color: "#888", fontStyle: "italic" }}>
          Marquée "je ne sais pas" <button onClick={() => onIDK(false)} style={{ ...BT, marginLeft: 8 }}>Répondre</button>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Slider value={cur} onChange={onC} label="Auj." />
            <Slider value={tgt} onChange={onT} label="Idéal" />
          </div>
          {q.hasIDK && <button onClick={() => onIDK(true)} style={{ ...BT, marginTop: 6, fontSize: 11 }}>Je ne sais pas</button>}
        </div>
      )}
    </div>
  );
}
