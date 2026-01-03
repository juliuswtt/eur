
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, Eye, ShieldAlert, Terminal, Lock, Unlock, 
  Search, Database, Camera, Zap, Skull, FileText, 
  Ghost, Radio, Map as MapIcon, Layers, HardDrive, 
  Activity, Fingerprint, Network, AlertTriangle,
  Move // Added missing Move icon
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

// Landmark Definitionen basierend auf Little St. James
const LANDMARKS = [
  { id: 'temple', name: 'The Temple', x: 2600, y: 400, color: '#3b82f6', description: 'Blue-striped structure. Rumored elevator to sub-levels.' },
  { id: 'mansion', name: 'Main Mansion', x: 1500, y: 1200, color: '#f59e0b', description: 'High security residential area. Files stored in the office.' },
  { id: 'library', name: 'The Library', x: 800, y: 1500, color: '#10b981', description: 'Deep archives. Look for "The List".' },
  { id: 'tunnels', name: 'Underground Network', x: 1500, y: 1500, color: '#ef4444', isSecret: true },
  { id: 'docks', name: 'Private Docks', x: 500, y: 2500, color: '#6366f1', description: 'Entry point. Avoid the spotlight.' }
];

interface LeakFragment {
  id: string;
  title: string;
  content: string;
  isCollected: boolean;
  x: number;
  y: number;
}

const INITIAL_FRAGMENTS: LeakFragment[] = [
  { id: 'f1', title: 'Flight Log 2002', content: 'Tail Number N212JE. Passengers: "The Prince", "The Billionaire", "The Physicist".', isCollected: false, x: 820, y: 1480 },
  { id: 'f2', title: 'CCTV Tape #04', content: 'Date: 03/12/2014. Guest "The Tech Mogul" entering sub-level 2.', isCollected: false, x: 2620, y: 420 },
  { id: 'f3', title: 'The List (Partially Redacted)', content: 'Confirmed visits from "Bubba 42" and "The Royal Duke".', isCollected: false, x: 1550, y: 1150 },
  { id: 'f4', title: 'Encrypted Drive', content: 'Contains raw data from the main server room.', isCollected: false, x: 1480, y: 1600 }
];

interface Guard {
  id: number;
  x: number;
  y: number;
  path: {x: number, y: number}[];
  currentPathIdx: number;
  speed: number;
}

