
import React, { useState, useEffect } from 'react';
// Added LayoutGrid and Search to the imports
import { ChevronLeft, Briefcase, Heart, Users, FileText, Monitor, ShieldAlert, Zap, ShoppingCart, Code, BarChart3, LayoutGrid, Search } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type Mode = 'MENU' | 'BOSS' | 'GF' | 'PARENTS';

const UnemploymentSimulator: React.FC<Props> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<Mode>('MENU');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMode('MENU');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // MODE 1: EXCEL (FOR THE BOSS)
  const renderBossMode = () => (
    <div className="fixed inset-0 z-[100] bg-white text-black font-sans overflow-hidden cursor-pointer animate-in fade-in duration-100" onDoubleClick={() => setActiveMode('MENU')}>
        <div className="bg-[#217346] text-white p-2 text-xs flex justify-between items-center shadow-md">
            <span className="font-bold flex items-center gap-2">📊 AutoSave On</span>
            <span className="font-semibold uppercase tracking-widest">Q4_Performance_Review_Final.xlsx - Excel</span>
            <span>Alpha Degenerate (Manager)</span>
        </div>
        <div className="bg-[#f3f2f1] border-b border-gray-300 p-2 flex gap-4 text-[10px] md:text-sm text-gray-700">
            <span>File</span><span className="font-bold border-b-2 border-[#217346]">Home</span><span>Insert</span><span>Draw</span><span>Page Layout</span><span>Formulas</span><span>Data</span>
        </div>
        <div className="overflow-auto h-full text-[9px] md:text-xs">
            <table className="w-full border-collapse">
                <tbody>
                    {[...Array(50)].map((_, r) => (
                        <tr key={r} className="hover:bg-blue-50/50">
                            <td className="bg-gray-100 border text-center text-gray-400 w-10 font-mono">{r+1}</td>
                            {[...Array(8)].map((_, c) => (
                                <td key={c} className="border p-2 min-w-[100px]">
                                  {r === 0 ? String.fromCharCode(65 + c) : (c === 0 ? "ID_"+r : (Math.random() * 50000).toFixed(2))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="absolute bottom-6 right-8 bg-black/90 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase italic animate-pulse shadow-2xl border border-white/20">Double Click or ESC to Exit Stealth</div>
    </div>
  );

  // MODE 2: DROPSHIPPING DASHBOARD (FOR THE PARTNER)
  const renderGFMode = () => (
    <div className="fixed inset-0 z-[100] bg-[#f6f6f7] text-[#202223] font-sans overflow-hidden cursor-pointer animate-in fade-in duration-100" onDoubleClick={() => setActiveMode('MENU')}>
        <div className="bg-[#1a1c1d] text-white p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black">S</div>
               <span className="font-bold text-sm">Store Admin: Euras_Essentials</span>
            </div>
            <div className="flex gap-4 text-[10px] uppercase font-black">
               <span className="text-emerald-400">● Live View</span>
               <span>Account Settings</span>
            </div>
        </div>
        <div className="flex h-full">
            <div className="w-56 bg-white border-r border-gray-200 p-4 space-y-4 hidden md:block">
               <div className="h-4 w-full bg-gray-100 rounded"></div>
               <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
               <div className="h-4 w-full bg-gray-100 rounded"></div>
               <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto pb-32">
               <h2 className="text-2xl font-bold mb-8">Home</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Total Sales</div>
                     <div className="text-2xl font-black">$42,850.21</div>
                     <div className="text-emerald-500 text-xs font-bold mt-2">↑ 12% vs last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Total Orders</div>
                     <div className="text-2xl font-black">1,243</div>
                     <div className="text-emerald-500 text-xs font-bold mt-2">↑ 5% vs last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Conversion Rate</div>
                     <div className="text-2xl font-black">3.4%</div>
                     <div className="text-rose-500 text-xs font-bold mt-2">↓ 0.2% vs last month</div>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-64 flex flex-col justify-end gap-2">
                  <div className="flex items-end justify-between h-full gap-2 px-4">
                     {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-emerald-500 w-full rounded-t-lg" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                     ))}
                  </div>
                  <div className="text-center text-[10px] text-gray-400 font-bold uppercase pt-4">Sales Analytics - Last 30 Days</div>
               </div>
            </div>
        </div>
        <div className="absolute bottom-6 right-8 bg-black/90 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase italic animate-pulse shadow-2xl">Double Click or ESC to Exit Stealth</div>
    </div>
  );

  // MODE 3: CODE EDITOR (FOR THE PARENTS)
  const renderParentsMode = () => (
    <div className="fixed inset-0 z-[100] bg-[#1e1e1e] text-[#d4d4d4] font-mono overflow-hidden cursor-pointer animate-in fade-in duration-100 flex" onDoubleClick={() => setActiveMode('MENU')}>
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 text-gray-500">
           <LayoutGrid size={24} />
           <Search size={24} />
           <Code size={24} className="text-white" />
           <Monitor size={24} />
        </div>
        <div className="w-52 bg-[#252526] p-4 text-[10px] uppercase font-bold text-gray-500 hidden md:block">
           <div className="mb-4">Explorer</div>
           <div className="text-white flex items-center gap-2 mb-2 italic">● main.sol</div>
           <div className="flex items-center gap-2 mb-2">deploy.js</div>
           <div className="flex items-center gap-2 mb-2">config.json</div>
        </div>
        <div className="flex-1 flex flex-col">
           <div className="bg-[#2d2d2d] p-2 text-[10px] flex gap-4">
              <span className="bg-[#1e1e1e] px-4 py-1 border-t-2 border-fox-orange text-white italic">main.sol</span>
              <span className="px-4 py-1 text-gray-500 italic">deploy.js</span>
           </div>
           <div className="flex-1 p-6 text-xs md:text-sm overflow-auto">
              <div className="flex gap-4">
                 <div className="text-gray-600 select-none text-right w-8">
                    {[...Array(30)].map((_, i) => <div key={i}>{i+1}</div>)}
                 </div>
                 <div className="text-blue-400">
                    <div><span className="text-purple-400">pragma</span> solidity ^0.8.20;</div>
                    <div className="mt-4"><span className="text-purple-400">contract</span> <span className="text-yellow-400">EurasProProtocol</span> {"{"}</div>
                    <div className="ml-4"><span className="text-purple-400">mapping</span>(address ={">"} uint256) <span className="text-white">public</span> balances;</div>
                    <div className="ml-4 mt-2"><span className="text-purple-400">event</span> <span className="text-yellow-400">DegenActivity</span>(address <span className="text-orange-400">indexed</span> user, uint256 amount);</div>
                    <div className="ml-4 mt-4 text-gray-500">// Initialize the stealth protocol</div>
                    <div className="ml-4"><span className="text-purple-400">constructor</span>() {"{"}</div>
                    <div className="ml-8 text-white">balances[msg.sender] = 1000000 * 10**18;</div>
                    <div className="ml-4">{"}"}</div>
                    <div className="ml-4 mt-4"><span className="text-purple-400">function</span> <span className="text-yellow-400">mineWiFiMoney</span>(uint256 amount) <span className="text-white">external</span> {"{"}</div>
                    <div className="ml-8 text-white">require(amount {"<"} balances[msg.sender], <span className="text-emerald-400">"Insufficient Hustle"</span>);</div>
                    <div className="ml-8 text-white">balances[msg.sender] -= amount;</div>
                    <div className="ml-8"><span className="text-purple-400">emit</span> DegenActivity(msg.sender, amount);</div>
                    <div className="ml-4">{"}"}</div>
                    <div>{"}"}</div>
                 </div>
              </div>
           </div>
           <div className="bg-[#007acc] text-white p-1 text-[10px] flex justify-between px-4 font-sans font-bold">
              <div className="flex gap-4">
                 <span>master*</span>
                 <span>0 Errors</span>
                 <span>0 Warnings</span>
              </div>
              <div>UTF-8 | Solidity</div>
           </div>
        </div>
        <div className="absolute bottom-10 right-12 bg-black/90 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase italic animate-pulse shadow-2xl border border-white/20">Double Click or ESC to Exit Stealth</div>
    </div>
  );

  if (activeMode === 'BOSS') return renderBossMode();
  if (activeMode === 'GF') return renderGFMode();
  if (activeMode === 'PARENTS') return renderParentsMode();

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center p-6 text-center pb-24">
      <div className="mb-16 animate-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 text-gray-400 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border-2 border-gray-700 shadow-xl">
             <ShieldAlert size={16} className="text-fox-orange" /> Stealth Mode: Standby
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic text-white mb-4 tracking-tighter uppercase leading-none">
            DEGEN <span className="text-gray-700">HIDE</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-lg font-bold uppercase tracking-widest max-w-2xl mx-auto italic leading-relaxed">
            Choose your decoy. Instantly fake productivity when the Sly Sloth is in danger.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <button 
            onClick={() => setActiveMode('BOSS')}
            className="group bg-card-bg border-4 border-gray-800 p-10 rounded-[3rem] hover:border-emerald-500 transition-all hover:-translate-y-2 flex flex-col items-center shadow-card-depth group"
          >
              <div className="w-24 h-24 bg-emerald-950/20 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all border-2 border-emerald-500/20 shadow-xl">
                  <BarChart3 size={48} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">The Boss</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Excel Performance Data</p>
          </button>

          <button 
            onClick={() => setActiveMode('GF')}
            className="group bg-card-bg border-4 border-gray-800 p-10 rounded-[3rem] hover:border-pink-500 transition-all hover:-translate-y-2 flex flex-col items-center shadow-card-depth"
          >
              <div className="w-24 h-24 bg-pink-950/20 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-pink-500 group-hover:text-white transition-all border-2 border-pink-500/20 shadow-xl">
                  <ShoppingCart size={48} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">The Partner</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">E-Com Sales Dashboard</p>
          </button>

          <button 
            onClick={() => setActiveMode('PARENTS')}
            className="group bg-card-bg border-4 border-gray-800 p-10 rounded-[3rem] hover:border-neon-blue transition-all hover:-translate-y-2 flex flex-col items-center shadow-card-depth"
          >
              <div className="w-24 h-24 bg-blue-950/20 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-neon-blue group-hover:text-black transition-all border-2 border-neon-blue/20 shadow-xl">
                  <Code size={48} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">The Parents</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Solidity Smart Contract</p>
          </button>
      </div>

      <button onClick={onBack} className="mt-20 text-gray-600 hover:text-white flex items-center gap-3 font-black uppercase text-xs tracking-widest transition-colors italic group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> BACK TO THE PACK
      </button>

      <div className="mt-12 text-gray-800 text-[10px] font-black uppercase tracking-[0.5em] italic">
         Stealth Engine V2.1.0 // Hidden in Plain Sight
      </div>
    </div>
  );
};

export default UnemploymentSimulator;
