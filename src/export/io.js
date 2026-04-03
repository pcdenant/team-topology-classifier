import { TL, TK } from '../data/constants';
import { IMP } from '../data/questions';
import { ACTS } from '../data/actions';
import { getFlags } from '../scoring/analyze';
import { ecoData } from '../scoring/ecosystem';

export function exportJSON(teams) {
  const blob = new Blob(
    [JSON.stringify({ version: "0.5", date: new Date().toISOString(), teams }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `team-topology-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMD(mdText) {
  const blob = new Blob([mdText], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `team-topology-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImport(raw) {
  const d = JSON.parse(raw);
  if (!d.teams || !Array.isArray(d.teams)) throw new Error("Format invalide.");
  return d.teams;
}

export function genMD(results, allTeams) {
  const d = new Date().toISOString().slice(0, 10);
  const eco = ecoData(results, allTeams);
  let md = `# Team Topology Assessment — ${d}\n\n## Résumé\n\n`;
  md += `- **${results.length}** équipes\n`;
  md += `- **Clarté :** ${eco.cl.high} claire, ${eco.cl.medium} brouillée, ${eco.cl.low} absente\n`;
  md += `- **Composition :** ${TK.map(k => `${eco.tc[k]} ${TL[k]}`).join(", ")}\n\n`;

  if (eco.diag.length > 0) {
    md += `### Diagnostics\n\n`;
    eco.diag.forEach(d => {
      const ic = d.t === "danger" ? "🔴" : d.t === "warning" ? "🟡" : "🔵";
      md += `- ${ic} **${d.prob}** → ${d.act}\n`;
    });
    md += "\n";
  }

  if (eco.pr.length > 0) {
    md += `### Plan d'action\n\n`;
    eco.pr.forEach((p, i) => { md += `${i + 1}. ${p}\n`; });
    md += "\n---\n\n";
  }

  results.forEach(r => {
    const fl = getFlags(r.team, r);
    md += `## ${r.team.name}\n\n`;
    md += `- **Type :** ${TL[r.cK]} (${r.cP}%) → ${TL[r.tK]} (${r.tP}%)\n`;
    md += `- **Clarté :** ${r.cP}% — ${r.cl.lb}\n\n`;
    md += `### Plan 80/20\n\n`;
    (ACTS[r.tK] || []).forEach((a, i) => { md += `${i + 1}. ${a}\n`; });

    if (fl.length > 0) {
      md += `\n### Signaux\n\n`;
      fl.forEach(f => {
        const ic = f.t === "danger" ? "🔴" : f.t === "warning" ? "🟡" : "🔵";
        md += `- ${ic} ${f.x}\n`;
      });
    }

    const deps = Object.entries(r.team.deps || {})
      .map(([ti, imp]) => ({ to: allTeams[Number(ti)]?.name, imp }))
      .filter(d => d.to);
    if (deps.length > 0) {
      md += `\n### Impacts\n\n`;
      deps.forEach(dep => {
        const il = IMP.find(i => i.v === dep.imp)?.l || dep.imp;
        md += `- → ${dep.to} (${il})\n`;
      });
    }
    md += "\n---\n\n";
  });

  return md;
}
