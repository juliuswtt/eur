
import React, { useState } from 'react';
import { User, ShopItem } from '../types';
import { SHOP_CATALOG } from '../constants';
import { Package, ShieldCheck, Check, Sparkles, UserCircle, Zap, MessageSquare } from 'lucide-react';

interface Props {
  user: User | null;
  onEquip: (itemId: string, type: 'pfp' | 'effect' | 'emote') => void;
}

const MyPackView: React.FC<Props> = ({ user, onEquip }) => {
  const [activeTab, setActiveTab] = useState<'skin' | 'effect' | 'emote'>('skin');

  if (!user) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
       <Package size={64} className="text-gray-800 mb-4" />
       <h2 className="text-2xl font-black uppercase text-white">Wallet Not Connected</h2>
       <p className="text-gray-500 uppercase font-black text-[10px] mt-2 tracking-widest">Your items are stored on the blockchain.</p>
    </div>
  );

  const ownedItems = SHOP_CATALOG.filter(i => user.ownedItemIds.includes(i.id));
  const items = ownedItems.filter(i => i.type === activeTab);

  const isEquipped = (itemId: string) => {
    if (activeTab === 'skin') return user.equipped.pfp === itemId;
    if (activeTab === 'effect') return user.equipped.effect === itemId;
    if (activeTab === 'emote') return user.equipped.emotes.includes(itemId);
    return false;
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 pb-32">
       <div className="flex flex-col md:flex-row gap-10 mb-16">
          <div className="w-full md:w-1/3 bg-card-bg rounded-[3rem] border border-gray-800 p-8 flex flex-col items-center text-center shadow-card-depth">
             <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Active Identity</h2>
             <div className="relative w-48 h-48 bg-slate-900 rounded-[3rem] border-4 border-fox-orange overflow-hidden mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <img src={user.equipped.pfp ? SHOP_CATALOG.find(i => i.id === user.equipped.pfp)?.image : user.avatar} className="w-full h-full object-cover" alt="" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-fox-orange text-white px-3 py-1 rounded-full text-[8px] font-black uppercase">LIVE PREVIEW</div>
             </div>
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{user.username}</h3>
             {/* Use activeWallet instead of walletAddress which does not exist on User type */}
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-8">{user.activeWallet}</p>
             
             <div className="w-full space-y-2">
                <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black text-gray-500 uppercase">Effect</span>
                   <span className="text-xs font-bold text-white">{user.equipped.effect ? SHOP_CATALOG.find(i => i.id === user.equipped.effect)?.name : 'None'}</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black text-gray-500 uppercase">Emotes</span>
                   <span className="text-xs font-bold text-white">{user.equipped.emotes.length}/4 Equipped</span>
                </div>
             </div>
          </div>

          <div className="flex-1">
             <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">MY <span className="text-fox-orange">PACK</span></h1>
                <div className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/5">
                   <button onClick={() => setActiveTab('skin')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'skin' ? 'bg-fox-orange text-white' : 'text-gray-500'}`}><UserCircle size={18} /></button>
                   <button onClick={() => setActiveTab('effect')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'effect' ? 'bg-fox-orange text-white' : 'text-gray-500'}`}><Zap size={18} /></button>
                   <button onClick={() => setActiveTab('emote')} className={`p-2.5 rounded-xl transition-all ${activeTab === 'emote' ? 'bg-fox-orange text-white' : 'text-gray-500'}`}><MessageSquare size={18} /></button>
                </div>
             </div>

             {items.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-20 text-center">
                   <Package size={48} className="text-gray-800 mx-auto mb-4" />
                   <p className="text-sm font-black text-gray-600 uppercase italic tracking-widest">No items found in this category.</p>
                </div>
             ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                   {items.map(item => (
                      /* Fix for line 75: Mapping item type 'skin' to expected onEquip parameter 'pfp' */
                      <div key={item.id} className={`bg-card-bg rounded-[2.5rem] p-4 border transition-all flex flex-col items-center text-center group cursor-pointer ${isEquipped(item.id) ? 'border-fox-orange shadow-lg scale-[1.02]' : 'border-gray-800 hover:border-gray-600'}`} onClick={() => onEquip(item.id, item.type === 'skin' ? 'pfp' : item.type)}>
                         <div className="relative w-full aspect-square bg-slate-900 rounded-[1.5rem] flex items-center justify-center mb-4 overflow-hidden">
                             {item.type === 'skin' ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <div className="text-5xl">{item.image}</div>}
                             {isEquipped(item.id) && (
                                <div className="absolute top-2 right-2 bg-fox-orange text-white p-1 rounded-full shadow-lg">
                                   <Check size={12} strokeWidth={4} />
                                </div>
                             )}
                         </div>
                         <h4 className="text-sm font-black text-white uppercase italic tracking-tighter truncate w-full">{item.name}</h4>
                         <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Equip to identity</p>
                      </div>
                   ))}
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default MyPackView;
