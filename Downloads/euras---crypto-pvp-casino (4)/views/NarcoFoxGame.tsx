
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { 
  ChevronLeft, Sprout, Truck, Skull, Coins, 
  FlaskConical, ShoppingCart, ShieldAlert, Zap,
  Timer, Plus, Factory, Gavel, Wind, Target,
  Flame, TrendingUp, DollarSign, Bomb, Shield
} from 'lucide-react';

interface Props {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

type Tab = 'HACIENDA' | 'LAB' | 'RUN' | 'MARKET';

interface Plot {
  id: number;
  plantedAt: number | null;
  readyAt: number | null;
}

interface NarcoSaveData {
  dirtyCash: number;
  product: number;
  inventory: { seeds: number; fuel: number };
  plots: Plot[];
}

const NarcoFoxGame: React.FC<Props> = ({ user, updateBalance, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('HACIENDA');
  const [dirtyCash, setDirtyCash] = useState(0);
  const [product, setProduct] = useState(0);
  const [inventory, setInventory] = useState({ seeds: 10, fuel: 5 });
  const [plots, setPlots] = useState<Plot[]>(Array.from({ length: 6 }, (_, i) => ({ id: i, plantedAt: null, readyAt: null })));
  
  // Runner State
  const [actionStage, setActionStage] = useState<'IDLE' | 'PLAYING' | 'CRASHED' | 'SUCCESS'>('IDLE');
  const [vanX, setVanX] = useState(50);
  const [police, setPolice] = useState<{x: number, y: number, id: number, type: 'COP' | 'BULLET'}[]>([]);
  const [distance, setDistance] = useState(0);
  const [screenShake, setScreenShake] = useState(false);

  // Use activeWallet instead of walletAddress which does not exist on User type
  const SAVE_KEY = `narco_save_${user?.activeWallet || 'guest'}`;

  // Keyboard Support for PC
  useEffect(() => {
    if (actionStage !== 'PLAYING') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setVanX(prev => Math.max(10, prev - 5));
      if (e.key === 'ArrowRight' || e.key === 'd') setVanX(prev => Math.min(90, prev + 5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actionStage]);

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const data: NarcoSaveData = JSON.parse(saved);
        setDirtyCash(data.dirtyCash || 0);
        setProduct(data.product || 0);
        setInventory(data.inventory || { seeds: 10, fuel: 5 });
        setPlots(data.plots || plots);
      } catch (e) {}
    }
  }, [SAVE_KEY]);

