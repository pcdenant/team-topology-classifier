import { TL, TC, TK } from "../data/constants";
import { ACTS, getClarityMessage, getGapMessage } from "../data/actions";
import { W, BP, BS, BT, CD, UP } from "../styles";
import { analyze, getFlags } from "../scoring/analyze";
import { MiniBar, Flag } from "../components/Indicators";

export default function ResultsScreen({
  team, pending, evTeams,
  showDist, setShowDist, showAllFlags, setShowAllFlags,
  onBack, onEdit, onNextTeam, onEcosystem, mdModal,
}) {
  const a = analyze(team);
  const fl = getFlags(team, a);
  const vis = fl.slice(0, 3);
  const hid = fl.slice(3);

  return (
    <div style={W}>
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>{team.name}</h2>

      {/* Clarity index */}
      <div style={{ padding: 16, borderRadius: 10, marginBottom: 14, background: a.cl.bg, border: `2px solid ${a.cl.bd}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={UP}>Indice de clarté</span>
          <span style={{ fontSize: 26, fontWeight: 800, color: a.cl.c }}>{a.cP}%</span>
        </div>
        <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 3, width: `${a.cP}%`, background: a.cl.c }} />
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#444" }}>{getClarityMessage(a.cl, a.cK, a.c2K)}</p>
      </div>

      {/* Current → Target */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", margin: "14px 0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#888" }}>AUJOURD'HUI</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TC[a.cK] }}>{TL[a.cK]}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{a.cP}%</div>
        </div>
        <div style={{ fontSize: 22, color: a.cK !== a.tK ? "#d97706" : "#059669" }}>→</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#888" }}>OBJECTIF</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: TC[a.tK] }}>{TL[a.tK]}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{a.tP}%</div>
        </div>
      </div>

      {/* Distribution (accordion) */}
      {showDist && (
        <div style={{ marginBottom: 14 }}>
          {TK.map(k => <MiniBar key={k} label={TL[k]} cur={a.tC[k]} tgt={a.tT[k]} color={TC[k]} />)}
        </div>
      )}
      <button style={{ ...BT, marginBottom: 14 }} onClick={() => setShowDist(!showDist)}>{showDist ? "Masquer" : "Voir"} la distribution</button>

      {/* 80/20 plan */}
      <div style={{ ...CD, background: "#f8fafc" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Plan 80/20 — Devenir {TL[a.tK]}</div>
        <p style={{ fontSize: 12, color: "#666", margin: "0 0 10px" }}>{getGapMessage(a)}</p>
        {(ACTS[a.tK] || []).map((act, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ minWidth: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: TC[a.tK], color: "#fff", fontWeight: 700, fontSize: 11 }}>{i + 1}</div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{act}</p>
          </div>
        ))}
      </div>

      {/* Flags */}
      {fl.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ ...UP, marginBottom: 6 }}>Signaux</div>
          {vis.map((f, i) => <Flag key={i} {...f} />)}
          {hid.length > 0 && !showAllFlags && (
            <button style={{ ...BT, marginTop: 4 }} onClick={() => setShowAllFlags(true)}>+{hid.length} signal{hid.length > 1 ? "s" : ""}</button>
          )}
          {showAllFlags && hid.map((f, i) => <Flag key={`h${i}`} {...f} />)}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <button style={BS} onClick={onBack}>← Retour</button>
        <button style={BT} onClick={onEdit}>✏️ Modifier</button>
        {pending.length > 0 && <button style={BP} onClick={onNextTeam}>Suivante →</button>}
        {evTeams.length >= 2 && <button style={{ ...BP, background: "#059669" }} onClick={onEcosystem}>Écosystème →</button>}
      </div>
      {mdModal}
    </div>
  );
}
