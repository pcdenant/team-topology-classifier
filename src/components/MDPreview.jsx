import { BP, BS, BT, C } from '../styles';

export default function MDPreview({ mdText, onDownload, onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: C.white, borderRadius: 16, maxWidth: 680, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Aperçu Markdown</span>
          <button style={BT} onClick={onClose}>✕</button>
        </div>
        <pre style={{ padding: 24, fontSize: 12, overflow: "auto", flex: 1, whiteSpace: "pre-wrap", margin: 0, background: C.creme, lineHeight: 1.6 }}>{mdText}</pre>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
          <button style={BP} onClick={onDownload}>Télécharger</button>
          <button style={BS} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
