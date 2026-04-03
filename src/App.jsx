import { useState, useMemo, useCallback } from "react";
import { fresh } from "./data/constants";
import { analyze } from "./scoring/analyze";
import { exportJSON, downloadMD, parseImport, genMD } from "./export/io";
import { useStorage } from "./hooks/useStorage";
import MDPreview from "./components/MDPreview";
import { W } from "./styles";

import {
  HomeScreen, SetupScreen,
  EvalBlocA, EvalBlocB, EvalBlocC, EvalImpacts,
  ResultsScreen, EcosystemScreen,
} from "./screens";

export default function App() {
  // ── STATE ──
  const [teams, setTeams, loaded, resetStorage] = useStorage("ttc-teams", []);
  const [screen, setScreen] = useState("home");
  const [eidx, setEidx] = useState(0);
  const [step, setStep] = useState(0);
  const [sMode, setSMode] = useState("single");
  const [nName, setNName] = useState("");
  const [bText, setBText] = useState("");
  const [prev, setPrev] = useState("home");
  const [showTools, setShowTools] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [impText, setImpText] = useState("");
  const [impErr, setImpErr] = useState("");
  const [showMD, setShowMD] = useState(false);
  const [mdText, setMdText] = useState("");
  const [showAllFlags, setShowAllFlags] = useState(false);
  const [showDist, setShowDist] = useState(false);

  // ── DERIVED ──
  const evTeams = useMemo(() => teams.filter(t => t.done), [teams]);
  const results = useMemo(() => evTeams.map(t => ({ ...analyze(t), team: t })), [evTeams]);
  const t = teams[eidx] || fresh();
  const others = useMemo(() => teams.filter((_, i) => i !== eidx), [teams, eidx]);
  const pending = useMemo(() => teams.filter(x => !x.done), [teams]);

  // ── MUTATORS ──
  const patch = useCallback(p => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, ...p } : x)), [eidx, setTeams]);
  const sCA = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, cA: { ...x.cA, [id]: v } } : x)), [eidx, setTeams]);
  const sTA = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, tA: { ...x.tA, [id]: v } } : x)), [eidx, setTeams]);
  const sCB = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, cB: { ...x.cB, [id]: v } } : x)), [eidx, setTeams]);
  const sTB = useCallback((id, v) => setTeams(ts => ts.map((x, i) => i === eidx ? { ...x, tB: { ...x.tB, [id]: v } } : x)), [eidx, setTeams]);

  // ── NAVIGATION ──
  const goEval = useCallback(idx => { setEidx(idx); setStep(0); setPrev(screen); setScreen("eval"); }, [screen]);
  const goView = useCallback(idx => { setEidx(idx); setStep(4); setPrev(screen); setScreen("eval"); setShowAllFlags(false); setShowDist(false); }, [screen]);

  // ── ACTIONS ──
  const previewMD = () => { setMdText(genMD(results, teams)); setShowMD(true); };
  const doDownloadMD = () => { downloadMD(showMD ? mdText : genMD(results, teams)); setShowMD(false); };
  const doImport = raw => { try { setTeams(parseImport(raw)); setShowImport(false); setImpText(""); setImpErr(""); } catch (e) { setImpErr(e.message); } };
  const doReset = () => { if (confirm("Exporter avant de réinitialiser ?")) exportJSON(teams); resetStorage(); setScreen("home"); setEidx(0); setStep(0); };

  const mdModal = showMD ? <MDPreview mdText={mdText} onDownload={doDownloadMD} onClose={() => setShowMD(false)} /> : null;

  if (!loaded) return <div style={W}><p style={{ color: "#888" }}>Chargement...</p></div>;

  // ── ROUTER ──
  if (screen === "home") return (
    <HomeScreen
      teams={teams} evTeams={evTeams} results={results} pending={pending}
      goEval={goEval} goView={goView} previewMD={previewMD}
      doImport={doImport} doReset={doReset}
      onEcosystem={() => { setPrev("home"); setScreen("ecosystem"); }}
      showTools={showTools} setShowTools={setShowTools}
      showImport={showImport} setShowImport={setShowImport}
      impText={impText} setImpText={setImpText} impErr={impErr} setImpErr={setImpErr}
      onAddTeam={() => { setSMode("single"); setNName(""); setBText(""); setScreen("setup"); }}
      mdModal={mdModal}
    />
  );

  if (screen === "setup") return (
    <SetupScreen
      sMode={sMode} setSMode={setSMode} nName={nName} setNName={setNName}
      bText={bText} setBText={setBText}
      teams={teams} setTeams={setTeams} goEval={goEval}
      onBack={() => setScreen("home")}
    />
  );

  if (screen === "eval") {
    if (step === 0) return <EvalBlocA team={t} sCA={sCA} sTA={sTA} onNext={() => setStep(1)} onCancel={() => setScreen(prev)} />;
    if (step === 1) return <EvalBlocB team={t} sCB={sCB} sTB={sTB} patch={patch} onNext={() => setStep(2)} onBack={() => setStep(0)} />;
    if (step === 2) return (
      <EvalBlocC team={t} patch={patch} hasOthers={others.length > 0}
        onNext={() => { if (others.length > 0) setStep(3); else { patch({ done: true }); setStep(4); } }}
        onBack={() => setStep(1)}
      />
    );
    if (step === 3) return (
      <EvalImpacts team={t} others={others} teams={teams} patch={patch}
        onNext={() => { patch({ done: true }); setStep(4); }}
        onBack={() => setStep(2)}
      />
    );
    if (step === 4) return (
      <ResultsScreen
        team={t} pending={pending} evTeams={evTeams}
        showDist={showDist} setShowDist={setShowDist}
        showAllFlags={showAllFlags} setShowAllFlags={setShowAllFlags}
        onBack={() => setScreen(prev)}
        onEdit={() => { setStep(0); setShowAllFlags(false); setShowDist(false); }}
        onNextTeam={() => goEval(teams.indexOf(pending[0]))}
        onEcosystem={() => { setPrev("eval"); setScreen("ecosystem"); }}
        mdModal={mdModal}
      />
    );
    return <div style={W}><p>Chargement...</p></div>;
  }

  if (screen === "ecosystem") return (
    <EcosystemScreen
      results={results} teams={teams} goView={goView} previewMD={previewMD}
      onBack={() => setScreen("home")}
      onAddTeam={() => { setSMode("single"); setNName(""); setScreen("setup"); }}
      mdModal={mdModal}
    />
  );

  return null;
}
