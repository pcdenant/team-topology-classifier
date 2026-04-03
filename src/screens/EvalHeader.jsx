import { C } from "../styles";

export default function EvalHeader({ title, teamName, step, total }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 13, color: C.textLight, fontWeight: 600 }}>{teamName}</span>
      </div>
      {step !== undefined && total && (
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? C.vert : C.borderLight, transition: "background 0.2s" }} />
          ))}
        </div>
      )}
    </div>
  );
}
