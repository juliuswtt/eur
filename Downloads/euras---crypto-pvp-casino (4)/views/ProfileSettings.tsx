
import React, { useState } from 'react';
import { User } from '../types';
import { Key, Shield, Wallet, Trash2, Plus, Copy, Check, Eye, EyeOff, Smartphone, Clock } from 'lucide-react';

interface Props {
  user: User | null;
  onRemoveWallet: (address: string) => void;
  onConnectNew: () => void;
}

const ProfileSettings: React.FC<Props> = ({ user, onRemoveWallet, onConnectNew }) => {
  const [showKeys, setShowKeys] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!user) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 animate-in slide-in-from-bottom-6 duration-500">
       <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">Account <br/> <span className="text-fox-orange">Den Control</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your identity and linked vaults.</p>
          </div>
          <div className="bg-slate-900 border-2 border-white/5 p-4 px-8 rounded-3xl flex items-center gap-6">
             <div className="text-right">
                <div className="text-[10px] font-black text-gray-600 uppercase">Account Status</div>
                <div className="text-neon-green font-black uppercase italic tracking-tighter">Verified Alpha</div>
             </div>
             <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green border-2 border-neon-green/30">
                <Shield size={24} />
             </div>
          </div>
       </div>

       {/* EURAS KEYS SECTION */}
       <div className="bg-card-bg border-4 border-gray-800 rounded-[3rem] p-8 md:p-12 shadow-card-depth relative overflow-hidden group">
          {/* Dekorative Hintergrund-Ebene - MUSST pointer-events-none HABEN */}
          <div className="absolute top-0 right-0 p-32 bg-fox-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
          
          <div className="flex items-center justify-between mb-10 relative z-20">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-fox-orange/10 rounded-2xl border-2 border-fox-orange/30 text-fox-orange shadow-lg">
                   <Key size={32} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Euras Restoration Keys</h2>
                   <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Use these to access your account on any device.</p>
                </div>
             </div>
             {/* EYE BUTTON MIT MAX Z-INDEX */}
             <button 
               type="button"
               onClick={() => setShowKeys(!showKeys)}
               className="p-4 bg-slate-900 rounded-2xl border-2 border-gray-700 text-gray-400 hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer relative z-[100] hover:border-fox-orange/50"
             >
                {showKeys ? <EyeOff size={24} /> : <Eye size={24} />}
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
             <div className="bg-slate-950 p-6 rounded-[2rem] border-2 border-gray-800 relative group/key">
                <label className="text-[10px] font-black text-gray-600 uppercase block mb-3 tracking-widest italic">Profile ID (16 Chars)</label>
                <div className="flex items-center justify-between">
                   <span className={`font-mono text-xl md:text-2xl font-black tracking-widest transition-all duration-300 ${showKeys ? 'text-white blur-0' : 'text-gray-800 select-none blur-md'}`}>
                      {showKeys ? user.profileKey : 'XXXX-XXXX-XXXX-XXXX'}
                   </span>
                   {showKeys && (
                     <button onClick={() => copyToClipboard(user.profileKey, 'pk')} className="text-gray-600 hover:text-fox-orange transition-colors p-2">
                        {copied === 'pk' ? <Check size={20} className="text-neon-green" /> : <Copy size={20} />}
                     </button>
                   )}
                </div>
             </div>

             <div className="bg-slate-950 p-6 rounded-[2rem] border-2 border-gray-800 relative">
                <label className="text-[10px] font-black text-gray-600 uppercase block mb-3 tracking-widest italic">Security Key (10 Chars)</label>
                <div className="flex items-center justify-between">
                   <span className={`font-mono text-xl md:text-2xl font-black tracking-widest transition-all duration-300 ${showKeys ? 'text-brand-purple blur-0' : 'text-gray-800 select-none blur-md'}`}>
                      {showKeys ? user.securityKey : 'XXXX-XXXX-XXXX'}
                   </span>
                   {showKeys && (
                     <button onClick={() => copyToClipboard(user.securityKey, 'sk')} className="text-gray-600 hover:text-brand-purple transition-colors p-2">
                        {copied === 'sk' ? <Check size={20} className="text-neon-green" /> : <Copy size={20} />}
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="mt-8 flex items-start gap-4 p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl relative z-10">
             <Shield className="text-rose-500 shrink-0" size={20} />
             <p className="text-[10px] font-bold text-rose-300 uppercase leading-relaxed tracking-widest">
                NEVER share these keys. Anyone with these keys can withdraw your SOL and steal your skins.
             </p>
          </div>
       </div>

       {/* WALLET MANAGEMENT */}
       <div className="bg-card-bg border-4 border-gray-800 rounded-[3rem] p-8 md:p-12 shadow-card-depth">
          <div className="flex justify-between items-center mb-10">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-neon-blue/10 rounded-2xl border-2 border-neon-blue/30 text-neon-blue shadow-lg">
                   <Wallet size={32} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Linked Vaults</h2>
                   <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Wallets associated with this account.</p>
                </div>
             </div>
             <button 
               onClick={onConnectNew}
               className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase italic shadow-xl btn-tactile flex items-center gap-2"
             >
                <Plus size={18} /> Link New
             </button>
          </div>

          <div className="space-y-4">
             {user.wallets.map((w, idx) => (
                <div key={idx} className="bg-slate-900 border-2 border-gray-800 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-neon-blue/30 transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-xl ${w.provider === 'Phantom' ? 'bg-[#AB9FF2]' : 'bg-[#FC7226]'}`}>
                         {w.provider.charAt(0)}
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-white font-mono tracking-tighter">{w.address.substring(0,6)}...{w.address.substring(w.address.length - 4)}</span>
                            {user.activeWallet === w.address && <span className="bg-neon-green/20 text-neon-green px-2 py-0.5 rounded text-[8px] font-black uppercase border border-neon-green/30">Primary</span>}
                         </div>
                         <div className="flex items-center gap-4 mt-1 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Smartphone size={12} /> {w.provider}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> Added {new Date(w.addedAt).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <button onClick={() => onRemoveWallet(w.address)} className="p-4 text-gray-600 hover:text-rose-500 transition-colors">
                         <Trash2 size={22} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
             <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">Liquidate Session</h4>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Log out of this browser and clear all local dens.</p>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('euras_active_user'); window.location.reload(); }}
            className="px-10 py-4 bg-rose-600/10 border border-rose-500/30 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-xl"
          >
             TERMINATE SESSION
          </button>
       </div>
    </div>
  );
};

export default ProfileSettings;
