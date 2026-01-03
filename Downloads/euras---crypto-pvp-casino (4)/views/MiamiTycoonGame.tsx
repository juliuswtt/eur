
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ChevronLeft, Briefcase, Car, Building, Star, MessageCircle, Sun, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface GameProps {
  user: User | null;
  onBack: () => void;
}

interface TycoonState {
  cash: number;
  incomePerSec: number;
  coursesSold: number;
  clout: number;
  assets: { [key: string]: number };
}

const INITIAL_STATE: TycoonState = { cash: 100, incomePerSec: 0, coursesSold: 0, clout: 0, assets: {} };

interface Asset {
  id: string;
  name: string;
  cost: number;
  income: number;
  cloutGain: number;
  icon: React.ReactNode;
}

const ASSETS: Asset[] = [
  { id: 'fake_reviews', name: 'Fake Reviews', cost: 50, income: 2, cloutGain: 1, icon: <Star size={16}/> },
  { id: 'fb_ads', name: 'FB Ads', cost: 250, income: 10, cloutGain: 5, icon: <MessageCircle size={16}/> },
  { id: 'rent_rolex', name: 'Rent Rolex', cost: 1000, income: 0, cloutGain: 50, icon: <Sun size={16}/> },
  { id: 'rent_lambo', name: 'Rent Huracan', cost: 5000, income: 100, cloutGain: 200, icon: <Car size={16}/> },
  { id: 'penthouse', name: 'Penthouse', cost: 20000, income: 500, cloutGain: 1000, icon: <Building size={16}/> },
];

