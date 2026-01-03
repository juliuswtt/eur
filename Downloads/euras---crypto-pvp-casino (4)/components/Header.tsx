
import React, { useState, useEffect, useRef } from 'react';
import { User, ViewState } from '../types';
import { SHOP_CATALOG } from '../constants';
import { Wallet, Bell, Plus, Search, Settings } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onConnect: () => void;
  onOpenBank: () => void;
  liveFeed: string[];
  onChangeView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onConnect, onOpenBank, liveFeed, onChangeView }) => {
  const [showWinAnim, setShowWinAnim] = useState(false);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const prevBalanceRef = useRef<number>(user?.balance || 0);

  useEffect(() => {
    if (user && user.balance > prevBalanceRef.current) {
      const diff = Math.round((user.balance - prevBalanceRef.current) * 1000) / 1000;
      if (diff > 0) {
        setWinAmount(diff);
        setShowWinAnim(true);
        const timer = setTimeout(() => setShowWinAnim(false), 3000);
        return () => clearTimeout(timer);
      }
    }
    if (user) prevBalanceRef.current = user.balance;
  }, [user?.balance]);

  const getDisplayAvatar = () => {
    if (!user) return null;
    if (user.equipped.pfp) {
      const skin = SHOP_CATALOG.find(s => s.id === user.equipped.pfp);
      if (skin) return skin.image;
    }
    return user.avatar;
  };

  return (
    <header className="h-16 bg-card-bg/95 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-40 sticky top-0 border-b border-gray-800/50">
      <div className="hidden lg:flex items-center bg-deep-black rounded-xl px-3 py-1.5 border border-gray-700/50 w-64 group focus-within:border-fox-orange/50 transition-all">
        <Search size={16} className="text-gray-500 group-focus-within:text-fox-orange" />
        <input type="text" placeholder="Search games..." className="bg-transparent border-none outline-none text-[11px] font-bold text-gray-300 ml-2 w-full uppercase tracking-widest placeholder:text-gray-600"/>
      </div>

      <div className="md:hidden flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={() => onChangeView(ViewState.LOBBY)}>
         <span className="font-black text-white italic tracking-tighter uppercase text-xl">EURAS</span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {user ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className={`flex items-center bg-deep-black border transition-all duration-500 rounded-xl overflow-hidden shadow-sm ${showWinAnim ? 'border-neon-green shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105' : 'border-gray-800'}`}>
                 <div className="px-3 py-2 flex flex-col items-center justify-center border-r border-gray-800 min-w-[90px]">
                    <span className={`text-[10px] font-black tracking-tight leading-none transition-colors duration-500 ${showWinAnim ? 'text-neon-green' : 'text-fox-orange'}`}>
                      {user.balance.toFixed(3)} <span className="text-[8px] text-gray-500 ml-0.5">SOL</span>
                    </span>
                 </div>
                 <button 
                    onClick={onOpenBank}
                    className={`px-3 py-2 transition-colors duration-500 text-white group ${showWinAnim ? 'bg-neon-green' : 'bg-fox-orange hover:bg-fox-hover'}`}
                 >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                 </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
               <button onClick={() => onChangeView(ViewState.PROFILE_SETTINGS)} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5"><Settings size={18} /></button>
               <div className="h-10 w-10 rounded-xl bg-slate-700 border border-gray-600 overflow-hidden cursor-pointer hover:border-fox-orange transition-all shadow-lg" onClick={() => onChangeView(ViewState.PROFILE_SETTINGS)}>
                 <img src={getDisplayAvatar()!} alt="User" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        ) : (
          <button onClick={onConnect} className="flex items-center gap-2 bg-fox-orange text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase shadow-pop-orange btn-tactile">
            <Wallet size={16} /> Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
