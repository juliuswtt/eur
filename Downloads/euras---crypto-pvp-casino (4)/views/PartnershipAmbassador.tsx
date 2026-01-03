
import React from 'react';
import { Crown, Star, Sparkles, Zap, ShieldCheck, Gem } from 'lucide-react';

const AmbassadorView: React.FC = () => {
  const benefits = [
    { title: "Featured in Games", desc: "Your avatar and name featured as special NPCs or Bosses in our Original games like Vegas Night.", icon: <Star className="text-yellow-400" /> },
    { title: "Weekly Play Budget", desc: "Receive direct SOL injection into your wallet every week to keep the high-stakes action going.", icon: <Gem className="text-blue-400" /> },
    { title: "Exclusive Live Rights", desc: "Priority streaming access and special 'Live Now' badges on the Euras homepage.", icon: <Zap className="text-fox-orange" /> },
    { title: "Pack VIP Status", desc: "Direct line to the devs, input on new game features, and limited edition Eurasier merch.", icon: <ShieldCheck className="text-neon-green" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-16 animate-in zoom-in duration-500">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-purple/20 text-brand-purple rounded-full border border-brand-purple/30 text-[10px] font-black uppercase tracking-widest mb-6 shadow-pop-purple animate-bounce">
            <Crown size={14} /> Elite Partnership
         </div>
         <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4 drop-shadow-2xl">
            BRAND <span className="text-brand-purple">AMBASSADOR</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            Become the face of Euras. Exclusive perks for the most influential wolves in the pack.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {benefits.map((benefit, idx) => (
           <div key={idx} className="bg-card-bg border border-gray-800 p-8 rounded-[2.5rem] shadow-card-depth hover:border-brand-purple transition-all duration-300 group">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                 {benefit.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">{benefit.title}</h3>
              <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase">{benefit.desc}</p>
           </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-brand-purple to-indigo-900 p-10 rounded-[3rem] text-center border border-white/10 shadow-2xl relative overflow-hidden">
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
         <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Ready for the Throne?</h2>
         <p className="text-indigo-100 text-sm font-medium mb-8 max-w-lg mx-auto leading-relaxed uppercase tracking-widest">
            We are looking for active creators who stream daily and have a loyal community. Apply now for the exclusive Ambassador program.
         </p>
         <button className="bg-white text-brand-purple px-12 py-5 rounded-2xl font-black text-base uppercase italic tracking-tighter shadow-xl hover:scale-105 transition-transform btn-tactile">
            APPLY NOW
         </button>
      </div>
    </div>
  );
};

export default AmbassadorView;
