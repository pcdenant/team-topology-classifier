import { useState } from "react";
import { C, SIDEBAR_W, BP, BD, LABEL_W, LK, CLAR_CLR } from "../styles";
import { TL } from "../data/constants";

export default function Layout({ children, teams, evTeams, results, screen, onAddTeam, onTeamClick, onExport }) {
  const [collapsed, setCollapsed] = useState(false);
  const pending = teams.filter(t => !t.done);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 56 : SIDEBAR_W, flexShrink: 0, background: C.vert,
        display: "flex", flexDirection: "column", padding: collapsed ? "24px 8px" : "28px 20px",
        transition: "width 0.25s ease", overflow: "hidden", position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: C.jaune,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.vertDark, fontWeight: 900, fontSize: 15, flexShrink: 0,
          }}>TT</div>
          {!collapsed && <span style={{ color: "#fff", fontSize: 15, fontWeight: 800, whiteSpace: "nowrap" }}>TT Classifier</span>}
        </div>

        {!collapsed && (
          <>
            {/* Team list */}
            {evTeams.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...LABEL_W, marginBottom: 10 }}>Équipes</div>
                {results.map((r, i) => (
                  <div key={i} onClick={() => onTeamClick(teams.indexOf(r.team))}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 12px", borderRadius: 8, marginBottom: 2,
                      cursor: "pointer", transition: "background 0.12s",
                      background: "transparent",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: CLAR_CLR[r.cl.lv], flexShrink: 0 }} />
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.team.name}</span>
                    <span style={{ fontSize: 11, color: "#ffffff66", flexShrink: 0 }}>{r.cP}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...LABEL_W, opacity: 0.5, marginBottom: 8 }}>En attente ({pending.length})</div>
                {pending.map((t, i) => (
                  <div key={i} onClick={() => onTeamClick(teams.indexOf(t), true)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", cursor: "pointer", borderRadius: 8, transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px dashed #ffffff44", flexShrink: 0 }} />
                    <span style={{ color: "#ffffffaa", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Bottom actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button style={BP} onClick={onAddTeam}>+ Ajouter</button>
              {evTeams.length > 0 && <button style={BD} onClick={onExport}>Exporter</button>}
            </div>
          </>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 900, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
