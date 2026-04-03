import { SCALE } from '../data/constants';
import { C } from '../styles';

export default function Slider({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 220 }}>
      <span style={{ fontSize: 11, color: C.textLight, width: 28, textAlign: "right", flexShrink: 0, fontWeight: 600 }}>{label}</span>
      <input type="range" min={1} max={5} step={1} value={value || 1}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, cursor: "pointer" }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: value ? C.vert : "#ccc", width: 80, flexShrink: 0 }}>
        {value ? SCALE[value] : "—"}
      </span>
    </div>
  );
}
