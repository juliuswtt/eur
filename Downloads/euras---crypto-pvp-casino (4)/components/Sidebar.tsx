
import React from 'react';
import { ViewState } from '../types';
import { Home, Spade, Grid3X3, Trophy, Zap, TrendingUp, Sun, Briefcase, Map, Truck, Music, Joystick, LayoutDashboard, Target, Crown, Handshake, Video, ShoppingBag, Package, Hash, Layers, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const pvpItems = [
    { id: ViewState.GAME_MARKET, label: 'Market Royale', icon: TrendingUp },
    { id: ViewState.GAME_POKER, label: 'Texas Hold\'em', icon: Spade },
    { id: ViewState.GAME_CONNECT4, label: 'Cyber Connect', icon: Grid3X3 },
    { id: ViewState.GAME_LUDO, label: 'Ludo', icon: Hash },
    { id: ViewState.GAME_MAUMAU, label: 'Mau Mau', icon: Joystick },
    { id: ViewState.GAME_ESTATE, label: 'Euras Estate', icon: Layers },
  ];

  const soloItems = [
    { id: ViewState.GAME_VEGAS, label: 'Vegas Night', icon: Music },
    { id: ViewState.GAME_NARCO, label: 'Narco Euras', icon: Truck },
    { id: ViewState.GAME_EPSTEIN, label: 'The Island', icon: Map },
    { id: ViewState.GAME_TYCOON, label: 'Miami Simulator', icon: Sun },
    { id: ViewState.GAME_UNEMPLOYMENT, label: 'Unemployment Sim', icon: Briefcase },
  ];

  const partnershipItems = [
    { id: ViewState.PARTNER_AMBASSADOR, label: 'Ambassador', icon: Crown },
    { id: ViewState.PARTNER_AFFILIATE, label: 'Affiliate', icon: Handshake },
    { id: ViewState.PARTNER_CREATOR, label: 'Clipper', icon: Video },
  ];

  const profileItems = [
    { id: ViewState.VAULT, label: 'Euras Vault', icon: ShoppingBag, highlight: true },
    { id: ViewState.MY_PACK, label: 'My Pack', icon: Package },
    { id: ViewState.LEADERBOARD, label: 'Leaderboard', icon: Trophy },
    { id: ViewState.PROFILE_SETTINGS, label: 'Account Keys', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-card-bg border-r border-gray-800/50">
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChangeView(ViewState.LOBBY)}>
          <div className="leading-tight">
             <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">EURAS</h1>
             <p className="text-[10px] text-fox-orange font-black uppercase tracking-[0.2em] mt-1">Degen Casino</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 no-scrollbar pb-10">
        <div className="space-y-1">
           <button
             onClick={() => onChangeView(ViewState.LOBBY)}
             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
               currentView === ViewState.LOBBY
                 ? 'bg-deep-black text-white shadow-sm border border-white/5'
                 : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
             }`}
           >
             <LayoutDashboard size={18} className={currentView === ViewState.LOBBY ? 'text-fox-orange' : ''} />
             Lobby
           </button>
           {profileItems.map((item) => (
               <button
                 key={item.id}
                 onClick={() => onChangeView(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                   currentView === item.id
                     ? 'bg-deep-black text-white border border-white/5'
                     : item.highlight ? 'text-fox-orange bg-fox-orange/5 hover:bg-fox-orange/10' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                 }`}
               >
                 <item.icon size={18} className={currentView === item.id ? 'text-fox-orange' : ''} />
                 {item.label}
               </button>
           ))}
        </div>

        <div>
           <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center gap-2">Casino (PvP)</h3>
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
           </div>
           <div className="space-y-1">
             {pvpItems.map((item) => (
               <button key={item.id} onClick={() => onChangeView(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-bold text-xs ${currentView === item.id ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                 <item.icon size={18} className={currentView === item.id ? 'text-neon-green' : 'text-gray-600'} />
                 {item.label}
               </button>
             ))}
           </div>
        </div>

        <div>
           <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] px-4 mb-3 flex items-center gap-2">Originals (Solo)</h3>
           <div className="space-y-1">
             {soloItems.map((item) => (
               <button key={item.id} onClick={() => onChangeView(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-bold text-xs ${currentView === item.id ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                 <item.icon size={18} className={currentView === item.id ? 'text-brand-purple' : 'text-gray-600'} />
                 {item.label}
               </button>
             ))}
           </div>
        </div>

        <div>
           <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] px-4 mb-3 flex items-center gap-2">Partner</h3>
           <div className="space-y-1">
             {partnershipItems.map((item) => (
               <button key={item.id} onClick={() => onChangeView(item.id)} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-bold text-xs ${currentView === item.id ? 'bg-neon-red/10 text-neon-red border border-neon-red/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                 <item.icon size={18} className={currentView === item.id ? 'text-neon-red' : 'text-gray-600'} />
                 {item.label}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
