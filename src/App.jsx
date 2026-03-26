import { useState, useMemo, useCallback, useEffect } from "react";

// ── DATA ──
const BA = [
  { id: "A1", text: "Cette équipe livre de la valeur directement à un utilisateur final ou un client business.", signal: "SA" },
  { id: "A2", text: "D'autres équipes utilisent un outil, un service ou une API produit par cette équipe sans avoir besoin de nous contacter.", signal: "PL" },
  { id: "A3", text: "Cette équipe passe du temps à accompagner d'autres équipes pour qu'elles développent une compétence qu'elles n'ont pas encore.", signal: "EN" },
  { id: "A4", text: "Le travail de cette équipe nécessite une expertise technique ou scientifique que la plupart des autres équipes ne pourraient pas acquérir en quelques semaines.", signal: "CS" },
  { id: "A5", text: "Si cette équipe arrêtait de livrer pendant 2 semaines, un client externe le remarquerait.", signal: "SA" },
  { id: "A6", text: "Cette équipe reçoit régulièrement des demandes d'autres équipes pour modifier ou améliorer quelque chose qu'elles ne peuvent pas faire elles-mêmes.", signal: "PL_CS" },
  { id: "A7", text: "L'équipe se désengage naturellement de ses interventions quand l'autre équipe est devenue autonome.", signal: "EN" },
  { id: "A8", text: "Le backlog de cette équipe est alimenté principalement par des besoins utilisateurs ou des objectifs business, pas par des requêtes d'autres équipes.", signal: "SA" },
  { id: "A9", text: "Les autres équipes contournent parfois cette équipe en développant leurs propres solutions au lieu d'utiliser ce que nous offrons.", signal: "flag", flag: "contradiction" },
  { id: "A10", text: "Cette équipe pourrait fonctionner efficacement même si on coupait ses canaux de communication avec les autres équipes pendant une semaine.", signal: "flag", flag: "contradiction" },
];
const BB = [
  { id: "B1", text: "Les autres équipes consomment le travail de cette équipe de façon autonome, sans coordination régulière.", signal: "XaaS" },
  { id: "B2", text: "Cette équipe travaille étroitement côte à côte avec une ou deux autres équipes sur des objectifs partagés, pour une période définie.", signal: "Collab" },
  { id: "B3", text: "Cette équipe aide d'autres équipes à résoudre des problèmes ou à acquérir des compétences, sans écrire leur code ou faire leur travail à leur place.", signal: "Facil" },
  { id: "B4", text: "Les interactions entre cette équipe et les autres se font principalement par tickets, requêtes formelles ou files d'attente.", signal: "flag", flag: "anti-pattern" },
  { id: "B5", text: "Le mode d'interaction entre cette équipe et ses partenaires change au fil du temps.", signal: "flag", flag: "maturité" },
];
const C1O = [
  { v: "SA", l: "\"L'équipe qui livre le produit X\"" }, { v: "PL", l: "\"L'équipe qui fournit la plateforme / les outils\"" },
  { v: "EN", l: "\"L'équipe qui nous aide à monter en compétence\"" }, { v: "CS", l: "\"L'équipe qui gère le composant complexe Y\"" },
  { v: "unknown", l: "\"Je ne sais pas\"" },
];
const C3O = [
  { v: "SA", l: "Profil business / client" }, { v: "PL", l: "Profil developer experience / outils" },
  { v: "EN", l: "Profil coach / formateur technique" }, { v: "CS", l: "Profil expert technique pointu" },
];
const DM = [
  { v: "selfservice", l: "Self-service", c: "#059669" }, { v: "collab", l: "Collaboration", c: "#d97706" },
  { v: "queue", l: "File d'attente", c: "#dc2626" },
];
const TL = { SA: "Stream-aligned", PL: "Platform", EN: "Enabling", CS: "Complicated Sub." };
const TC = { SA: "#2563eb", PL: "#7c3aed", EN: "#059669", CS: "#dc2626" };
const TK = ["SA", "PL", "EN", "CS"];
const MK = ["XaaS", "Collab", "Facil"];
const ACT = {
  SA: ["Identifier UN seul flux de valeur et UN seul client.", "Transférer l'outillage interne à une Platform team.", "Connecter directement au feedback client."],
  PL: ["Transformer le premier service en self-service (docs, API, 0 réunion).", "Mesurer la Developer Experience.", "Arrêter le travail custom par équipe."],
  EN: ["Poser une date de fin sur chaque engagement.", "Mesurer le transfert de compétence, pas l'output.", "Ne rien posséder en production."],
  CS: ["Définir et documenter la frontière d'expertise.", "Fournir des APIs, pas de la collaboration.", "Réduire la surface de contact."],
};

