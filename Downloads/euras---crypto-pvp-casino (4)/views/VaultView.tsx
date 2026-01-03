
import React, { useState } from 'react';
import { User, ShopItem } from '../types';
import { SHOP_CATALOG } from '../constants';
import { ShoppingBag, Sparkles, Zap, Star, ShieldCheck, Coins, PackageCheck, AlertCircle } from 'lucide-react';

interface Props {
  user: User | null;
  onPurchase: (itemId: string, price: number) => boolean;
}

const VaultView: React.FC<Props> = ({ user, onPurchase }) => {
  const [filter, setFilter] = useState<'all' | 'skin' | 'effect' | 'emote'>('all');
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const items = filter === 'all' ? SHOP_CATALOG : SHOP_CATALOG.filter(i => i.type === filter);

  const handleBuy = (item: ShopItem) => {
    if (!user) return alert("Connect your wallet first!");
    if (user.ownedItemIds.includes(item.id)) return alert("You already own this item!");
    
    const success = onPurchase(item.id, item.price);
    if (success) {
      setPurchaseStatus(`Successfully purchased ${item.name}! Check your Pack.`);
      setTimeout(() => setPurchaseStatus(null), 3000);
    } else {
      alert("Insufficient balance!");
    }
  };

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'rare': return 'text-neon-blue bg-neon-blue/10 border-neon-blue/20';
      case 'epic': return 'text-brand-purple bg-brand-purple/10 border-brand-purple/20';
      case 'legendary': return 'text-fox-orange bg-fox-orange/10 border-fox-orange/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
         <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-fox-orange/20 text-fox-orange rounded-full border border-fox-orange/30 text-[10px] font-black uppercase tracking-widest mb-4">
               <Sparkles size={14} /> Daily Refresh
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4">
               EURAS <span className="text-fox-orange">VAULT</span>
            </h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">Upgrade your identity. Flex your rarity.</p>
         </div>

         <div className="flex bg-card-bg p-1.5 rounded-2xl border border-gray-800 w-full md:w-auto overflow-x-auto no-scrollbar">
            {(['all', 'skin', 'effect', 'emote'] as const).map(f => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)}
                 className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-fox-orange text-white shadow-pop-orange' : 'text-gray-500 hover:text-white'}`}
               >
                 {f}
               </button>
            ))}
         </div>
      </div>

      {purchaseStatus && (
        <div className="mb-8 p-4 bg-neon-green/10 border border-neon-green/30 rounded-2xl flex items-center gap-3 text-neon-green font-black uppercase text-xs animate-in slide-in-from-top-4">
           <PackageCheck size={20} /> {purchaseStatus}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => {
           const owned = user?.ownedItemIds.includes(item.id);
           return (
             <div key={item.id} className="bg-card-bg rounded-[2.5rem] border border-gray-800 p-2 flex flex-col group overflow-hidden shadow-card-depth hover:border-white/20 transition-all duration-300">
                <div className="relative aspect-square bg-slate-900 rounded-[2rem] flex items-center justify-center overflow-hidden mb-4">
                   {item.type === 'skin' ? (
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                   ) : (
                      <div className="text-7xl group-hover:scale-125 transition-transform duration-500 drop-shadow-2xl">{item.image}</div>
                   )}
                   <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getRarityClass(item.rarity)}`}>
                      {item.rarity}
                   </div>
                   {item.type === 'effect' && <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/20 to-transparent"></div>}
                </div>
                
                <div className="px-4 pb-4 flex-1 flex flex-col">
                   <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-1 truncate">{item.name}</h3>
                   <p className="text-[9px] text-gray-500 font-bold uppercase leading-tight mb-6 line-clamp-2">{item.description}</p>
                   
                   <button 
                     onClick={() => handleBuy(item)}
                     disabled={owned}
                     className={`mt-auto w-full py-3 rounded-2xl font-black text-xs uppercase italic tracking-tighter flex items-center justify-center gap-2 transition-all btn-tactile ${
                       owned 
                       ? 'bg-slate-800 text-gray-600 border border-gray-700 cursor-not-allowed' 
                       : 'bg-white text-black hover:bg-gray-100 shadow-xl'
                     }`}
                   >
                     {owned ? (
                       <>OWNED <ShieldCheck size={14} /></>
                     ) : (
                       <><Coins size={14} className="text-fox-orange" /> {item.price} SOL</>
                     )}
                   </button>
                </div>
             </div>
           );
        })}
      </div>

      <div className="mt-20 p-8 bg-slate-900/50 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-fox-orange rounded-3xl flex items-center justify-center text-white shadow-pop-orange">
               <AlertCircle size={32} />
            </div>
            <div>
               <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">Limited Time Drops</h4>
               <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Store resets in 14 hours. Don't miss out on rare collectibles.</p>
            </div>
         </div>
         <button className="px-10 py-4 bg-card-bg border border-gray-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:text-white transition-colors">Notify Me</button>
      </div>
    </div>
  );
};

export default VaultView;
