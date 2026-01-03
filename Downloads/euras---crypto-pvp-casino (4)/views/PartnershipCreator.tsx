
import React from 'react';
import { Video, Sparkles, CheckCircle, AlertCircle, Play, DollarSign, Eye } from 'lucide-react';

const CreatorView: React.FC = () => {
  const rules = [
    "The Euras logo must be clearly visible at all times.",
    "Only our platform/games may be shown in the video.",
    "Positive or negative portrayal doesn't matter – just go viral.",
    "Payout occurs after verification of view authenticity.",
    "Short-form content ONLY (TikTok, Reels, Shorts).",
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pb-24">
      <div className="text-center mb-16 animate-in slide-in-from-top-10 duration-700">
         <div className="bg-neon-red/10 text-neon-red px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-neon-red/20 inline-flex items-center gap-2">
            <Video size={14} fill="currentColor" /> Content Creator Bounty
         </div>
         <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-4">
            CLIPPER <span className="text-neon-red">PROGRAM</span>
         </h1>
         <div className="bg-white text-black p-8 rounded-[2rem] shadow-pop-red -rotate-1 inline-block mt-4">
            <div className="text-7xl font-black italic tracking-tighter">$2,000</div>
            <div className="text-lg font-black uppercase tracking-tighter">PER 1,000,000 VIEWS</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
         <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
               <AlertCircle className="text-neon-red" /> The Conditions
            </h2>
            <div className="space-y-4">
               {rules.map((rule, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-slate-900 rounded-2xl border border-white/5 group hover:border-neon-red/30 transition-colors">
                     <CheckCircle className="text-neon-red shrink-0" size={20} />
                     <p className="text-xs font-bold text-gray-400 uppercase leading-relaxed">{rule}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="flex flex-col gap-6">
            <div className="bg-card-bg border border-gray-800 p-8 rounded-[2.5rem] shadow-card-depth flex-1 flex flex-col justify-center text-center">
               <Eye className="text-neon-red mx-auto mb-4" size={48} />
               <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Views = Cash</h3>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Whether you play yourself or clip viral moments of other players – as long as Euras is at the center, we pay.
               </p>
            </div>
            <div className="bg-card-bg border border-gray-800 p-8 rounded-[2.5rem] shadow-card-depth flex-1 flex flex-col justify-center text-center">
               <Play className="text-neon-blue mx-auto mb-4" size={48} />
               <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">All Platforms</h3>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  TikTok, Instagram Reels, YouTube Shorts. Show us your reach and claim your bounty.
               </p>
            </div>
         </div>
      </div>

      <div className="bg-slate-950 border border-white/5 p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Ready to post?</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Submit your links in our Discord server.</p>
         </div>
         <button className="bg-neon-red text-white px-12 py-5 rounded-2xl font-black text-base uppercase italic tracking-tighter shadow-pop-red btn-tactile hover:scale-105 transition-transform">
            JOIN DISCORD
         </button>
      </div>
    </div>
  );
};

export default CreatorView;
