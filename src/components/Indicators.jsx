import { C, TYPE_CLR } from '../styles';

export function MiniBar({ label, cur, tgt, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ fontWeight: 700, color }}>{label}</span>
        <span style={{ color: C.textLight, fontFamily: "monospace", fontSize: 11 }}>{cur}% → {tgt}%</span>
      </div>
      <div style={{ position: "relative", height: 8, background: C.borderLight, borderRadius: 4 }}>
        <div style={{ position: "absolute", height: "100%", width: `${tgt}%`, background: color, opacity: 0.15, borderRadius: 4 }} />
        <div style={{ position: "absolute", height: "100%", width: `${cur}%`, background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

export function Flag({ t: type, x: text }) {
  const map = { danger: { bg: C.dangerBg, bc: C.danger }, warning: { bg: C.warningBg, bc: C.warning }, info: { bg: C.infoBg, bc: C.info } };
  const s = map[type] || map.info;
  return (
    <div style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 10, fontSize: 13, lineHeight: 1.6, background: s.bg, borderLeft: `4px solid ${s.bc}` }}>
      {text}
    </div>
  );
}

export function Diagnostic({ t, prob, act }) {
  const map = { danger: { bg: C.dangerBg, bc: C.danger }, warning: { bg: C.warningBg, bc: C.warning }, info: { bg: C.infoBg, bc: C.info } };
  const s = map[t] || map.info;
  return (
    <div style={{ padding: "12px 16px", marginBottom: 8, borderRadius: 10, background: s.bg, borderLeft: `4px solid ${s.bc}` }}>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>{prob}</div>
      <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>→ {act}</div>
    </div>
  );
}