  useEffect(() => {
    const data: NarcoSaveData = { dirtyCash, product, inventory, plots };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [dirtyCash, product, inventory, plots, SAVE_KEY]);

  const plantSeed = (id: number) => {
    if (inventory.seeds <= 0) return;
    setInventory(prev => ({ ...prev, seeds: prev.seeds - 1 }));
    setPlots(prev => prev.map(p => p.id === id ? { ...p, plantedAt: Date.now(), readyAt: Date.now() + 8000 } : p));
  };

  const harvest = (id: number) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, plantedAt: null, readyAt: null } : p));
    setProduct(prev => prev + 10);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);
  };

  // Improved Runner Loop
  useEffect(() => {
    if (actionStage !== 'PLAYING') return;
    const loop = setInterval(() => {
      setDistance(d => d + 1.5);
      
      setPolice(prev => {
        let next = prev.map(p => ({ ...p, y: p.y + (p.type === 'BULLET' ? 8 : 4) })).filter(p => p.y < 120);
        
        // Spawn Cops
        if (Math.random() > 0.95) {
          next.push({ x: Math.random() * 80 + 10, y: -10, id: Date.now(), type: 'COP' });
        }
        
        // Cops shoot
        next.forEach(p => {
            if (p.type === 'COP' && Math.random() > 0.98) {
                next.push({ x: p.x, y: p.y + 5, id: Date.now() + 1, type: 'BULLET' });
            }
        });

        // Collision Check (More forgiving hitbox)
        const hit = next.find(p => {
            const isNearX = Math.abs(p.x - vanX) < 12;
            const isAtY = p.y > 75 && p.y < 90;
            return isNearX && isAtY;
        });

        if (hit) {
          setActionStage('CRASHED');
          setScreenShake(true);
        }
        return next;
      });

      if (distance >= 500) setActionStage('SUCCESS');
    }, 40);
    return () => clearInterval(loop);
  }, [actionStage, distance, vanX]);

  const handleStartRun = () => {
    if (product <= 0) return;
    setActionStage('PLAYING');
    setDistance(0);
    setPolice([]);
  };

  // Defined completeRun to process rewards when smuggling mission succeeds
  const completeRun = () => {
    const revenue = product * 100; // $100 per kg smuggled
    setDirtyCash(prev => prev + revenue);
    setProduct(0);
    setActionStage('IDLE');
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 400);
  };

  const washMoney = () => {
    if (dirtyCash < 500) return;
    const solGain = (dirtyCash / 1000) * 0.15;
    updateBalance(solGain);
    setDirtyCash(0);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  return (
    <div className={`fixed inset-0 bg-[#050a06] z-[60] flex flex-col overflow-hidden text-white transition-transform duration-100 ${screenShake ? 'animate-shake' : ''}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      {/* Top Narco Bar */}
      <div className="h-20 bg-black/80 backdrop-blur-xl border-b-4 border-emerald-900/30 flex items-center justify-between px-6 z-50">
         <button onClick={onBack} className="text-gray-500 bg-white/5 p-3 rounded-2xl hover:text-white transition-colors"><ChevronLeft size={24}/></button>
         <div className="flex gap-8">
            <div className="text-right">
               <div className="text-[10px] font-black text-rose-500 uppercase italic tracking-widest">Bloody Cash</div>
               <div className="text-2xl font-black text-white font-mono tracking-tighter shadow-sm flex items-center gap-2">
                 <Coins size={18} className="text-yellow-500" /> ${dirtyCash.toLocaleString()}
               </div>
            </div>
            <div className="text-right">
               <div className="text-[10px] font-black text-emerald-500 uppercase italic tracking-widest">White Gold</div>
               <div className="text-2xl font-black text-white font-mono tracking-tighter flex items-center gap-2">
                 <FlaskConical size={18} className="text-emerald-400" /> {product}kg
               </div>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 no-scrollbar relative">
        {activeTab === 'HACIENDA' && (
           <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex justify-between items-end mb-10">
                 <div>
                    <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter leading-none mb-2">Hacienda <span className="text-emerald-500 underline decoration-emerald-500/30">Euras</span></h2>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Build your empire, brick by brick.</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-3xl flex items-center gap-3">
                    <Sprout className="text-emerald-400" size={20} />
                    <span className="text-sm font-black text-white">{inventory.seeds} SEEDS</span>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                 {plots.map(plot => {
                    const isReady = plot.readyAt && Date.now() >= plot.readyAt;
                    return (
                       <div key={plot.id} className="aspect-square bg-slate-900/40 rounded-[3.5rem] border-4 border-gray-800/50 flex flex-col items-center justify-center relative active:scale-95 transition-all shadow-card-depth overflow-hidden group">
                          {!plot.plantedAt ? (
                             <button onClick={() => plantSeed(plot.id)} className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gray-500 border-2 border-dashed border-white/10 group-hover:border-emerald-500 group-hover:text-emerald-400 transition-all">
                                   <Plus size={32} />
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic group-hover:text-white">Plant Batch</span>
                             </button>
                          ) : (
                             <div className="flex flex-col items-center gap-4">
                                {isReady ? (
                                   <button onClick={() => harvest(plot.id)} className="flex flex-col items-center gap-4 animate-bounce">
                                      <div className="w-24 h-16 bg-white rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center justify-center border-4 border-emerald-500 overflow-hidden relative">
                                        <div className="absolute top-0 w-full h-1 bg-gray-200"></div>
                                        <span className="text-black font-black text-xs italic">PURE</span>
                                      </div>
                                      <span className="text-[10px] font-black text-emerald-400 uppercase italic tracking-widest">Collect Brick</span>
                                   </button>
                                ) : (
                                   <>
                                      <Timer size={48} className="text-fox-orange animate-pulse" />
                                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Producing...</span>
                                   </>
                                )}
                             </div>
                          )}
                       </div>
                    );
                 })}
              </div>
           </div>
        )}

        {activeTab === 'RUN' && (
           <div className="h-full max-w-2xl mx-auto flex flex-col animate-in slide-in-from-bottom-10">
              {actionStage === 'IDLE' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 rounded-[5rem] border-4 border-gray-800 shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-fox-orange/10 to-transparent"></div>
                   <Truck size={120} className="text-fox-orange mb-8 drop-shadow-[0_0_30px_#f59e0b] animate-float" />
                   <h2 className="text-5xl font-black italic uppercase mb-4 tracking-tighter">Border Runner</h2>
                   <p className="text-gray-500 font-bold mb-12 max-w-xs uppercase leading-relaxed text-xs">Smuggle your stash across the Mexican border. Avoid the Federales or get smoked.</p>
                   <button 
                     disabled={product <= 0}
                     onClick={handleStartRun}
                     className={`w-full py-7 rounded-[2.5rem] font-black text-2xl uppercase shadow-pop-orange italic tracking-tighter transition-all ${product <= 0 ? 'bg-gray-800 text-gray-600 opacity-50' : 'bg-fox-orange text-white hover:scale-105'}`}
                   >
                     START MISSION
                   </button>
                </div>
              ) : actionStage === 'PLAYING' ? (
                <div 
                  className="flex-1 relative bg-[#080808] rounded-[4rem] border-8 border-slate-900 overflow-hidden touch-none shadow-2xl group"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setVanX(((e.clientX - rect.left) / rect.width) * 100);
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setVanX(((e.touches[0].clientX - rect.left) / rect.width) * 100);
                  }}
                >
                   {/* Road Lines */}
                   <div className="absolute inset-0 flex flex-col justify-around items-center opacity-10">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-2 h-20 bg-white animate-pulse"></div>
                      ))}
                   </div>

                   <div className="absolute top-10 left-12 right-12 h-4 bg-black/50 rounded-full overflow-hidden border-2 border-white/10 z-20">
                      <div className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_20px_#10b981]" style={{ width: `${(distance / 500) * 100}%` }}></div>
                   </div>

                   {police.map(p => (
                      <div key={p.id} className="absolute transition-all duration-100" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}>
                         {p.type === 'COP' ? (
                             <div className="w-16 h-20 bg-blue-600 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_40px_blue] border-4 border-blue-300 relative">
                                <div className="absolute -top-4 left-0 w-full flex justify-between px-1">
                                    <div className="w-4 h-4 bg-red-500 animate-pulse rounded-full"></div>
                                    <div className="w-4 h-4 bg-blue-500 animate-pulse rounded-full"></div>
                                </div>
                                <ShieldAlert size={28} className="text-white" />
                             </div>
                         ) : (
                             <div className="w-4 h-10 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] animate-pulse"></div>
                         )}
                      </div>
                   ))}

                   <div className="absolute bottom-16 transition-all duration-100 ease-out" style={{ left: `${vanX}%`, transform: 'translateX(-50%)' }}>
                      <div className="w-20 h-32 bg-slate-800 rounded-2xl border-4 border-white flex flex-col items-center justify-between p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative">
                         <div className="absolute top-0 w-full h-8 bg-black/40 border-b-2 border-white/5"></div>
                         <div className="flex-1 flex items-center justify-center">
                            <Truck size={40} className="text-white" />
                         </div>
                         <div className="flex gap-2 w-full justify-between">
                            <div className="w-3 h-1 bg-red-500"></div>
                            <div className="w-3 h-1 bg-red-500"></div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/20 font-black text-[10px] uppercase tracking-[8px] animate-pulse">
                      {window.innerWidth > 768 ? 'A / D or Mouse to Steer' : 'Swipe to Steer'}
                   </div>
                </div>
              ) : actionStage === 'CRASHED' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-rose-950/20 rounded-[5rem] border-4 border-rose-500/50 shadow-2xl animate-in zoom-in">
                   <div className="bg-rose-500/20 p-10 rounded-full mb-8 border-4 border-rose-500/30">
                     <Skull size={100} className="text-rose-500 animate-shake" />
                   </div>
                   <h2 className="text-6xl font-black italic uppercase mb-4 tracking-tighter">WASTED</h2>
                   <p className="text-sm text-gray-500 font-black uppercase mb-12">The batch was seized. You escaped with your life.</p>
                   <button onClick={() => setActionStage('IDLE')} className="w-full bg-white text-black font-black py-7 rounded-[2.5rem] shadow-2xl uppercase italic tracking-tighter text-2xl hover:bg-gray-200 transition-colors">TRY AGAIN</button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-emerald-950/20 rounded-[5rem] border-4 border-emerald-500/50 shadow-2xl animate-in zoom-in">
                   <div className="bg-emerald-500/20 p-10 rounded-full mb-8 border-4 border-emerald-500/30">
                     <Zap size={100} className="text-emerald-500 animate-bounce" fill="currentColor" />
                   </div>
                   <h2 className="text-6xl font-black italic uppercase mb-4 tracking-tighter">EL CAPO</h2>
                   <p className="text-sm text-gray-500 font-black uppercase mb-12 tracking-widest">Delivery successful. Clean wash incoming.</p>
                   <button onClick={completeRun} className="w-full bg-emerald-500 text-white font-black py-7 rounded-[2.5rem] shadow-pop-green uppercase italic tracking-tighter text-2xl hover:scale-105 transition-transform">CLAIM PROFIT</button>
                </div>
              )}
           </div>
        )}

        {activeTab === 'MARKET' && (
           <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-10">
              <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-10">El <span className="text-fox-orange">Mercado</span></h2>
              
              <div className="bg-slate-900/60 rounded-[4rem] p-10 border-4 border-gray-800 relative overflow-hidden shadow-2xl group">
                 <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-colors"></div>
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic mb-2 block">Laundering Operations</span>
                       <div className="text-5xl font-black text-rose-500 font-mono tracking-tighter flex items-center gap-4">
                         <Gavel size={40} className="text-gray-700" /> ${dirtyCash.toLocaleString()}
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={washMoney}
                   className="w-full bg-white text-black font-black py-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 btn-tactile text-2xl italic tracking-tighter hover:bg-gray-100"
                 >
                    <Coins size={32} className="text-yellow-500" /> WASH MONEY
                 </button>
                 <div className="flex justify-between items-center mt-8 px-2">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest italic">Rate: $1k = 0.15 SOL</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic">SAFE TRANSIT</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border-2 border-gray-800/50 flex items-center justify-between group hover:border-emerald-500/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                         <Plus size={28} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase italic tracking-tight">Bulk Seeds (10x)</div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Premium Quality</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-lg font-black text-white font-mono">$150</span>
                       <button onClick={() => { if(dirtyCash < 150) return; setDirtyCash(d => d - 150); setInventory(i => ({ ...i, seeds: i.seeds + 10 })); }} className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase italic btn-tactile">BUY</button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Narco Bottom Navigation */}
      <div className="h-28 bg-black/95 backdrop-blur-2xl border-t-4 border-emerald-900/20 flex justify-around items-center px-6 pb-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         {[
           { id: 'HACIENDA', icon: <Sprout size={28}/>, label: 'Empire' },
           { id: 'RUN', icon: <Truck size={28}/>, label: 'Smuggle' },
           { id: 'MARKET', icon: <ShoppingCart size={28}/>, label: 'Market' }
         ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)} 
              className={`flex flex-col items-center gap-2 transition-all group ${activeTab === item.id ? 'text-emerald-500 scale-110' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <div className={`p-2 rounded-2xl transition-colors ${activeTab === item.id ? 'bg-emerald-500/10' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest italic">{item.label}</span>
            </button>
         ))}
      </div>
    </div>
  );
};

export default NarcoFoxGame;
