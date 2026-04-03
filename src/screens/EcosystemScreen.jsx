import { TL, TK } from "../data/constants";
import { IMP } from "../data/questions";
import { C, BP, BS, BT, CARD, CARD_CREME, CARD_VERT, LABEL, LABEL_W, TYPE_CLR, CLAR_CLR, LK } from "../styles";
import { ecoData } from "../scoring/ecosystem";
import { exportJSON } from "../export/io";
import { Diagnostic } from "../components/Indicators";

export default function EcosystemScreen({
  results, teams, goView, previewMD,
  onBack, onAddTeam, mdModal,
}) {
  const eco = ecoData(results, teams);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Écosystème</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24, lineHeight: 1.6 }}>{eco.intro}</p>

      {/* Top metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        {[["high", C.vert, "Claire"], ["medium", C.warning, "Brouillée"], ["low", C.danger, "Absente"]].map(([k, c, l]) => (
          <div key={k} style={{ ...CARD_CREME, textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: c, lineHeight: 1 }}>{eco.cl[k]}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Composition summary */}
      <div style={{ ...CARD_VERT, marginBottom: 20, padding: 20 }}>
        <div style={{ ...LABEL_W, marginBottom: 10 }}>Composition</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {TK.map(k => (
            <div key={k} style={{ fontSize: 13, color: "#ffffffcc" }}>
              <b style={{ color: "#fff", fontSize: 18 }}>{eco.tc[k]}</b>{" "}
              {TL[k]}
              {eco.tt[k] !== eco.tc[k] && <span style={{ color: "#ffffff66" }}> → {eco.tt[k]}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Movement map + diagnostics bento */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {/* Movement map */}
        <div style={{ ...CARD, gridRow: eco.diag.length > 2 ? "1 / 3" : "1" }}>
          <div style={{ ...LABEL, marginBottom: 14 }}>Carte de mouvement</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TK.map(k => {
              const here = results.filter(r => r.cK === k);
              const arr = results.filter(r => r.tK === k && r.cK !== k);
              return (
                <div key={k} style={{
                  border: `2px solid ${TYPE_CLR[k]}22`, borderRadius: 12,
                  padding: 14, minHeight: 70, background: `${TYPE_CLR[k]}06`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TYPE_CLR[k], textTransform: "uppercase", marginBottom: 8 }}>{TL[k]}</div>
                  {here.length === 0 && arr.length === 0 && <div style={{ fontSize: 12, color: "#ccc" }}>—</div>}
                  {here.map((r, i) => (
                    <div key={i} onClick={() => goView(teams.indexOf(r.team))}
                      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, cursor: "pointer" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: CLAR_CLR[r.cl.lv], flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, ...LK }}>{r.team.name}</span>
                      {r.cK !== r.tK && <span style={{ fontSize: 11, color: TYPE_CLR[r.tK] }}>→ {TL[r.tK]}</span>}
                    </div>
                  ))}
                  {arr.map((r, i) => (
                    <div key={`a${i}`} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, opacity: 0.4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", border: `2px dashed ${TYPE_CLR[k]}`, boxSizing: "border-box", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.textLight }}>{r.team.name} ← arrive</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostics */}
        {eco.diag.length > 0 && (
          <div>
            <div style={{ ...LABEL, marginBottom: 10 }}>Diagnostics</div>
            {eco.diag.map((d, i) => <Diagnostic key={i} {...d} />)}
          </div>
        )}

        {/* Dependencies */}
        {Object.keys(eco.byTgt).length > 0 && (
          <div>
            <div style={{ ...LABEL, marginBottom: 10 }}>Dépendances</div>
            {Object.entries(eco.byTgt).map(([name, deps]) => (
              <div key={name} style={{ ...CARD, padding: 16, marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{name} <span style={{ fontWeight: 400, color: C.textLight }}>({deps.length})</span></div>
                {deps.map((d, i) => {
                  const im = IMP.find(m => m.v === d.imp) || IMP[0];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, marginBottom: 3, fontSize: 13 }}>
                      <span style={{ color: C.textLight }}>←</span>
                      <span>{d.from}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: im.bg, color: im.c, fontWeight: 700 }}>{im.l}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action plan */}
      <div style={CARD_CREME}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: C.text }}>Plan d'action</div>
        {eco.pr.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{
              minWidth: 24, height: 24, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: C.vert, color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0,
            }}>{i + 1}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{p}</p>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
        <button style={BS} onClick={onBack}>← Accueil</button>
        <button style={BT} onClick={onAddTeam}>+ Équipe</button>
        <button style={BT} onClick={previewMD}>Markdown</button>
        <button style={BT} onClick={() => exportJSON(teams)}>JSON</button>
      </div>
      {mdModal}
    </div>
  );
}