const IslandExplorerGame: React.FC<Props> = ({ onBack }) => {
  const [playerPos, setPlayerPos] = useState({ x: 550, y: 2450 });
  const [exposure, setExposure] = useState(0); // 0-100 Detection Meter
  const [isCrouching, setIsCrouching] = useState(false);
  const [fragments, setFragments] = useState<LeakFragment[]>(INITIAL_FRAGMENTS);
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'INFILTRATING' | 'CAUGHT' | 'LEAKED'>('INFILTRATING');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [terminalLog, setTerminalLog] = useState<string[]>(['BOOTING STEALTH_OS...', 'CONNECTION ESTABLISHED.', 'OBJECTIVE: EXPOSE THE TRUTH.']);
  
  const viewportRef = useRef<HTMLDivElement>(null);

  // Guards AI
  const [guards, setGuards] = useState<Guard[]>([
    { id: 1, x: 1000, y: 1500, speed: 4, currentPathIdx: 0, path: [{x: 800, y: 1500}, {x: 1200, y: 1500}] },
    { id: 2, x: 2500, y: 600, speed: 5, currentPathIdx: 0, path: [{x: 2400, y: 600}, {x: 2800, y: 600}] },
    { id: 3, x: 1500, y: 1100, speed: 3, currentPathIdx: 0, path: [{x: 1500, y: 1000}, {x: 1500, y: 1300}] }
  ]);

  // Game Loop
  useEffect(() => {
    if (gameStatus !== 'INFILTRATING') return;

    const interval = setInterval(() => {
      // 1. Guard Movement
      setGuards(prevGuards => prevGuards.map(g => {
        const target = g.path[g.currentPathIdx];
        const dx = target.x - g.x;
        const dy = target.y - g.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 5) {
          const nextIdx = (g.currentPathIdx + 1) % g.path.length;
          return { ...g, currentPathIdx: nextIdx };
        }
        
        return {
          ...g,
          x: g.x + (dx/dist) * g.speed,
          y: g.y + (dy/dist) * g.speed
        };
      }));

      // 2. Detection Check
      let detected = false;
      guards.forEach(g => {
        const dist = Math.sqrt(Math.pow(playerPos.x - g.x, 2) + Math.pow(playerPos.y - g.y, 2));
        if (dist < (isCrouching ? 80 : 180)) {
          detected = true;
        }
      });

      if (detected) {
        setExposure(prev => Math.min(100, prev + (isCrouching ? 1 : 4)));
      } else {
        setExposure(prev => Math.max(0, prev - 0.5));
      }

      if (exposure >= 100) setGameStatus('CAUGHT');

      // 3. Collection Check
      fragments.forEach(f => {
        if (!f.isCollected) {
          const dist = Math.sqrt(Math.pow(playerPos.x - f.x, 2) + Math.pow(playerPos.y - f.y, 2));
          if (dist < 50) {
            setFragments(prev => prev.map(frag => frag.id === f.id ? { ...frag, isCollected: true } : frag));
            setTerminalLog(prev => [`ENCRYPTED DATA FOUND: ${f.title}`, ...prev].slice(0, 10));
            setActiveDialogue(f.content);
          }
        }
      });

      // Win Condition Check (Temple Sub-Level reached with all files)
      if (fragments.every(f => f.isCollected)) {
          const distToTemple = Math.sqrt(Math.pow(playerPos.x - 2600, 2) + Math.pow(playerPos.y - 400, 2));
          if (distToTemple < 100) setGameStatus('LEAKED');
      }

    }, 50);

    return () => clearInterval(interval);
  }, [playerPos, guards, exposure, isCrouching, gameStatus, fragments]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'INFILTRATING') return;
      const step = isCrouching ? 15 : 30;
      if (e.key === 'ArrowUp' || e.key === 'w') setPlayerPos(p => ({ ...p, y: Math.max(0, p.y - step) }));
      if (e.key === 'ArrowDown' || e.key === 's') setPlayerPos(p => ({ ...p, y: Math.min(3000, p.y + step) }));
      if (e.key === 'ArrowLeft' || e.key === 'a') setPlayerPos(p => ({ ...p, x: Math.max(0, p.x - step) }));
      if (e.key === 'ArrowRight' || e.key === 'd') setPlayerPos(p => ({ ...p, x: Math.min(3000, p.x + step) }));
      if (e.key === 'Shift') setIsCrouching(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsCrouching(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCrouching, gameStatus]);

  const worldStyle = {
    transform: `translate(${50 - (playerPos.x / 3000) * 100}%, ${50 - (playerPos.y / 3000) * 100}%)`,
    width: '3000px',
    height: '3000px',
    background: '#020617',
    position: 'relative' as const,
    transition: 'transform 0.1s ease-out'
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden font-mono select-none">
      
      {/* CCTV Overlay Effects */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,1)] border-[40px] border-black/40"></div>
      <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/20 z-50 animate-scanline"></div>

      {/* Top HUD - Tactical View */}
      <div className="h-20 bg-black/80 backdrop-blur-xl border-b-2 border-emerald-500/30 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-emerald-500 hover:text-white p-2 border border-emerald-500/30 rounded-lg">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em]">REC // NIGHT VISION</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              <span className="text-xs text-white font-mono">03:42:11 // LSJ_EXT_DOCK</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-10">
           <div className="flex justify-between text-[10px] text-emerald-500 mb-1 uppercase font-black italic">
              <span>Exposure Level</span>
              <span>{Math.floor(exposure)}%</span>
           </div>
           <div className="h-3 bg-emerald-950 rounded-full border border-emerald-500/30 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${exposure > 70 ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_20px_#10b981]'}`}
                style={{ width: `${exposure}%` }}
              ></div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right">
              <span className="text-[10px] text-gray-500 uppercase block">Data Fragments</span>
              <span className="text-lg font-black text-white">{fragments.filter(f => f.isCollected).length} / {fragments.length}</span>
           </div>
           <button onClick={() => setIsMapOpen(!isMapOpen)} className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30 text-emerald-500">
              <MapIcon size={24} />
           </button>
        </div>
      </div>

      {/* Main Game World */}
      <div className="flex-1 relative bg-black cursor-none overflow-hidden" ref={viewportRef}>
        <div style={worldStyle}>
          {/* Detailed Little St. James Map Layout */}
          
          {/* Water/Ocean Border */}
          <div className="absolute inset-0 border-[100px] border-indigo-950/20 rounded-[500px]"></div>

          {/* Landmarks */}
          {LANDMARKS.map(lm => (
            <div 
              key={lm.id} 
              className="absolute flex flex-col items-center" 
              style={{ left: lm.x, top: lm.y, transform: 'translate(-50%, -50%)' }}
            >
               {lm.id === 'temple' ? (
                 <div className="w-48 h-48 bg-blue-100 rounded-2xl border-[12px] border-blue-500 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 flex">
                        {[...Array(5)].map((_, i) => <div key={i} className="flex-1 border-r-8 border-blue-500 h-full"></div>)}
                    </div>
                    <div className="w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                    <Terminal size={40} className="text-blue-500 relative z-10" />
                 </div>
               ) : (
                 <div 
                    className="w-40 h-40 bg-slate-900 border-4 rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{ borderColor: lm.color }}
                 >
                    {lm.id === 'mansion' ? <Ghost size={60} className="text-fox-orange opacity-20" /> : <Layers size={40} className="text-gray-700" />}
                 </div>
               )}
               <span className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">{lm.name}</span>
            </div>
          ))}

          {/* Fragments to Collect */}
          {fragments.map(f => !f.isCollected && (
            <div 
              key={f.id} 
              className="absolute group"
              style={{ left: f.x, top: f.y, transform: 'translate(-50%, -50%)' }}
            >
               <div className="w-10 h-10 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center animate-pulse group-hover:scale-125 transition-transform">
                  <Database size={20} className="text-emerald-500" />
               </div>
               <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-emerald-500 p-2 text-[8px] whitespace-nowrap text-emerald-500 uppercase">
                  Encrypted Fragment Detected
               </div>
            </div>
          ))}

          {/* Guards */}
          {guards.map(g => (
            <div 
              key={g.id} 
              className="absolute flex items-center justify-center"
              style={{ left: g.x, top: g.y, transform: 'translate(-50%, -50%)' }}
            >
               <div className="absolute w-[360px] h-[360px] bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
               <div className="w-12 h-12 bg-red-600/20 border-2 border-red-500 rounded-xl flex items-center justify-center">
                  <ShieldAlert size={24} className="text-red-500" />
               </div>
               {/* Vision Cone - Simple Visual */}
               <div className="absolute w-40 h-60 bg-red-500/10 -top-60 rounded-t-full blur-xl rotate-45"></div>
            </div>
          ))}

          {/* Player Character */}
          <div 
            className="absolute z-50 flex items-center justify-center transition-all duration-300"
            style={{ left: playerPos.x, top: playerPos.y, transform: 'translate(-50%, -50%)' }}
          >
             <div className={`relative flex items-center justify-center transition-all ${isCrouching ? 'scale-75' : 'scale-100'}`}>
                <div className={`w-14 h-14 bg-emerald-500 rounded-2xl border-4 border-white shadow-[0_0_40px_rgba(16,185,129,0.8)] flex items-center justify-center overflow-hidden transition-all ${isCrouching ? 'opacity-40 blur-sm' : 'opacity-100'}`}>
                   <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=Infiltrator" className="w-full h-full" />
                </div>
                {/* Field of View Light */}
                <div className="absolute inset-[-100px] bg-emerald-500/10 rounded-full blur-3xl"></div>
             </div>
          </div>
        </div>

        {/* Tactical UI Elements */}
        <div className="absolute bottom-10 left-10 w-64 bg-black/60 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl z-50">
           <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase mb-3">
              <Terminal size={14} /> System Console
           </div>
           <div className="space-y-1 h-32 overflow-hidden flex flex-col-reverse">
              {terminalLog.map((log, i) => (
                <div key={i} className={`text-[9px] font-mono ${i === 0 ? 'text-white' : 'text-gray-600'}`}>
                  {`> ${log}`}
                </div>
              ))}
           </div>
        </div>

        {/* Hacking Dialogue */}
        {activeDialogue && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-black border-4 border-emerald-500 rounded-[3rem] p-10 z-[100] shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in">
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-4 bg-emerald-500/20 rounded-2xl border-2 border-emerald-500">
                    <FileText size={32} className="text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-emerald-500 uppercase italic">Classified Intel Recovered</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Accessing Sub-Protocol...</p>
                 </div>
              </div>
              <p className="text-xl font-black text-white italic tracking-tighter leading-snug mb-10 border-l-4 border-emerald-500 pl-6 py-2">
                 "{activeDialogue}"
              </p>
              <button 
                onClick={() => setActiveDialogue(null)}
                className="w-full bg-emerald-500 py-5 rounded-2xl text-black font-black uppercase italic tracking-tighter text-xl shadow-[0_4px_0_#059669] hover:scale-105 transition-transform"
              >
                 CLOSE FILE
              </button>
           </div>
        )}

        {/* Map Overlay */}
        {isMapOpen && (
           <div className="absolute inset-0 z-[60] bg-black/95 p-10 flex flex-col items-center justify-center animate-in fade-in">
              <div className="relative w-full max-w-4xl aspect-square border-4 border-emerald-500/30 rounded-[3rem] overflow-hidden bg-[#020617] p-8">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                 <h2 className="text-3xl font-black text-emerald-500 uppercase italic mb-8 flex items-center gap-4 tracking-tighter">
                   <Activity size={32} /> TACTICAL OVERLAY: LITTLE ST. JAMES
                 </h2>
                 <div className="grid grid-cols-2 gap-8">
                    {LANDMARKS.filter(l => !l.isSecret).map(l => (
                      <div key={l.id} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 group hover:border-emerald-500/50 transition-all">
                         <h4 className="text-white font-black uppercase italic text-lg mb-2">{l.name}</h4>
                         <p className="text-xs text-gray-500 font-bold leading-relaxed">{l.description}</p>
                      </div>
                    ))}
                 </div>
                 <button onClick={() => setIsMapOpen(false)} className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest">Close Overlay</button>
              </div>
           </div>
        )}

        {/* Game State Screens */}
        {gameStatus === 'CAUGHT' && (
           <div className="absolute inset-0 z-[200] bg-red-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-10 animate-in fade-in">
              <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_#ef4444] animate-shake">
                 <Skull size={64} className="text-white" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-4">REDACTED</h1>
              <p className="text-red-300 font-black uppercase tracking-[0.2em] mb-12 max-w-lg">You were silcenced before the truth could be told. The list remains hidden.</p>
              <button onClick={() => window.location.reload()} className="bg-white text-black px-16 py-6 rounded-2xl font-black text-2xl uppercase italic tracking-tighter shadow-2xl hover:scale-105 transition-transform">RE-INFILTRATE</button>
           </div>
        )}

        {gameStatus === 'LEAKED' && (
           <div className="absolute inset-0 z-[200] bg-emerald-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-10 animate-in fade-in">
              <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_#10b981] animate-bounce">
                 <Radio size={64} className="text-white" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-4">LEAKED</h1>
              <p className="text-emerald-300 font-black uppercase tracking-[0.2em] mb-12 max-w-xl leading-relaxed">The Temple Server has been breached. 4.2TB of data is now live on the blockchain. The pack is exposed.</p>
              <button onClick={onBack} className="bg-white text-black px-16 py-6 rounded-2xl font-black text-2xl uppercase italic tracking-tighter shadow-2xl hover:scale-105 transition-transform">RETURN TO LOBBY</button>
           </div>
        )}

        {/* Touch Controls for Mobile */}
        <div className="md:hidden absolute bottom-10 right-10 flex flex-col gap-4">
           <button className="w-20 h-20 bg-emerald-500/20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-500 active:scale-90 transition-all"><Move size={32} /></button>
        </div>
      </div>

      {/* Movement Instructions Overlay (Start only) */}
      {exposure === 0 && gameStatus === 'INFILTRATING' && playerPos.x === 550 && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse pointer-events-none">
             W, A, S, D to MOVE // SHIFT to STEALTH
          </div>
      )}

      {/* Footer Branding */}
      <div className="h-10 bg-black border-t border-emerald-500/10 flex items-center justify-center gap-10">
         <div className="flex items-center gap-2 text-[8px] text-gray-700 font-black uppercase tracking-widest italic">
            <Fingerprint size={12} /> Biometric_Scan: Verified
         </div>
         <div className="flex items-center gap-2 text-[8px] text-gray-700 font-black uppercase tracking-widest italic">
            <Network size={12} /> Crypto_Bridge: Active
         </div>
         <div className="flex items-center gap-2 text-[8px] text-red-900 font-black uppercase tracking-widest italic animate-pulse">
            <AlertTriangle size={12} /> Unauthorized_Access: LOGGED
         </div>
      </div>
    </div>
  );
};

export default IslandExplorerGame;