const MiamiTycoonGame: React.FC<GameProps> = ({ user, onBack }) => {
  const [state, setState] = useState<TycoonState>(INITIAL_STATE);

  useEffect(() => {
    const interval = setInterval(() => {
        setState(curr => ({ ...curr, cash: curr.cash + curr.incomePerSec }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateCourse = () => {
      setState(prev => ({ ...prev, cash: prev.cash + (5 + (prev.clout * 0.1)), coursesSold: prev.coursesSold + 1 }));
  };

  const buyAsset = (asset: Asset) => {
      if (state.cash >= asset.cost) {
          setState(prev => ({
              ...prev,
              cash: prev.cash - asset.cost,
              incomePerSec: prev.incomePerSec + asset.income,
              clout: prev.clout + asset.cloutGain,
              assets: { ...prev.assets, [asset.id]: (prev.assets[asset.id] || 0) + 1 }
          }));
      }
  };

  const formatMoney = (n: number) => "$" + Math.floor(n).toLocaleString();

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full md:h-[calc(100vh-140px)]">
      {/* Header Bereich */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0 px-4">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 font-black transition-colors text-[10px] md:text-sm uppercase italic bg-white/5 p-2 px-4 rounded-xl">
          <ChevronLeft size={20} /> EXIT MIAMI
        </button>
        
        <div className="flex items-center gap-3 bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 shadow-lg">
            <TrendingUp size={16} className="text-pink-400" /> WIFI MONEY SIMULATOR
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 flex-1 min-h-0 overflow-y-auto md:overflow-hidden no-scrollbar pb-24 md:pb-0">
          
          {/* STATS */}
          <div className="order-2 md:order-1 md:col-span-3 flex flex-col gap-6">
              <div className="bg-card-bg rounded-[3rem] p-6 md:p-8 border-4 border-gray-800 shadow-card-depth flex flex-col gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-[1.5rem] flex items-center justify-center shadow-xl transform rotate-6 flex-shrink-0">
                          <Briefcase className="text-white" size={28} />
                      </div>
                      <div>
                          <h2 className="font-black text-white text-lg md:text-2xl leading-tight uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200">GURU APE</h2>
                          <div className="text-[10px] text-pink-400 font-black uppercase tracking-widest">Master Affiliate</div>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="bg-slate-950 p-4 rounded-2xl border-2 border-white/5 shadow-inner">
                          <div className="text-gray-600 text-[10px] font-black uppercase mb-1 tracking-widest">Bank Balance</div>
                          <div className="text-2xl md:text-3xl text-neon-green font-black font-mono tracking-tighter">{formatMoney(state.cash)}</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-2xl border-2 border-white/5 flex flex-col justify-center shadow-inner">
                          <div className="text-gray-600 text-[10px] font-black uppercase mb-1 tracking-widest">Guru Clout</div>
                          <div className="text-lg md:text-2xl text-fox-orange font-black flex items-center gap-3 italic">
                            {state.clout} <Star size={20} className="fill-current animate-pulse" />
                          </div>
                      </div>
                  </div>
              </div>

              {/* ASSETS */}
              <div className="bg-card-bg rounded-[3rem] p-6 md:p-8 border-4 border-gray-800 shadow-card-depth flex flex-col min-h-0 flex-1">
                  <h3 className="text-gray-500 font-black text-[10px] uppercase mb-6 tracking-[0.2em] flex items-center gap-3">
                    <Sparkles size={14} className="text-pink-500" />
                    WIFI MONEY ASSETS
                  </h3>
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:pr-4 flex-1">
                      {Object.entries(state.assets).map(([id, count]) => {
                          const asset = ASSETS.find(a => a.id === id);
                          if(!asset || count === 0) return null;
                          return (
                              <div key={id} className="flex flex-col md:flex-row items-center md:items-center gap-4 bg-slate-950 p-3 md:p-4 rounded-3xl border-2 border-gray-800/50 min-w-[120px] md:min-w-0 shadow-lg">
                                  <div className="text-pink-500 p-3 bg-slate-900 rounded-2xl border border-pink-500/20">{asset.icon}</div>
                                  <div className="text-center md:text-left">
                                      <div className="text-[10px] md:text-sm font-black text-white uppercase truncate w-24 md:w-auto italic tracking-tighter">{asset.name}</div>
                                      <div className="text-[9px] text-gray-600 font-black uppercase">Qty: {count}</div>
                                  </div>
                              </div>
                          )
                      })}
                      {Object.keys(state.assets).length === 0 && <span className="text-xs text-gray-700 font-black uppercase italic text-center w-full py-10 tracking-widest">Start Selling Courses.</span>}
                  </div>
              </div>
          </div>

          {/* MAIN CLICKER */}
          <div className="order-1 md:order-2 md:col-span-6 flex flex-col gap-6">
              <div className="relative h-56 md:h-[450px] rounded-[3.5rem] bg-gradient-to-t from-pink-600 via-purple-700 to-sky-400 border-8 border-slate-800 overflow-hidden shadow-2xl flex-shrink-0 group">
                  <div className="absolute top-10 right-12 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_80px_#fde047] animate-pulse"></div>
                  
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/waves.png')] opacity-10"></div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center bg-card-bg px-10 md:px-16 py-4 rounded-t-[3rem] border-x-8 border-t-8 border-slate-800 flex flex-col items-center shadow-2xl">
                      <div className="relative mb-2">
                        <img src="https://api.dicebear.com/7.x/big-smile/svg?seed=guru_ape_pink&backgroundColor=ffdfbf" alt="Guru" className="w-24 h-24 md:w-44 md:h-44 scale-110 drop-shadow-2xl transition-transform group-hover:scale-125 duration-700" />
                        <div className="absolute -top-2 -right-2 bg-neon-green text-white text-[10px] font-black px-3 py-1 rounded-xl shadow-2xl border-2 border-white/20 italic">LIVE</div>
                      </div>
                      <div className="text-xs md:text-lg font-black text-pink-500 uppercase italic tracking-tighter animate-pulse">Master Guru Stage</div>
                  </div>
              </div>

              <div className="bg-card-bg p-6 md:p-12 rounded-[3.5rem] border-4 border-gray-800 shadow-2xl text-center space-y-6 md:space-y-10">
                  <button 
                    onClick={handleCreateCourse}
                    className="w-full py-8 md:py-16 bg-gradient-to-br from-neon-green to-emerald-700 text-white font-black uppercase text-lg md:text-4xl rounded-[2.5rem] shadow-pop-green btn-tactile flex items-center justify-center gap-6 active:scale-95 transition-all italic tracking-tighter"
                  >
                    <Zap size={32} fill="currentColor" /> SELL TRADING COURSE
                  </button>
                  <div className="flex justify-between items-center px-4">
                    <p className="text-[10px] md:text-sm text-gray-600 font-black italic uppercase tracking-widest">WiFi Money Generator Activated</p>
                    <span className="text-sm md:text-xl font-black text-white italic">{state.coursesSold} COURSES SOLD</span>
                  </div>
              </div>
          </div>

          {/* ASSET SHOP */}
          <div className="order-3 md:order-3 md:col-span-3 space-y-4 pb-10">
              <h3 className="text-xs md:text-lg font-black text-white uppercase italic tracking-tighter px-4 mb-4 flex items-center gap-3">
                <div className="w-2 h-6 bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899]"></div>
                LUXURY ASSETS
              </h3>
              <div className="flex flex-col gap-4">
                  {ASSETS.map(asset => (
                      <button 
                        key={asset.id}
                        onClick={() => buyAsset(asset)}
                        disabled={state.cash < asset.cost}
                        className={`w-full p-4 md:p-6 rounded-[2rem] border-4 transition-all btn-tactile flex items-center gap-4 md:gap-6 ${
                            state.cash >= asset.cost 
                            ? 'bg-slate-900 border-gray-800 hover:border-pink-500 shadow-xl' 
                            : 'bg-slate-950 border-gray-900/50 opacity-40 cursor-not-allowed'
                        }`}
                      >
                          <div className={`p-4 rounded-2xl flex-shrink-0 transition-colors ${state.cash >= asset.cost ? 'bg-slate-800 text-pink-400' : 'bg-slate-950 text-gray-800'}`}>{asset.icon}</div>
                          <div className="flex-1 text-left min-w-0">
                              <div className="text-xs md:text-lg font-black text-white uppercase leading-tight truncate italic tracking-tighter">{asset.name}</div>
                              <div className="text-[10px] md:text-xs text-gray-500 font-black mt-1 uppercase">+{asset.income}/s • {asset.cloutGain} Clout</div>
                          </div>
                          <div className="text-xs md:text-xl font-black text-neon-green font-mono">{formatMoney(asset.cost)}</div>
                      </button>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default MiamiTycoonGame;
