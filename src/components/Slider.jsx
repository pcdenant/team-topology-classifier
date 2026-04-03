import { SCALE } from '../data/constants';

export default function Slider({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 220 }}>
      <span style={{ fontSize: 11, color: "#888", width: 28, textAlign: "right", flexShrink: 0 }}>{label}</span>
      <input type="range" min={1} max={5} step={1} value={value || 1}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: "#2563eb", cursor: "pointer" }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: value ? "#2563eb" : "#ccc", width: 72, flexShrink: 0 }}>
        {value ? SCALE[value] : "—"}
      </span>
    </div>
  );
}
