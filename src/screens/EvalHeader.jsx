export default function EvalHeader({ title, teamName }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
      <h2 style={{ fontSize: 18, margin: 0 }}>{title}</h2>
      <span style={{ fontSize: 13, color: "#888" }}>{teamName}</span>
    </div>
  );
}
