import { BP, BS, BT, CARD, C } from "../styles";
import { fresh } from "../data/constants";

export default function SetupScreen({
  sMode, setSMode, nName, setNName, bText, setBText,
  teams, setTeams, goEval, onBack,
}) {
  const bc = bText.split("\n").filter(n => n.trim()).length;
  return (
    <div style={{ maxWidth: 520 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Ajouter des équipes</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[["single", "Une à la fois"], ["batch", "Plusieurs"]].map(([m, l]) => (
          <button key={m} onClick={() => setSMode(m)} style={{
            ...BT, padding: "8px 18px", fontSize: 13, fontWeight: 600,
            background: sMode === m ? C.vertLight : C.white,
            borderColor: sMode === m ? C.vert : C.border,
            color: sMode === m ? C.vert : C.textMuted,
          }}>{l}</button>
        ))}
      </div>
      <div style={CARD}>
        {sMode === "single" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input value={nName} onChange={e => setNName(e.target.value)} placeholder="Nom de l'équipe"
              style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none" }}
              onFocus={e => e.target.style.borderColor = C.vert}
              onBlur={e => e.target.style.borderColor = C.border} />
            <button style={BP} disabled={!nName.trim()} onClick={() => {
              setTeams(p => [...p, { name: nName.trim(), ...fresh() }]);
              goEval(teams.length);
              setNName("");
            }}>Évaluer →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 13, color: C.textMuted }}>Un nom par ligne.</p>
            <textarea value={bText} onChange={e => setBText(e.target.value)} rows={5}
              placeholder={"Équipe Payments\nÉquipe Platform\nÉquipe DevX"}
              style={{ padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none" }}
              onFocus={e => e.target.style.borderColor = C.vert}
              onBlur={e => e.target.style.borderColor = C.border} />
            <button style={BP} disabled={bc === 0} onClick={() => {
              const ns = bText.split("\n").map(n => n.trim()).filter(Boolean);
              setTeams(p => [...p, ...ns.map(n => ({ name: n, ...fresh() }))]);
              setBText("");
              goEval(teams.length);
            }}>{bc} équipe{bc > 1 ? "s" : ""} — commencer →</button>
          </div>
        )}
      </div>
      <button style={{ ...BS, marginTop: 16 }} onClick={onBack}>← Retour</button>
    </div>
  );
}
