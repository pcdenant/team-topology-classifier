import { TL, TK } from "../data/constants";
import { ACTS, getClarityMessage, getGapMessage } from "../data/actions";
import { C, BP, BS, BT, CARD, CARD_CREME, LABEL, TYPE_CLR, CLAR_CLR, badge } from "../styles";
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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{team.name}</h2>
        <span style={badge(CLAR_CLR[a.cl.lv] + "18", CLAR_CLR[a.cl.lv])}>{a.cl.lb}</span>
      </div>

      {/* Top metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {/* Clarity index */}
        <div style={{ ...CARD, background: a.cl.lv === "high" ? C.vertLight : a.cl.lv === "medium" ? C.warningBg : C.dangerBg, border: "none" }}>
          <div style={{ ...LABEL, color: CLAR_CLR[a.cl.lv], marginBottom: 8 }}>Indice de clarté</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: CLAR_CLR[a.cl.lv], lineHeight: 1 }}>{a.cP}%</div>
          <div style={{ height: 6, background: "#00000010", borderRadius: 3, marginTop: 12 }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${a.cP}%`, background: CLAR_CLR[a.cl.lv], transition: "width 0.5s" }} />
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.6, color: C.textMuted }}>{getClarityMessage(a.cl, a.cK, a.c2K)}</p>
        </div>

        {/* Current → Target */}
        <div style={CARD}>
          <div style={{ ...LABEL, marginBottom: 12 }}>Transition</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600, marginBottom: 4 }}>AUJOURD'HUI</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: TYPE_CLR[a.cK] }}>{TL[a.cK]}</div>
              <div style={{ fontSize: 13, color: C.textLight }}>{a.cP}%</div>
            </div>
            <div style={{ fontSize: 24, color: a.cK !== a.tK ? C.warning : C.vert }}>→</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.textLight, fontWeight: 600, marginBottom: 4 }}>OBJECTIF</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: TYPE_CLR[a.tK] }}>{TL[a.tK]}</div>
              <div style={{ fontSize: 13, color: C.textLight }}>{a.tP}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution accordion */}
      <div style={{ ...CARD, marginBottom: 14 }}>
        <div onClick={() => setShowDist(!showDist)}
          style={{ ...LABEL, cursor: "pointer", userSelect: "none", marginBottom: showDist ? 12 : 0 }}>
          {showDist ? "▾" : "▸"} Distribution
        </div>
        {showDist && TK.map(k => <MiniBar key={k} label={TL[k]} cur={a.tC[k]} tgt={a.tT[k]} color={TYPE_CLR[k]} />)}
      </div>

      {/* 80/20 plan */}
      <div style={CARD_CREME}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: C.text }}>Plan 80/20 — Devenir {TL[a.tK]}</div>
        <p style={{ fontSize: 13, color: C.textMuted, margin: "0 0 14px", lineHeight: 1.6 }}>{getGapMessage(a)}</p>
        {(ACTS[a.tK] || []).map((act, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{
              minWidth: 24, height: 24, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: C.vert, color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0,
            }}>{i + 1}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{act}</p>
          </div>
        ))}
      </div>

      {/* Flags */}
      {fl.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...LABEL, marginBottom: 8 }}>Signaux</div>
          {vis.map((f, i) => <Flag key={i} {...f} />)}
          {hid.length > 0 && !showAllFlags && (
            <button style={{ ...BT, marginTop: 4 }} onClick={() => setShowAllFlags(true)}>
              +{hid.length} signal{hid.length > 1 ? "s" : ""}
            </button>
          )}
          {showAllFlags && hid.map((f, i) => <Flag key={`h${i}`} {...f} />)}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
        <button style={BS} onClick={onBack}>← Retour</button>
        <button style={BT} onClick={onEdit}>Modifier</button>
        {pending.length > 0 && <button style={BP} onClick={onNextTeam}>Suivante →</button>}
        {evTeams.length >= 2 && <button style={{ ...BP, background: C.vert, color: "#fff" }} onClick={onEcosystem}>Écosystème →</button>}
      </div>
      {mdModal}
    </div>
  );
}
