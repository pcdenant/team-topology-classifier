import { TL, TC, TK } from "../data/constants";
import { IMP } from "../data/questions";
import { W, BP, BS, BT, CD, LK, UP } from "../styles";
import { ecoData } from "../scoring/ecosystem";
import { exportJSON } from "../export/io";
import { Diagnostic } from "../components/Indicators";

export default function EcosystemScreen({
  results, teams, goView, previewMD,
  onBack, onAddTeam, mdModal,
}) {
  const eco = ecoData(results, teams);
  return (
    <div style={W}>
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>Écosystème</h2>
      <p style={{ fontSize: 14, color: "#555", marginBottom: 14, lineHeight: 1.5 }}>{eco.intro}</p>

      {/* Summary card */}
      <div style={{ ...CD, background: "#f8fafc" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
          {[["high", "#059669", "Claire"], ["medium", "#d97706", "Brouillée"], ["low", "#dc2626", "Absente"]].map(([k, c, l]) => (
            <div key={k} style={{ textAlign: "center", flex: 1, minWidth: 70 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{eco.cl[k]}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {TK.map(k => (
            <div key={k} style={{ fontSize: 12, color: TC[k] }}>
              <b>{eco.tc[k]}</b> {TL[k]}{eco.tt[k] !== eco.tc[k] && <span style={{ color: "#888" }}> → {eco.tt[k]}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Movement map */}
      <div style={{ ...UP, margin: "16px 0 8px" }}>Carte de mouvement</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {TK.map(k => {
          const here = results.filter(r => r.cK === k);
          const arr = results.filter(r => r.tK === k && r.cK !== k);
          return (
            <div key={k} style={{ border: `2px solid ${TC[k]}22`, borderRadius: 10, padding: 10, minHeight: 60, background: `${TC[k]}06` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TC[k], marginBottom: 6, textTransform: "uppercase" }}>{TL[k]}</div>
              {here.length === 0 && arr.length === 0 && <div style={{ fontSize: 12, color: "#ccc" }}>—</div>}
              {here.map((r, i) => (
                <div key={i} onClick={() => goView(teams.indexOf(r.team))} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, cursor: "pointer" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.cl.c, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, ...LK }}>{r.team.name}</span>
                  {r.cK !== r.tK && <span style={{ fontSize: 11, color: TC[r.tK] }}>→ {TL[r.tK]}</span>}
                </div>
              ))}
              {arr.map((r, i) => (
                <div key={`a${i}`} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, opacity: 0.4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", border: `2px dashed ${TC[k]}`, boxSizing: "border-box", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#888" }}>{r.team.name} ← arrive</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Dependencies grouped by target */}
      {Object.keys(eco.byTgt).length > 0 && (
        <div>
          <div style={{ ...UP, marginBottom: 6 }}>Dépendances</div>
          {Object.entries(eco.byTgt).map(([name, deps]) => (
            <div key={name} style={CD}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{name} <span style={{ fontWeight: 400, color: "#888" }}>({deps.length})</span></div>
              {deps.map((d, i) => {
                const im = IMP.find(m => m.v === d.imp) || IMP[0];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12, marginBottom: 2, fontSize: 13 }}>
                    <span style={{ color: "#888" }}>←</span><span>{d.from}</span>
                    <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 4, background: im.bg, color: im.c, fontWeight: 600 }}>{im.l}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Diagnostics */}
      {eco.diag.length > 0 && (
        <div>
          <div style={{ ...UP, margin: "14px 0 6px" }}>Diagnostics</div>
          {eco.diag.map((d, i) => <Diagnostic key={i} {...d} />)}
        </div>
      )}

      {/* Action plan */}
      <div style={{ ...CD, background: "#f8fafc", marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Plan d'action</div>
        {eco.pr.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ minWidth: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 11 }}>{i + 1}</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{p}</p>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <button style={BS} onClick={onBack}>← Accueil</button>
        <button style={BT} onClick={onAddTeam}>+ Équipe</button>
        <button style={BT} onClick={previewMD}>📄 Markdown</button>
        <button style={BT} onClick={() => exportJSON(teams)}>💾 JSON</button>
      </div>
      {mdModal}
    </div>
  );
}
