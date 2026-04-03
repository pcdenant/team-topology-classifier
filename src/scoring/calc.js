export function calc(ans, bloc, keys) {
  const s = {};
  keys.forEach(k => s[k] = 0);
  bloc.forEach(q => {
    if (q.sig === "flag" || q.sig === "PL_CS") return;
    if (s[q.sig] !== undefined) s[q.sig] += (ans[q.id] || 0);
  });
  const a6 = bloc.find(q => q.sig === "PL_CS");
  if (a6 && ans[a6.id]) {
    if ((s.PL || 0) >= (s.CS || 0)) s.PL += ans[a6.id];
    else s.CS += ans[a6.id];
  }
  const tot = Object.values(s).reduce((a, b) => a + b, 0);
  const p = {};
  keys.forEach(k => p[k] = tot > 0 ? Math.round((s[k] / tot) * 100) : 0);
  return p;
}

export function dom(sc) {
  return Object.entries(sc).sort((a, b) => b[1] - a[1])[0] || ["SA", 0];
}

export function dom2(sc) {
  return Object.entries(sc).sort((a, b) => b[1] - a[1])[1] || ["PL", 0];
}

export function clar(p) {
  if (p >= 60) return { lv: "high", c: "#059669", bg: "#ecfdf5", bd: "#a7f3d0", lb: "Claire" };
  if (p >= 40) return { lv: "medium", c: "#d97706", bg: "#fffbeb", bd: "#fde68a", lb: "Brouillée" };
  return { lv: "low", c: "#dc2626", bg: "#fef2f2", bd: "#fecaca", lb: "Absente" };
}
