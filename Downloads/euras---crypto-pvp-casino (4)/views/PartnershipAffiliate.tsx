
import React from 'react';
import { User } from '../types';
import { Handshake, Users, Coins, TrendingUp, Link as LinkIcon, Copy } from 'lucide-react';

interface Props {
  user: User | null;
}

const AffiliateView: React.FC<Props> = ({ user }) => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
         <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4">
               EURAS <span className="text-fox-orange">AFFILIATE</span>
            </h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xl">
               Earn passive income by bringing new players into the pack. We share our success with you.
            </p>
         </div>
         <div className="bg-fox-orange rounded-[3rem] p-10 shadow-pop-orange text-black rotate-2 text-center">
            <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 text-center">Your Commission</div>
            <div className="text-6xl font-black italic tracking-tighter">40%</div>
            <div className="text-xs font-black uppercase tracking-tighter mt-1">RAKE REVENUE SHARE</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-card-bg border border-gray-800 p-8 rounded-3xl shadow-card-depth flex flex-col items-center text-center">
            <Users className="text-fox-orange mb-4" size={32} />
            <div className="text-xs font-black text-gray-500 uppercase mb-1">Total Referrals</div>
            <div className="text-3xl font-black text-white italic">142</div>
         </div>
         <div className="bg-card-bg border border-gray-800 p-8 rounded-3xl shadow-card-depth flex flex-col items-center text-center">
            <TrendingUp className="text-neon-green mb-4" size={32} />
            <div className="text-xs font-black text-gray-500 uppercase mb-1">Active This Week</div>
            <div className="text-3xl font-black text-white italic">48</div>
         </div>
         <div className="bg-card-bg border border-gray-800 p-8 rounded-3xl shadow-card-depth flex flex-col items-center text-center">
            <Coins className="text-yellow-400 mb-4" size={32} />
            <div className="text-xs font-black text-gray-500 uppercase mb-1">Total Earnings</div>
            <div className="text-3xl font-black text-white italic font-mono">12.45 SOL</div>
         </div>
      </div>

      <div className="bg-deep-black border border-gray-800 p-8 md:p-12 rounded-[3rem] shadow-2xl">
         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
            <LinkIcon className="text-fox-orange" /> Your Referral Link
         </h2>
         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-slate-900 border border-white/5 p-5 rounded-2xl text-gray-400 font-mono text-sm flex items-center overflow-hidden">
               {user ? `https://euras.casino/ref/${user.username.toLowerCase()}` : 'Connect wallet to see link'}
            </div>
            <button className="bg-fox-orange text-white px-8 py-5 rounded-2xl font-black text-xs uppercase shadow-pop-orange btn-tactile flex items-center justify-center gap-2">
               <Copy size={16} /> Copy Link
            </button>
         </div>
         <p className="text-[10px] text-gray-600 font-bold uppercase mt-6 tracking-widest text-center">
            Earn 30% to 40% of every SOL that Euras takes as rake from your referred players.
         </p>
      </div>
    </div>
  );
};

export default AffiliateView;
