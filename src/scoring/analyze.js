import { BA } from '../data/questions';
import { TL, TK } from '../data/constants';
import { calc, dom, dom2, clar } from './calc';

export function analyze(t) {
  const tC = calc(t.cA || {}, BA, TK);
  const tT = calc(t.tA || {}, BA, TK);
  const [cK, cP] = dom(tC);
  const [tK, tP] = dom(tT);
  const [c2K] = dom2(tC);
  return { tC, tT, cK, cP, tK, tP, c2K, cl: clar(cP) };
}

export function getFlags(t, a) {
  const f = [];
  if (a.cK === "PL" && (t.cA?.A9 || 0) >= 3)
    f.push({ t: "danger", x: "Contournement — d'autres équipes développent leurs propres solutions." });
  if (a.cK === "SA" && (t.cA?.A10 || 0) <= 2 && t.cA?.A10)
    f.push({ t: "warning", x: "Autonomie insuffisante pour une stream-aligned." });
  if ((t.cA?.A3 || 0) >= 4 && (t.cA?.A7 || 0) <= 2 && t.cA?.A7)
    f.push({ t: "warning", x: "Piège du support permanent." });
  if ((t.cB?.B4 || 0) >= 4)
    f.push({ t: "danger", x: "Anti-pattern : les autres soumettent des demandes et attendent." });
  if (t.b5idk)
    f.push({ t: "warning", x: "Les modes d'interaction ne sont pas pilotés intentionnellement." });
  else if ((t.cB?.B5 || 0) <= 2 && t.cB?.B5)
    f.push({ t: "info", x: "Interaction figée dans le temps." });
  if (t.c1 && t.c1 !== "unknown" && t.c1 !== a.cK)
    f.push({ t: "warning", x: `Décalage : vos pairs voient "${TL[t.c1]}", le profil indique "${TL[a.cK]}".` });
  if (t.c1 === "unknown")
    f.push({ t: "info", x: "Positionnement flou aux yeux de vos pairs." });
  if (t.c3 && t.c3 !== a.cK)
    f.push({ t: "info", x: `Compétence à renforcer ("${TL[t.c3]}") ≠ type actuel ("${TL[a.cK]}").` });
  const prio = { danger: 0, warning: 1, info: 2 };
  return f.sort((a, b) => (prio[a.t] || 2) - (prio[b.t] || 2));
}
