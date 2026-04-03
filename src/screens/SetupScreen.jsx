import { W, BP, BS, BT } from "../styles";
import { fresh } from "../data/constants";

export default function SetupScreen({
  sMode, setSMode, nName, setNName, bText, setBText,
  teams, setTeams, goEval, onBack,
}) {
  const bc = bText.split("\n").filter(n => n.trim()).length;
  return (
    <div style={W}>
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>Ajouter des équipes</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["single", "batch"].map(m => (
          <button key={m} style={{ ...BT, background: sMode === m ? "#eff6ff" : "#fff", borderColor: sMode === m ? "#2563eb" : "#ddd", color: sMode === m ? "#2563eb" : "#555" }} onClick={() => setSMode(m)}>
            {m === "single" ? "Une à la fois" : "Plusieurs"}
          </button>
        ))}
      </div>
      {sMode === "single" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={nName} onChange={e => setNName(e.target.value)} placeholder="Nom de l'équipe" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 14 }} />
          <button style={BP} disabled={!nName.trim()} onClick={() => {
            setTeams(p => [...p, { name: nName.trim(), ...fresh() }]);
            goEval(teams.length);
            setNName("");
          }}>Évaluer →</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Un nom par ligne.</p>
          <textarea value={bText} onChange={e => setBText(e.target.value)} rows={5} placeholder={"Équipe Payments\nÉquipe Platform\nÉquipe DevX"} style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 14, fontFamily: "inherit" }} />
          <button style={BP} disabled={bc === 0} onClick={() => {
            const ns = bText.split("\n").map(n => n.trim()).filter(Boolean);
            setTeams(p => [...p, ...ns.map(n => ({ name: n, ...fresh() }))]);
            setBText("");
            goEval(teams.length);
          }}>{bc} équipe{bc > 1 ? "s" : ""} — commencer →</button>
        </div>
      )}
      <button style={{ ...BS, marginTop: 12 }} onClick={onBack}>← Retour</button>
    </div>
  );
}
