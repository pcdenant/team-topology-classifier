import { TL, TK } from '../data/constants';

export function ecoData(results, allTeams) {
  const tc = { SA: 0, PL: 0, EN: 0, CS: 0 };
  const cl = { high: 0, medium: 0, low: 0 };
  const tt = { SA: 0, PL: 0, EN: 0, CS: 0 };
  results.forEach(r => { tc[r.cK]++; cl[r.cl.lv]++; tt[r.tK]++; });

  // Group deps by target
  const byTgt = {};
  results.forEach(r => Object.entries(r.team.deps || {}).forEach(([ti, imp]) => {
    const tg = allTeams[Number(ti)];
    if (!tg) return;
    if (!byTgt[tg.name]) byTgt[tg.name] = [];
    byTgt[tg.name].push({ from: r.team.name, imp });
  }));

  // Diagnostics (fused alert + action)
  const diag = [];
  if (cl.low >= 2) diag.push({ t: "danger", prob: `${cl.low} équipes en clarté rouge`, act: "Clarifier leur mandat avant toute autre action." });
  else if (cl.low === 1) {
    const nm = results.find(r => r.cl.lv === "low")?.team.name;
    if (nm) diag.push({ t: "danger", prob: `${nm} n'a pas d'identité claire`, act: "Restreindre son mandat ou splitter." });
  }

  const blocked = [];
  Object.entries(byTgt).forEach(([name, deps]) => {
    const bl = deps.filter(d => d.imp === "blocked");
    if (bl.length > 0) blocked.push({ name, count: bl.length });
  });
  blocked.forEach(b => diag.push({ t: "danger", prob: `${b.name} bloque ${b.count} équipe${b.count > 1 ? "s" : ""}`, act: "Transformer ces interactions en libre-service." }));

  if (tc.SA === 0) diag.push({ t: "danger", prob: "Aucune Stream-aligned", act: "Qui livre aux clients ?" });
  if (tc.PL === 0 && tc.SA >= 2) diag.push({ t: "warning", prob: `${tc.SA} Stream-aligned sans Platform`, act: "Créer une Platform team." });
  if (tc.PL > tc.SA && tc.SA > 0) diag.push({ t: "warning", prob: `Plus de Platform (${tc.PL}) que de Stream-aligned (${tc.SA})`, act: "Ratio inversé." });

  const tg = {};
  results.forEach(r => { if (!tg[r.tK]) tg[r.tK] = []; tg[r.tK].push(r.team.name); });
  if ((tg.PL || []).length >= 2) diag.push({ t: "info", prob: `${tg.PL.length} équipes visent Platform`, act: "Besoin de plusieurs platforms ?" });

  // Priorities
  const pr = [];
  if (cl.low > 0) pr.push(`Clarifier les ${cl.low} équipe${cl.low > 1 ? "s" : ""} en rouge.`);
  const blk = blocked.map(b => b.name);
  if (blk.length > 0) pr.push(`Débloquer : ${blk.join(", ")}.`);
  if (tc.PL === 0 && tc.SA >= 2) pr.push("Créer une Platform team.");
  const tr = results.filter(r => r.cK !== r.tK);
  if (tr.length > 0) pr.push(`Séquencer ${tr.length} transition${tr.length > 1 ? "s" : ""} de type.`);
  if (pr.length === 0) pr.push("Direction cohérente. Consolider.");

  // Intro
  let intro = `${results.length} équipes. `;
  if (cl.low >= 2) intro += `${cl.low} en clarté rouge. `;
  else if (cl.low === 1) intro += "1 sans identité claire. ";
  if (blk.length > 0) intro += `${blk.join(", ")} bloque${blk.length > 1 ? "nt" : ""} d'autres équipes.`;
  else if (cl.low === 0) intro += "Pas d'alerte majeure.";

  return { tc, cl, tt, byTgt, diag, pr, intro };
}