// ── SCORING ──
function calc(ans, bloc, keys) {
  const s = {}; keys.forEach(k => s[k] = 0);
  bloc.forEach(q => { if (q.signal === "flag" || q.signal === "PL_CS") return; if (s[q.signal] !== undefined) s[q.signal] += (ans[q.id] || 0); });
  const a6 = bloc.find(q => q.signal === "PL_CS");
  if (a6 && ans[a6.id]) { if ((s.PL || 0) >= (s.CS || 0)) s.PL += ans[a6.id]; else s.CS += ans[a6.id]; }
  const tot = Object.values(s).reduce((a, b) => a + b, 0);
  const p = {}; keys.forEach(k => p[k] = tot > 0 ? Math.round((s[k] / tot) * 100) : 0); return p;
}
function domin(sc) { return Object.entries(sc).sort((a, b) => b[1] - a[1])[0] || ["SA", 0]; }
function clar(p) {
  if (p >= 60) return { lv: "high", c: "#059669", bg: "#ecfdf5", bd: "#a7f3d0", lb: "Claire" };
  if (p >= 40) return { lv: "medium", c: "#d97706", bg: "#fffbeb", bd: "#fde68a", lb: "Brouillée" };
  return { lv: "low", c: "#dc2626", bg: "#fef2f2", bd: "#fecaca", lb: "Absente" };
}
function az(t) {
  const tC = calc(t.currentA || {}, BA, TK), tT = calc(t.targetA || {}, BA, TK);
  const [cK, cP] = domin(tC), [tK, tP] = domin(tT);
  return { tC, tT, cK, cP, tK, tP, cl: clar(cP) };
}
function flags(t, a) {
  const f = [];
  if (a.cK === "PL" && (t.currentA?.A9 || 0) >= 3) f.push({ t: "warning", x: "Contournement — d'autres équipes développent leurs propres solutions." });
  if (a.cK === "SA" && (t.currentA?.A10 || 0) <= 2 && t.currentA?.A10) f.push({ t: "warning", x: "Autonomie insuffisante pour une stream-aligned." });
  if ((t.currentA?.A3 || 0) >= 4 && (t.currentA?.A7 || 0) <= 2 && t.currentA?.A7) f.push({ t: "warning", x: "Piège du support permanent — accompagne mais ne se désengage jamais." });
  if ((t.currentB?.B4 || 0) >= 4) f.push({ t: "danger", x: "Anti-pattern ticket-driven." });
  if ((t.currentB?.B5 || 0) <= 2 && t.currentB?.B5) f.push({ t: "info", x: "Interaction figée dans le temps." });
  if (t.c1 && t.c1 !== "unknown" && t.c1 !== a.cK) f.push({ t: "warning", x: `Décalage perception : les autres voient "${TL[t.c1]}", le profil indique "${TL[a.cK]}".` });
  if (t.c1 === "unknown") f.push({ t: "info", x: "Positionnement flou aux yeux des autres équipes." });
  if (t.c3 && t.c3 !== a.cK) f.push({ t: "info", x: `Recrutement divergent : profil "${TL[t.c3]}" ≠ type actuel "${TL[a.cK]}".` });
  return f;
}
function fresh() { return { currentA: {}, targetA: {}, currentB: {}, targetB: {}, c1: null, c2: 50, c3: null, deps: {}, done: false }; }

// ── STYLES ──
const W = { maxWidth: 700, margin: "0 auto", padding: 20, fontFamily: "-apple-system,system-ui,sans-serif", color: "#1a1a1a" };
const BP = { padding: "10px 22px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" };
const BS = { padding: "10px 22px", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, cursor: "pointer" };
const BT = { padding: "5px 12px", background: "#fff", color: "#555", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, cursor: "pointer" };
const CD = { padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 10 };
const LK = { cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 2 };

