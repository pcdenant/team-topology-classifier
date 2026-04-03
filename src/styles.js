// ── Brand Colors ──
export const C = {
  vert: "#006946",
  vertDark: "#004d34",
  vertLight: "#e6f2ed",
  vert10: "#00694618",
  vert20: "#00694633",
  jaune: "#FFF200",
  jauneMuted: "#E6D900",
  jauneDark: "#B8AA00",
  creme: "#FBF3EB",
  cremeDark: "#f0e4d6",
  bg: "#f4f1ec",
  white: "#fff",
  text: "#1a1a1a",
  textMuted: "#666",
  textLight: "#999",
  border: "#e5e7eb",
  borderLight: "#f0f0f0",
  danger: "#dc2626",
  dangerBg: "#fef2f2",
  warning: "#d97706",
  warningBg: "#fffbeb",
  info: "#2563eb",
  infoBg: "#eff6ff",
  purple: "#7c3aed",
};

// ── Type colors (override vert for SA, jaune for EN) ──
export const TYPE_CLR = {
  SA: C.vert,
  PL: C.purple,
  EN: C.warning,
  CS: C.danger,
};

// ── Clarity colors ──
export const CLAR_CLR = { high: C.vert, medium: C.warning, low: C.danger };

// ── Sidebar ──
export const SIDEBAR_W = 260;

// ── Layout ──
export const MAIN = {
  padding: "32px 36px",
  minHeight: "100vh",
};

// ── Buttons ──
export const BTN = {
  base: { border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.15s" },
};
export const BP = { ...BTN.base, padding: "10px 22px", background: C.jaune, color: C.vertDark, fontSize: 14, fontWeight: 700 };
export const BS = { ...BTN.base, padding: "10px 22px", background: C.white, color: C.text, border: `1px solid ${C.border}` };
export const BT = { ...BTN.base, padding: "6px 14px", background: C.white, color: C.textMuted, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500 };
export const BD = { ...BTN.base, padding: "6px 14px", background: "transparent", color: "#ffffff99", border: "1px solid #ffffff33", fontSize: 12 };

// ── Cards ──
export const CARD = { padding: 24, borderRadius: 14, background: C.white, border: `1px solid ${C.border}` };
export const CARD_CREME = { ...CARD, background: C.creme, border: "none" };
export const CARD_VERT = { ...CARD, background: C.vert, border: "none", color: "#fff" };

// ── Labels ──
export const LABEL = { fontSize: 11, fontWeight: 700, color: C.vert, textTransform: "uppercase", letterSpacing: "0.06em" };
export const LABEL_W = { ...LABEL, color: C.jaune };
export const LABEL_MUTED = { ...LABEL, color: C.textLight };

// ── Links ──
export const LK = { cursor: "pointer", borderBottom: `1px dotted ${C.vert}44` };

// ── Badge ──
export const badge = (bg, color) => ({
  display: "inline-block", padding: "3px 10px", borderRadius: 20,
  background: bg, color, fontWeight: 700, fontSize: 12,
});
