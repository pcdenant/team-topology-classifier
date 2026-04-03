import { BP, BS, BT } from '../styles';

export default function MDPreview({ mdText, onDownload, onClose }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 12, maxWidth: 640, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Aperçu Markdown</span>
          <button style={BT} onClick={onClose}>✕</button>
        </div>
        <pre style={{ padding: 16, fontSize: 11, overflow: "auto", flex: 1, whiteSpace: "pre-wrap", margin: 0, background: "#f9fafb" }}>{mdText}</pre>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
          <button style={BP} onClick={onDownload}>Télécharger</button>
          <button style={BS} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