// ── SMALL COMPONENTS ──
function Sl5({ value, onChange, label }) {
  const lb = ["", "Jamais", "Rarement", "Parfois", "Souvent", "Toujours"];
  return (<div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 220 }}>
    <span style={{ fontSize: 11, color: "#888", width: 28, textAlign: "right", flexShrink: 0 }}>{label}</span>
    <input type="range" min={1} max={5} step={1} value={value || 1} onChange={e => onChange(Number(e.target.value))} style={{ flex: 1, accentColor: "#2563eb", cursor: "pointer" }} />
    <span style={{ fontSize: 11, fontWeight: 600, color: value ? "#2563eb" : "#ccc", width: 60, flexShrink: 0 }}>{value ? lb[value] : "—"}</span>
  </div>);
}
function QR({ q, cur, tgt, onC, onT }) {
  return (<div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontWeight: 600, color: "#999", fontSize: 11 }}>{q.id}</span>
      {q.flag && <span style={{ fontSize: 10, marginLeft: 6, padding: "1px 5px", borderRadius: 3, background: q.flag === "anti-pattern" ? "#fee2e2" : "#fef3c7", color: q.flag === "anti-pattern" ? "#991b1b" : "#92400e" }}>{q.flag}</span>}
      <p style={{ margin: "2px 0 0", fontSize: 14, lineHeight: 1.5 }}>{q.text}</p>
    </div>
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}><Sl5 value={cur} onChange={onC} label="Auj." /><Sl5 value={tgt} onChange={onT} label="Idéal" /></div>
  </div>);
}
function MB({ label, cur, tgt, color }) {
  return (<div style={{ marginBottom: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span style={{ fontWeight: 600, color }}>{label}</span><span style={{ color: "#888" }}>{cur}% → {tgt}%</span></div>
    <div style={{ position: "relative", height: 10, background: "#f0f0f0", borderRadius: 5 }}>
      <div style={{ position: "absolute", height: "100%", width: `${tgt}%`, background: color, opacity: 0.2, borderRadius: 5 }} />
      <div style={{ position: "absolute", height: "100%", width: `${cur}%`, background: color, borderRadius: 5 }} />
    </div>
  </div>);
}
function Fl({ type, text }) {
  const bg = type === "danger" ? "#fef2f2" : type === "warning" ? "#fffbeb" : "#eff6ff";
  const bc = type === "danger" ? "#dc2626" : type === "warning" ? "#d97706" : "#2563eb";
  return <div style={{ padding: "9px 12px", marginBottom: 5, borderRadius: 6, fontSize: 13, lineHeight: 1.5, background: bg, borderLeft: `3px solid ${bc}` }}>{text}</div>;
}

// ── MARKDOWN EXPORT ──
function genMarkdown(teams, results, allTeams) {
  const d = new Date().toISOString().slice(0, 10);
  const tc = { SA: 0, PL: 0, EN: 0, CS: 0 }, cl = { high: 0, medium: 0, low: 0 };
  results.forEach(r => { tc[r.cK]++; cl[r.cl.lv]++; });
  let md = `# Team Topology Assessment — ${d}\n\n`;
  md += `## Résumé écosystème\n\n`;
  md += `- **${results.length}** équipes évaluées\n`;
  md += `- **Clarté :** ${cl.high} claire, ${cl.medium} brouillée, ${cl.low} absente\n`;
  md += `- **Composition :** ${TK.map(k => `${tc[k]} ${TL[k]}`).join(", ")}\n\n`;
  // Alerts
  const al = ecoAlerts(results, teams, allTeams);
  if (al.length > 0) { md += `### Alertes\n\n`; al.forEach(a => { md += `- ${a.t === "danger" ? "🔴" : a.t === "warning" ? "🟡" : "🔵"} ${a.x}\n`; }); md += "\n"; }
  // Priorities
  const pr = ecoPrios(results, teams, allTeams, cl);
  if (pr.length > 0) { md += `### Plan d'action écosystème\n\n`; pr.forEach((p, i) => { md += `${i + 1}. ${p}\n`; }); md += "\n"; }
  md += `---\n\n`;
  // Per team
  results.forEach(r => {
    const t = r.team; const a = r; const fl = flags(t, a);
    md += `## Équipe : ${t.name}\n\n`;
    if (t.size) md += `- **Membres :** ${t.size}\n`;
    md += `- **Type actuel :** ${TL[a.cK]} (${a.cP}%)\n`;
    md += `- **Indice de clarté :** ${a.cP}% — ${a.cl.lb}\n`;
    md += `- **Type visé :** ${TL[a.tK]} (${a.tP}%)\n`;
    if (a.cK === a.tK) md += `- **Gap :** ${a.tP - a.cP > 0 ? "+" : ""}${a.tP - a.cP} pts de consolidation\n`;
    else md += `- **Gap :** Transition ${TL[a.cK]} → ${TL[a.tK]}\n`;
    md += `\n### Distribution\n\n`;
    md += `| Type | Actuel | Visé |\n|------|--------|------|\n`;
    TK.forEach(k => { md += `| ${TL[k]} | ${a.tC[k]}% | ${a.tT[k]}% |\n`; });
    md += `\n### Plan 80/20 — Devenir ${TL[a.tK]}\n\n`;
    (ACT[a.tK] || []).forEach((act, i) => { md += `${i + 1}. ${act}\n`; });
    if (fl.length > 0) { md += `\n### Signaux\n\n`; fl.forEach(f => { md += `- ${f.t === "danger" ? "🔴" : f.t === "warning" ? "🟡" : "🔵"} ${f.x}\n`; }); }
    // Deps
    const deps = Object.entries(t.deps || {}).map(([ti, m]) => ({ to: allTeams[Number(ti)]?.name || "?", mode: m })).filter(d => d.to !== "?");
    if (deps.length > 0) { md += `\n### Dépendances\n\n`; deps.forEach(dep => { const ml = DM.find(x => x.v === dep.mode)?.l || dep.mode; md += `- → ${dep.to} (${ml})\n`; }); }
    md += `\n---\n\n`;
  });
  return md;
}

// ── ECO HELPERS ──
function ecoAlerts(results, evalTeams, allTeams) {
  const tc = { SA: 0, PL: 0, EN: 0, CS: 0 }, cl = { high: 0, medium: 0, low: 0 }, tt = { SA: 0, PL: 0, EN: 0, CS: 0 };
  results.forEach(r => { tc[r.cK]++; cl[r.cl.lv]++; tt[r.tK]++; });
  const al = [], ib = {}, qs = [];
  evalTeams.forEach(x => Object.entries(x.deps || {}).forEach(([ti, m]) => { const tg = allTeams[Number(ti)]; if (!tg) return; ib[tg.name] = (ib[tg.name] || 0) + 1; if (m === "queue") qs.push({ from: x.name, to: tg.name }); }));
  if (tc.SA === 0) al.push({ t: "danger", x: "Aucune Stream-aligned. Qui livre aux clients ?" });
  if (tc.PL === 0 && tc.SA >= 2) al.push({ t: "warning", x: `${tc.SA} Stream-aligned sans Platform — chacune absorbe son outillage.` });
  if (tc.PL > tc.SA && tc.SA > 0) al.push({ t: "warning", x: `Plus de Platform (${tc.PL}) que de Stream-aligned (${tc.SA}).` });
  if (cl.low >= 2) al.push({ t: "danger", x: `${cl.low} équipes en clarté rouge. Problème de mandat.` });
  const tg = {}; results.forEach(r => { if (!tg[r.tK]) tg[r.tK] = []; tg[r.tK].push(r.team.name); });
  if ((tg.PL || []).length >= 2) al.push({ t: "info", x: `${tg.PL.length} équipes visent Platform. Besoin de plusieurs ?` });
  Object.entries(ib).filter(([, c]) => c >= 3).forEach(([n, c]) => al.push({ t: "warning", x: `${n} : dépendance de ${c} équipes — goulot.` }));
  if (qs.length > 0) al.push({ t: "danger", x: `${qs.length} dépendance${qs.length > 1 ? "s" : ""} par file d'attente.` });
  return al;
}
function ecoPrios(results, evalTeams, allTeams, cl) {
  if (!cl) { cl = { high: 0, medium: 0, low: 0 }; results.forEach(r => cl[r.cl.lv]++); }
  const tc = { SA: 0, PL: 0, EN: 0, CS: 0 }; results.forEach(r => tc[r.cK]++);
  const qs = []; evalTeams.forEach(x => Object.entries(x.deps || {}).forEach(([ti, m]) => { if (m === "queue" && allTeams[Number(ti)]) qs.push(1); }));
  const pr = [];
  if (cl.low > 0) pr.push(`Clarifier les ${cl.low} équipe${cl.low > 1 ? "s" : ""} en rouge.`);
  if (qs.length > 0) pr.push(`Éliminer les ${qs.length} file${qs.length > 1 ? "s" : ""} d'attente.`);
  if (tc.PL === 0 && tc.SA >= 2) pr.push("Créer une Platform team.");
  const tr = results.filter(r => r.cK !== r.tK);
  if (tr.length > 0) pr.push(`Séquencer les ${tr.length} transition${tr.length > 1 ? "s" : ""} de type.`);
  if (pr.length === 0) pr.push("Direction cohérente. Consolider la clarté.");
  return pr;
}

// ══════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════
export default function App() {
  const [teams, setTeams] = useState([]);
  const [screen, setScreen] = useState("home");
  const [eidx, setEidx] = useState(0);
  const [step, setStep] = useState(0);
  const [sMode, setSMode] = useState("single");
  const [nName, setNName] = useState("");
  const [nSize, setNSize] = useState("");
  const [bText, setBText] = useState("");
  const [prevScreen, setPrevScreen] = useState("home");
  const [loaded, setLoaded] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importErr, setImportErr] = useState("");

  const evalTeams = useMemo(() => teams.filter(t => t.done), [teams]);
  const results = useMemo(() => evalTeams.map(t => ({ ...az(t), team: t })), [evalTeams]);
  const t = teams[eidx] || fresh();
  const others = useMemo(() => teams.filter((_, i) => i !== eidx), [teams, eidx]);

  const patch = useCallback((p) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, ...p } : x)), [eidx]);
  const sCA = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, currentA: { ...x.currentA, [id]: v } } : x)), [eidx]);
  const sTA = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, targetA: { ...x.targetA, [id]: v } } : x)), [eidx]);
  const sCB = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, currentB: { ...x.currentB, [id]: v } } : x)), [eidx]);
  const sTB = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, targetB: { ...x.targetB, [id]: v } } : x)), [eidx]);

  const goEval = (idx) => { setEidx(idx); setStep(0); setPrevScreen(screen); setScreen("eval"); };
  const goView = (idx) => { setEidx(idx); setStep(4); setPrevScreen(screen); setScreen("eval"); };

  // ── PERSISTENCE ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tt-classifier-teams");
      if (saved) setTeams(JSON.parse(saved));
    } catch (e) { /* no saved data */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || teams.length === 0) return;
    try { localStorage.setItem("tt-classifier-teams", JSON.stringify(teams)); } catch (e) { /* silent */ }
  }, [teams, loaded]);

  // ── EXPORT HELPERS ──
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ version: "0.4", date: new Date().toISOString(), teams }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `team-topology-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const importJSON = () => {
    try {
      const data = JSON.parse(importText);
      if (!data.teams || !Array.isArray(data.teams)) { setImportErr("Format invalide : 'teams' manquant."); return; }
      setTeams(data.teams); setShowImport(false); setImportText(""); setImportErr("");
    } catch (e) { setImportErr("JSON invalide."); }
  };
  const exportMD = () => {
    const md = genMarkdown(evalTeams, results, teams);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `team-topology-${new Date().toISOString().slice(0, 10)}.md`; a.click(); URL.revokeObjectURL(url);
  };
  const resetAll = () => {
    setTeams([]); setScreen("home"); setEidx(0); setStep(0);
    try { localStorage.removeItem("tt-classifier-teams"); } catch (e) { /* */ }
  };

  if (!loaded) return <div style={W}><p style={{ color: "#888" }}>Chargement...</p></div>;

  // ── HOME ──
  if (screen === "home") {
    return (
      <div style={W}>
        <h1 style={{ fontSize: 22, marginBottom: 4 }}>Team Topology Classifier</h1>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Évaluez vos équipes · Mappez votre écosystème · Identifiez les gaps</p>

        {evalTeams.length > 0 && (
          <div style={{ ...CD, background: "#f8fafc", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, textTransform: "uppercase" }}>{evalTeams.length} évaluée{evalTeams.length > 1 ? "s" : ""}</div>
            {results.map((r, i) => (
              <div key={i} onClick={() => goView(teams.indexOf(r.team))} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 4px", borderBottom: i < results.length - 1 ? "1px solid #eee" : "none", cursor: "pointer", borderRadius: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, ...LK }}>{r.team.name}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, color: r.cl.c, fontWeight: 600 }}>{r.cP}%</span>
                  <span style={{ fontSize: 12, color: TC[r.cK] }}>{TL[r.cK]}</span>
                </div>
              </div>
            ))}
            {evalTeams.length >= 2 && <button style={{ ...BP, marginTop: 12, width: "100%" }} onClick={() => { setPrevScreen("home"); setScreen("ecosystem"); }}>Voir l'écosystème →</button>}
          </div>
        )}

        {teams.filter(x => !x.done).length > 0 && (
          <div style={{ ...CD, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>En attente :</div>
            {teams.filter(x => !x.done).map((x, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                <span style={{ fontSize: 14 }}>{x.name}</span>
                <button style={BT} onClick={() => goEval(teams.indexOf(x))}>Évaluer</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={BP} onClick={() => { setSMode("single"); setNName(""); setNSize(""); setBText(""); setScreen("setup"); }}>
            {teams.length === 0 ? "Commencer" : "+ Ajouter"}
          </button>
        </div>

        {/* Tools bar */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", borderTop: "1px solid #eee", paddingTop: 16 }}>
          {evalTeams.length > 0 && <button style={BT} onClick={exportMD}>📄 Export Markdown</button>}
          {teams.length > 0 && <button style={BT} onClick={exportJSON}>💾 Export JSON</button>}
          <button style={BT} onClick={() => { setShowImport(true); setImportText(""); setImportErr(""); }}>📥 Importer</button>
          {teams.length > 0 && <button style={{ ...BT, color: "#dc2626", borderColor: "#fecaca" }} onClick={() => { if (confirm("Réinitialiser toutes les données ?")) resetAll(); }}>Réinitialiser</button>}
        </div>

        {showImport && (
          <div style={{ ...CD, marginTop: 12 }}>
            <p style={{ fontSize: 13, color: "#666", margin: "0 0 8px" }}>Collez le contenu du fichier JSON exporté :</p>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={5} style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box", resize: "vertical" }} />
            {importErr && <p style={{ fontSize: 12, color: "#dc2626", margin: "4px 0" }}>{importErr}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button style={BP} onClick={importJSON} disabled={!importText.trim()}>Importer</button>
              <button style={BS} onClick={() => setShowImport(false)}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── SETUP ──
  if (screen === "setup") {
    const bc = bText.split("\n").filter(n => n.trim()).length;
    return (
      <div style={W}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Ajouter des équipes</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button style={{ ...BT, background: sMode === "single" ? "#eff6ff" : "#fff", borderColor: sMode === "single" ? "#2563eb" : "#ddd", color: sMode === "single" ? "#2563eb" : "#555" }} onClick={() => setSMode("single")}>Une à la fois</button>
          <button style={{ ...BT, background: sMode === "batch" ? "#eff6ff" : "#fff", borderColor: sMode === "batch" ? "#2563eb" : "#ddd", color: sMode === "batch" ? "#2563eb" : "#555" }} onClick={() => setSMode("batch")}>Plusieurs d'un coup</button>
        </div>
        {sMode === "single" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input value={nName} onChange={e => setNName(e.target.value)} placeholder="Nom de l'équipe" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 14 }} />
            <input type="number" value={nSize} onChange={e => setNSize(e.target.value)} placeholder="Nombre de membres" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 14, width: 160 }} />
            <button style={BP} disabled={!nName.trim()} onClick={() => { setTeams(p => [...p, { name: nName.trim(), size: nSize, ...fresh() }]); const idx = teams.length; setNName(""); setNSize(""); goEval(idx); }}>Évaluer →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Un nom par ligne.</p>
            <textarea value={bText} onChange={e => setBText(e.target.value)} rows={6} placeholder={"Équipe Payments\nÉquipe Platform\nÉquipe DevX"} style={{ padding: 8, border: "1px solid #ccc", borderRadius: 4, fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
            <button style={BP} disabled={bc === 0} onClick={() => { const ns = bText.split("\n").map(n => n.trim()).filter(Boolean); setTeams(p => [...p, ...ns.map(n => ({ name: n, size: "", ...fresh() }))]); setBText(""); setScreen("home"); }}>Ajouter {bc} équipe{bc > 1 ? "s" : ""}</button>
          </div>
        )}
        <button style={{ ...BS, marginTop: 12 }} onClick={() => setScreen("home")}>← Retour</button>
      </div>
    );
  }

  // ── EVAL ──
  if (screen === "eval") {
    const hdr = (title) => (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}><h2 style={{ fontSize: 18, margin: 0 }}>{title}</h2><span style={{ fontSize: 13, color: "#888" }}>{t.name || ""}</span></div>);

    if (step === 0) return (<div style={W}>{hdr("Bloc A — Profil")}<p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>1 = Jamais · 5 = Toujours</p>
      {BA.map(q => <QR key={q.id} q={q} cur={t.currentA?.[q.id]} tgt={t.targetA?.[q.id]} onC={v => sCA(q.id, v)} onT={v => sTA(q.id, v)} />)}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}><button style={BS} onClick={() => setScreen(prevScreen)}>← Annuler</button><button style={BP} onClick={() => setStep(1)}>Bloc B →</button></div></div>);

    if (step === 1) return (<div style={W}>{hdr("Bloc B — Interactions")}
      {BB.map(q => <QR key={q.id} q={q} cur={t.currentB?.[q.id]} tgt={t.targetB?.[q.id]} onC={v => sCB(q.id, v)} onT={v => sTB(q.id, v)} />)}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}><button style={BS} onClick={() => setStep(0)}>← Bloc A</button><button style={BP} onClick={() => setStep(2)}>Bloc C →</button></div></div>);

    if (step === 2) return (<div style={W}>{hdr("Bloc C — Validation")}
      <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}><span style={{ fontWeight: 600, color: "#999", fontSize: 11 }}>C1</span><p style={{ margin: "2px 0 8px", fontSize: 14 }}>Les autres décrivent cette équipe comme :</p>
        {C1O.map(o => <label key={o.v} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "4px 8px", borderRadius: 4, cursor: "pointer", background: t.c1 === o.v ? "#eff6ff" : "transparent" }}><input type="radio" name="c1" checked={t.c1 === o.v} onChange={() => patch({ c1: o.v })} />{o.l}</label>)}</div>
      <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}><span style={{ fontWeight: 600, color: "#999", fontSize: 11 }}>C2</span><p style={{ margin: "2px 0 8px", fontSize: 14 }}>% du temps demandé par d'autres :</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 11, color: "#888" }}>Auto</span><input type="range" min={0} max={100} step={5} value={t.c2 ?? 50} onChange={e => patch({ c2: Number(e.target.value) })} style={{ flex: 1, accentColor: "#2563eb" }} /><span style={{ fontSize: 11, color: "#888" }}>Demandé</span></div>
        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 700 }}>{t.c2 ?? 50}%</div></div>
      <div style={{ padding: "12px 0" }}><span style={{ fontWeight: 600, color: "#999", fontSize: 11 }}>C3</span><p style={{ margin: "2px 0 8px", fontSize: 14 }}>Prochain recrutement :</p>
        {C3O.map(o => <label key={o.v} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, padding: "4px 8px", borderRadius: 4, cursor: "pointer", background: t.c3 === o.v ? "#eff6ff" : "transparent" }}><input type="radio" name="c3" checked={t.c3 === o.v} onChange={() => patch({ c3: o.v })} />{o.l}</label>)}</div>
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}><button style={BS} onClick={() => setStep(1)}>← Bloc B</button><button style={BP} onClick={() => setStep(others.length > 0 ? 3 : 4)}>{others.length > 0 ? "Dépendances →" : "Résultats →"}</button></div></div>);

    if (step === 3) return (<div style={W}>{hdr("Dépendances")}
      <p style={{ fontSize: 13, color: "#666", marginBottom: 14 }}>Pour livrer, <strong>{t.name}</strong> dépend-elle d'autres équipes ?</p>
      {others.map(ot => { const oi = teams.indexOf(ot); const dep = t.deps?.[oi]; const on = !!dep; return (
        <div key={oi} style={{ ...CD, background: on ? "#f8fafc" : "#fff" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            <input type="checkbox" checked={on} onChange={() => { const nd = { ...(t.deps || {}) }; if (on) delete nd[oi]; else nd[oi] = "selfservice"; patch({ deps: nd }); }} />{ot.name}</label>
          {on && <div style={{ display: "flex", gap: 6, marginTop: 8, marginLeft: 28 }}>{DM.map(m => <button key={m.v} onClick={() => patch({ deps: { ...(t.deps || {}), [oi]: m.v } })} style={{ ...BT, background: dep === m.v ? m.c + "18" : "#fff", borderColor: dep === m.v ? m.c : "#ddd", color: dep === m.v ? m.c : "#888", fontWeight: dep === m.v ? 600 : 400 }}>{m.l}</button>)}</div>}
        </div>); })}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}><button style={BS} onClick={() => setStep(2)}>← Bloc C</button><button style={BP} onClick={() => { patch({ done: true }); setStep(4); }}>Résultats →</button></div></div>);

    // ── RESULTS (step 4) ──
    if (step === 4) {
      const a = az(t); const acts = ACT[a.tK] || []; const fl = flags(t, a);
      const pending = teams.filter(x => !x.done);
      return (
        <div style={W}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}><h2 style={{ fontSize: 20, margin: 0 }}>{t.name}</h2><span style={{ fontSize: 13, color: "#888" }}>{t.size && `${t.size} membres`}</span></div>
          <div style={{ padding: 16, borderRadius: 10, marginBottom: 14, background: a.cl.bg, border: `2px solid ${a.cl.bd}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase" }}>Indice de clarté</span><span style={{ fontSize: 26, fontWeight: 800, color: a.cl.c }}>{a.cP}%</span></div>
            <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3 }}><div style={{ height: "100%", borderRadius: 3, width: `${a.cP}%`, background: a.cl.c }} /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", margin: "14px 0" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "#888" }}>AUJOURD'HUI</div><div style={{ fontSize: 16, fontWeight: 700, color: TC[a.cK] }}>{TL[a.cK]}</div><div style={{ fontSize: 12, color: "#888" }}>{a.cP}%</div></div>
            <div style={{ fontSize: 22, color: a.cK !== a.tK ? "#d97706" : "#059669" }}>→</div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "#888" }}>OBJECTIF</div><div style={{ fontSize: 16, fontWeight: 700, color: TC[a.tK] }}>{TL[a.tK]}</div><div style={{ fontSize: 12, color: "#888" }}>{a.tP}%</div></div>
          </div>
          <div style={{ marginBottom: 14 }}>{TK.map(k => <MB key={k} label={TL[k]} cur={a.tC[k]} tgt={a.tT[k]} color={TC[k]} />)}</div>
          <div style={{ ...CD, background: "#f8fafc" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Plan 80/20 — Devenir {TL[a.tK]}</div>
            {acts.map((act, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}><div style={{ minWidth: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: TC[a.tK], color: "#fff", fontWeight: 700, fontSize: 11 }}>{i + 1}</div><p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{act}</p></div>)}
          </div>
          {fl.length > 0 && <div style={{ marginTop: 10 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Signaux</div>{fl.map((f, i) => <Fl key={i} type={f.t} text={f.x} />)}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button style={BS} onClick={() => setScreen(prevScreen)}>← Retour</button>
            <button style={BT} onClick={() => setStep(0)}>✏️ Modifier les réponses</button>
            {pending.length > 0 && <button style={BP} onClick={() => goEval(teams.indexOf(pending[0]))}>Suivante →</button>}
            {evalTeams.length >= 2 && <button style={{ ...BP, background: "#059669" }} onClick={() => { setPrevScreen("eval"); setScreen("ecosystem"); }}>Écosystème →</button>}
          </div>
        </div>
      );
    }
    return <div style={W}><p>Chargement...</p></div>;
  }

  // ── ECOSYSTEM ──
  if (screen === "ecosystem") {
    const tc = { SA: 0, PL: 0, EN: 0, CS: 0 }, cl = { high: 0, medium: 0, low: 0 }, tt = { SA: 0, PL: 0, EN: 0, CS: 0 };
    results.forEach(r => { tc[r.cK]++; cl[r.cl.lv]++; tt[r.tK]++; });
    const dL = []; evalTeams.forEach(x => Object.entries(x.deps || {}).forEach(([ti, m]) => { const tg = teams[Number(ti)]; if (!tg) return; dL.push({ from: x.name, to: tg.name, mode: m }); }));
    const al = ecoAlerts(results, evalTeams, teams);
    const pr = ecoPrios(results, evalTeams, teams, cl);

    return (
      <div style={W}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}><h2 style={{ fontSize: 20, margin: 0 }}>Écosystème</h2><span style={{ fontSize: 13, color: "#888" }}>{evalTeams.length} équipes</span></div>
        <div style={{ ...CD, background: "#f8fafc" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
            {[["high", "#059669", "Claire"], ["medium", "#d97706", "Brouillée"], ["low", "#dc2626", "Absente"]].map(([k, c, l]) => <div key={k} style={{ textAlign: "center", flex: 1, minWidth: 70 }}><div style={{ fontSize: 22, fontWeight: 800, color: c }}>{cl[k]}</div><div style={{ fontSize: 11, color: "#888" }}>{l}</div></div>)}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {TK.map(k => <div key={k} style={{ fontSize: 12, color: TC[k] }}><strong>{tc[k]}</strong> {TL[k]}{tt[k] !== tc[k] && <span style={{ color: "#888" }}> → {tt[k]}</span>}</div>)}
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "#888", margin: "16px 0 8px", textTransform: "uppercase" }}>Carte de mouvement</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {TK.map(k => {
            const here = results.filter(r => r.cK === k), arr = results.filter(r => r.tK === k && r.cK !== k);
            return (<div key={k} style={{ border: `2px solid ${TC[k]}22`, borderRadius: 10, padding: 10, minHeight: 70, background: `${TC[k]}06` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TC[k], marginBottom: 6, textTransform: "uppercase" }}>{TL[k]}</div>
              {here.length === 0 && arr.length === 0 && <div style={{ fontSize: 12, color: "#ccc" }}>—</div>}
              {here.map((r, i) => <div key={i} onClick={() => goView(teams.indexOf(r.team))} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, cursor: "pointer" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: r.cl.c, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, ...LK }}>{r.team.name}</span>
                <span style={{ fontSize: 11, color: r.cl.c, fontWeight: 600 }}>{r.cP}%</span>
                {r.cK !== r.tK && <span style={{ fontSize: 11, color: TC[r.tK] }}>→ {TL[r.tK]}</span>}
              </div>)}
              {arr.map((r, i) => <div key={`a${i}`} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, opacity: 0.45 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", border: `2px dashed ${TC[k]}`, boxSizing: "border-box", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#888" }}>{r.team.name} ← arrive</span>
              </div>)}
            </div>);
          })}
        </div>

        {dL.length > 0 && <><div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>Dépendances</div><div style={CD}>{dL.map((d, i) => { const mi = DM.find(m => m.v === d.mode) || DM[0]; return <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 13 }}><span style={{ fontWeight: 600 }}>{d.from}</span><span style={{ color: "#888" }}>→</span><span style={{ fontWeight: 600 }}>{d.to}</span><span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 4, background: mi.c + "18", color: mi.c, fontWeight: 600 }}>{mi.l}</span></div>; })}</div></>}
        {al.length > 0 && <><div style={{ fontSize: 12, fontWeight: 600, color: "#888", margin: "14px 0 6px", textTransform: "uppercase" }}>Signaux</div>{al.map((a, i) => <Fl key={i} type={a.t} text={a.x} />)}</>}

        <div style={{ ...CD, background: "#f8fafc", marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Plan d'action écosystème</div>
          {pr.map((p, i) => <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}><div style={{ minWidth: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 11 }}>{i + 1}</div><p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{p}</p></div>)}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          <button style={BS} onClick={() => setScreen("home")}>← Accueil</button>
          <button style={BT} onClick={() => { setSMode("single"); setNName(""); setNSize(""); setScreen("setup"); }}>+ Équipe</button>
          <button style={BT} onClick={exportMD}>📄 Markdown</button>
          <button style={BT} onClick={exportJSON}>💾 JSON</button>
        </div>
      </div>
    );
  }

  return null;
}
