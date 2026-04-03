import { TL, TC } from "../data/constants";
import { exportJSON } from "../export/io";
import { W, BP, BS, BT, CD, LK, UP } from "../styles";

export default function HomeScreen({
  teams, evTeams, results, pending,
  goEval, goView, previewMD,
  doImport, doReset, onEcosystem,
  showTools, setShowTools,
  showImport, setShowImport,
  impText, setImpText, impErr, setImpErr,
  onAddTeam, mdModal,
}) {
  return (
    <div style={W}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Team Topology Classifier</h1>

      {teams.length === 0 && (
        <div style={{ ...CD, background: "#f8fafc", marginTop: 12, marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#555", margin: 0, lineHeight: 1.6 }}>
            <b>1.</b> Nommez vos équipes <b>2.</b> 18 questions par équipe (~6 min) <b>3.</b> Obtenez votre diagnostic
          </p>
        </div>
      )}

      {evTeams.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...UP, marginBottom: 8 }}>{evTeams.length}/{teams.length} évaluée{evTeams.length > 1 ? "s" : ""}</div>
          {results.map((r, i) => (
            <div key={i} onClick={() => goView(teams.indexOf(r.team))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.cl.c }} />
                <span style={{ fontSize: 14, fontWeight: 600, ...LK }}>{r.team.name}</span>
              </div>
              <span style={{ fontSize: 12, color: TC[r.cK] }}>{TL[r.cK]}</span>
            </div>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div style={{ ...CD, marginBottom: 16 }}>
          <div style={{ ...UP, marginBottom: 4 }}>En attente ({pending.length})</div>
          <p style={{ fontSize: 11, color: "#aaa", margin: "0 0 6px" }}>Commencez par l'équipe que vous connaissez le mieux.</p>
          {pending.map((x, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
              <span style={{ fontSize: 14 }}>{x.name}</span>
              <button style={BT} onClick={() => goEval(teams.indexOf(x))}>Évaluer</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button style={BP} onClick={onAddTeam}>{teams.length === 0 ? "Commencer" : "+ Ajouter"}</button>
        {evTeams.length >= 2 && <button style={{ ...BP, background: "#059669" }} onClick={onEcosystem}>Écosystème →</button>}
        {evTeams.length > 0 && <button style={BT} onClick={previewMD}>📄 Diagnostic</button>}
      </div>

      <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
        <div onClick={() => setShowTools(!showTools)} style={{ ...UP, cursor: "pointer" }}>{showTools ? "▾" : "▸"} Outils</div>
        {showTools && (
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {teams.length > 0 && <button style={BT} onClick={() => exportJSON(teams)}>💾 JSON</button>}
            <button style={BT} onClick={() => { setShowImport(true); setImpText(""); setImpErr(""); }}>📥 Importer</button>
            {teams.length > 0 && <button style={{ ...BT, color: "#dc2626", borderColor: "#fecaca" }} onClick={doReset}>Réinitialiser</button>}
          </div>
        )}
        {showImport && (
          <div style={{ ...CD, marginTop: 8 }}>
            <textarea value={impText} onChange={e => setImpText(e.target.value)} rows={4} placeholder="Collez le JSON exporté" style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 11, fontFamily: "monospace", boxSizing: "border-box" }} />
            {impErr && <p style={{ color: "#dc2626", fontSize: 12 }}>{impErr}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button style={BP} onClick={() => doImport(impText)}>Importer</button>
              <button style={BS} onClick={() => setShowImport(false)}>Annuler</button>
            </div>
          </div>
        )}
      </div>
      {mdModal}
    </div>
  );
}
