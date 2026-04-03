import { C, BP, BS, BT, CARD, CARD_CREME, CARD_VERT, LABEL, LABEL_W, CLAR_CLR, TYPE_CLR, badge } from "../styles";
import { TL } from "../data/constants";
import { exportJSON } from "../export/io";

export default function HomeScreen({
  teams, evTeams, results, pending,
  goEval, goView, previewMD,
  doImport, doReset, onEcosystem,
  showTools, setShowTools,
  showImport, setShowImport,
  impText, setImpText, impErr, setImpErr,
  onAddTeam, mdModal,
}) {
  // Empty state
  if (teams.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: C.jaune, display: "flex", alignItems: "center", justifyContent: "center", color: C.vertDark, fontWeight: 900, fontSize: 24, marginBottom: 24 }}>TT</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Team Topology Classifier</h1>
      <p style={{ fontSize: 15, color: C.textMuted, maxWidth: 400, lineHeight: 1.7, marginBottom: 32 }}>
        Nommez vos équipes. Répondez à 18 questions par équipe (~6 min). Obtenez votre diagnostic d'écosystème.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={{ ...BP, padding: "14px 32px", fontSize: 15 }} onClick={onAddTeam}>Commencer</button>
        <button style={BS} onClick={() => { setShowImport(true); setImpText(""); setImpErr(""); }}>Importer</button>
      </div>
      {showImport && (
        <div style={{ ...CARD, marginTop: 24, maxWidth: 440, width: "100%", textAlign: "left" }}>
          <textarea value={impText} onChange={e => setImpText(e.target.value)} rows={4} placeholder="Collez le JSON exporté" style={{ width: "100%", padding: 10, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "monospace", resize: "vertical" }} />
          {impErr && <p style={{ color: C.danger, fontSize: 12, marginTop: 6 }}>{impErr}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={BP} onClick={() => doImport(impText)}>Importer</button>
            <button style={BS} onClick={() => setShowImport(false)}>Annuler</button>
          </div>
        </div>
      )}
      {mdModal}
    </div>
  );

  // Dashboard state
  const nClear = results.filter(r => r.cl.lv === "high").length;
  const nBlur = results.filter(r => r.cl.lv === "medium").length;
  const nAbsent = results.filter(r => r.cl.lv === "low").length;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Vue d'ensemble</h1>

      {/* Metric tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[[nClear, C.vert, "Claire"], [nBlur, C.warning, "Brouillée"], [nAbsent, C.danger, "Absente"]].map(([n, c, l]) => (
          <div key={l} style={{ ...CARD_CREME, textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: c, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Team cards grid */}
      {evTeams.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...LABEL, marginBottom: 12 }}>Équipes évaluées</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {results.map((r, i) => (
              <div key={i} onClick={() => goView(teams.indexOf(r.team))}
                style={{ ...CARD, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${C.vert}18`; e.currentTarget.style.borderColor = TYPE_CLR[r.cK]; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: TYPE_CLR[r.cK] }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginTop: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{r.team.name}</span>
                  <span style={badge(CLAR_CLR[r.cl.lv] + "18", CLAR_CLR[r.cl.lv])}>{r.cl.lb}</span>
                </div>
                <div style={{ fontSize: 12, color: TYPE_CLR[r.cK], fontWeight: 700, marginBottom: 10 }}>{TL[r.cK]}</div>
                <div style={{ height: 6, background: C.borderLight, borderRadius: 3 }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${r.cP}%`, background: CLAR_CLR[r.cl.lv], transition: "width 0.5s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textLight, marginTop: 6 }}>
                  <span>Clarté {r.cP}%</span>
                  <span>{r.cP}% → {r.tP}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending teams */}
      {pending.length > 0 && (
        <div style={{ ...CARD_CREME, marginBottom: 24 }}>
          <div style={{ ...LABEL, marginBottom: 8 }}>En attente ({pending.length})</div>
          <p style={{ fontSize: 12, color: C.textLight, marginBottom: 10 }}>Commencez par l'équipe que vous connaissez le mieux.</p>
          {pending.map((x, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{x.name}</span>
              <button style={BT} onClick={() => goEval(teams.indexOf(x))}>Évaluer</button>
            </div>
          ))}
        </div>
      )}

      {/* Actions row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {evTeams.length >= 2 && <button style={{ ...BP, background: C.vert, color: "#fff" }} onClick={onEcosystem}>Écosystème →</button>}
        {evTeams.length > 0 && <button style={BT} onClick={previewMD}>Diagnostic MD</button>}
      </div>

      {/* Tools accordion */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
        <div onClick={() => setShowTools(!showTools)} style={{ ...LABEL, cursor: "pointer", userSelect: "none" }}>{showTools ? "▾" : "▸"} Outils</div>
        {showTools && (
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {teams.length > 0 && <button style={BT} onClick={() => exportJSON(teams)}>JSON</button>}
            <button style={BT} onClick={() => { setShowImport(true); setImpText(""); setImpErr(""); }}>Importer</button>
            {teams.length > 0 && <button style={{ ...BT, color: C.danger, borderColor: "#fecaca" }} onClick={doReset}>Réinitialiser</button>}
          </div>
        )}
        {showImport && (
          <div style={{ ...CARD, marginTop: 10 }}>
            <textarea value={impText} onChange={e => setImpText(e.target.value)} rows={4} placeholder="Collez le JSON exporté" style={{ width: "100%", padding: 10, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontFamily: "monospace", resize: "vertical" }} />
            {impErr && <p style={{ color: C.danger, fontSize: 12, marginTop: 6 }}>{impErr}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
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
