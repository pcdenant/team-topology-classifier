export function MiniBar({ label, cur, tgt, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ fontWeight: 600, color }}>{label}</span>
        <span style={{ color: "#888" }}>{cur}% → {tgt}%</span>
      </div>
      <div style={{ position: "relative", height: 10, background: "#f0f0f0", borderRadius: 5 }}>
        <div style={{ position: "absolute", height: "100%", width: `${tgt}%`, background: color, opacity: 0.2, borderRadius: 5 }} />
        <div style={{ position: "absolute", height: "100%", width: `${cur}%`, background: color, borderRadius: 5 }} />
      </div>
    </div>
  );
}

export function Flag({ t: type, x: text }) {
  const bg = type === "danger" ? "#fef2f2" : type === "warning" ? "#fffbeb" : "#eff6ff";
  const bc = type === "danger" ? "#dc2626" : type === "warning" ? "#d97706" : "#2563eb";
  return <div style={{ padding: "9px 12px", marginBottom: 5, borderRadius: 6, fontSize: 13, lineHeight: 1.5, background: bg, borderLeft: `3px solid ${bc}` }}>{text}</div>;
}

export function Diagnostic({ t, prob, act }) {
  const bg = t === "danger" ? "#fef2f2" : t === "warning" ? "#fffbeb" : "#eff6ff";
  const bc = t === "danger" ? "#dc2626" : t === "warning" ? "#d97706" : "#2563eb";
  return (
    <div style={{ padding: "10px 12px", marginBottom: 6, borderRadius: 6, background: bg, borderLeft: `3px solid ${bc}` }}>
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{prob}</div>
      <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>→ {act}</div>
    </div>
  );
}
