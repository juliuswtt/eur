import React, { useState } from 'react';
import { Trophy, Medal, Flame, TrendingUp, TrendingDown, Clock, Crown, Coins, Shield } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  value: string; // Score or SOL
  trend: 'up' | 'down' | 'same';
  badge?: 'fire' | 'whale' | 'new';
  winRate?: string;
}

const MOCK_DATA_EARNINGS: LeaderboardEntry[] = [
  { rank: 1, username: 'SlyFox_OG', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fox1', value: '1,420.50 SOL', trend: 'same', badge: 'whale', winRate: '68%' },
  { rank: 2, username: 'DiamondHandz', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diamond', value: '985.20 SOL', trend: 'up', badge: 'fire', winRate: '54%' },
  { rank: 3, username: 'SolanaKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king', value: '850.00 SOL', trend: 'down', winRate: '49%' },
  { rank: 4, username: 'RugPullSurvivor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rug', value: '620.10 SOL', trend: 'up', winRate: '51%' },
  { rank: 5, username: 'WagerMachine', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=machine', value: '550.00 SOL', trend: 'up', badge: 'new', winRate: '42%' },
  { rank: 6, username: 'BasedGod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=based', value: '410.50 SOL', trend: 'down', winRate: '50%' },
  { rank: 7, username: 'MoonBoy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moon', value: '390.20 SOL', trend: 'same', winRate: '33%' },
  { rank: 8, username: 'PepeLover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pepe', value: '310.00 SOL', trend: 'up', badge: 'fire', winRate: '60%' },
  { rank: 9, username: 'DegenLife', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=degen', value: '250.50 SOL', trend: 'down', winRate: '45%' },
  { rank: 10, username: 'CryptoDad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dad', value: '105.00 SOL', trend: 'same', winRate: '48%' },
];

const MOCK_DATA_WINS: LeaderboardEntry[] = [
  { rank: 1, username: 'PokerPro_99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=poker', value: '412 Wins', trend: 'up', badge: 'fire', winRate: '82%' },
  { rank: 2, username: 'Connect4God', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4', value: '380 Wins', trend: 'same', badge: 'whale', winRate: '95%' },
  { rank: 3, username: 'SlyFox_OG', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fox1', value: '310 Wins', trend: 'down', winRate: '68%' },
  // ... reuse visuals for demo
  { rank: 4, username: 'GridMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grid', value: '290 Wins', trend: 'up', winRate: '60%' },
  { rank: 5, username: 'LuckIsSkill', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luck', value: '250 Wins', trend: 'up', winRate: '51%' },
];

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EARNINGS' | 'WINS' | 'WAGER'>('EARNINGS');
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'ALL_TIME'>('WEEKLY');

  const data = activeTab === 'WINS' ? MOCK_DATA_WINS : MOCK_DATA_EARNINGS;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      
      {/* Prize Pool Banner - Creating Urgency */}
      <div className="relative bg-gradient-to-r from-brand-purple to-indigo-900 rounded-3xl p-6 md:p-8 overflow-hidden shadow-card-depth border border-indigo-500/30">
        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
             <div className="inline-flex items-center gap-2 bg-black/30 text-neon-green px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider mb-2 border border-white/10">
                <Clock size={12} /> Season Ends in 2d 14h
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tight">
               WEEKLY <span className="text-fox-orange">PRIZE POOL</span>
             </h1>
             <p className="text-indigo-200 mt-2 font-medium max-w-lg">
               Compete against the best. Top 100 players split the pot. Grind your way to the Fox King status.
             </p>
          </div>

          <div className="flex flex-col items-center">
             <div className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">Current Pot</div>
             <div className="text-5xl md:text-6xl font-black text-white drop-shadow-xl font-mono flex items-center gap-2">
                <Coins className="text-yellow-400" size={40} strokeWidth={3} />
                $50,000
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         
         {/* Category Tabs */}
         <div className="bg-card-bg p-1.5 rounded-2xl border border-gray-800 flex shadow-sm">
            {(['EARNINGS', 'WINS', 'WAGER'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                  activeTab === tab 
                  ? 'bg-fox-orange text-white shadow-pop-orange transform -translate-y-[1px]' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab === 'EARNINGS' ? 'Top Earners' : tab === 'WINS' ? 'Most Wins' : 'Wager King'}
              </button>
            ))}
         </div>

         {/* Timeframe Switch */}
         <div className="bg-card-bg p-1.5 rounded-2xl border border-gray-800 flex shadow-sm">
            <button 
              onClick={() => setTimeframe('WEEKLY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeframe === 'WEEKLY' ? 'bg-slate-700 text-white' : 'text-gray-500'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setTimeframe('ALL_TIME')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${timeframe === 'ALL_TIME' ? 'bg-slate-700 text-white' : 'text-gray-500'}`}
            >
              All Time
            </button>
         </div>
      </div>

      {/* Podium Section (Top 3) */}
      <div className="flex justify-center items-end gap-4 md:gap-8 mb-8 pt-8">
         {/* 2nd Place */}
         <div className="flex flex-col items-center group">
            <div className="relative">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-300 border-4 border-gray-400 overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                  <img src={top3[1].avatar} className="w-full h-full" alt="2nd" />
               </div>
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white font-black px-3 py-1 rounded-full border-2 border-white shadow-sm text-xs">
                  #2
               </div>
            </div>
            <div className="mt-4 text-center">
               <div className="font-bold text-white text-sm md:text-base">{top3[1].username}</div>
               <div className="text-neon-green font-mono font-black text-sm">{top3[1].value}</div>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-gray-800/50 to-transparent mt-4 rounded-t-2xl"></div>
         </div>

         {/* 1st Place */}
         <div className="flex flex-col items-center group relative z-10 -mb-4">
            <div className="absolute -top-12 animate-float">
               <Crown size={48} className="text-yellow-400 drop-shadow-lg fill-yellow-400/20" />
            </div>
            <div className="relative">
               <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-yellow-400 border-4 border-yellow-300 overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.4)] group-hover:scale-105 transition-transform">
                  <img src={top3[0].avatar} className="w-full h-full" alt="1st" />
               </div>
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white font-black px-4 py-1.5 rounded-full border-2 border-white shadow-lg text-sm">
                  #1
               </div>
            </div>
            <div className="mt-5 text-center">
               <div className="font-black text-white text-lg md:text-xl flex items-center gap-2">
                 {top3[0].username} 
                 {top3[0].badge === 'whale' && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">WHALE</span>}
               </div>
               <div className="text-neon-green font-mono font-black text-lg md:text-xl">{top3[0].value}</div>
            </div>
            <div className="h-32 w-full bg-gradient-to-t from-yellow-500/10 to-transparent mt-4 rounded-t-2xl w-32 mx-auto"></div>
         </div>

         {/* 3rd Place */}
         <div className="flex flex-col items-center group">
            <div className="relative">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-orange-700 border-4 border-orange-600 overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                  <img src={top3[2].avatar} className="w-full h-full" alt="3rd" />
               </div>
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-black px-3 py-1 rounded-full border-2 border-white shadow-sm text-xs">
                  #3
               </div>
            </div>
            <div className="mt-4 text-center">
               <div className="font-bold text-white text-sm md:text-base">{top3[2].username}</div>
               <div className="text-neon-green font-mono font-black text-sm">{top3[2].value}</div>
            </div>
            <div className="h-20 w-full bg-gradient-to-t from-gray-800/50 to-transparent mt-4 rounded-t-2xl"></div>
         </div>
      </div>

      {/* The List (4-100) */}
      <div className="bg-card-bg border border-gray-800 rounded-3xl overflow-hidden shadow-card-depth">
         <div className="grid grid-cols-12 px-6 py-4 bg-slate-900/50 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1 md:col-span-1">Rank</div>
            <div className="col-span-6 md:col-span-5">Player</div>
            <div className="hidden md:block col-span-3 text-center">Win Rate</div>
            <div className="col-span-5 md:col-span-3 text-right">Score</div>
         </div>

         <div className="divide-y divide-gray-800">
            {rest.map((player) => (
              <div key={player.rank} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/5 transition-colors group">
                 {/* Rank */}
                 <div className="col-span-1 md:col-span-1 font-black text-gray-500 group-hover:text-white">
                    {player.rank}
                 </div>

                 {/* Player Profile */}
                 <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                    <img src={player.avatar} className="w-8 h-8 rounded-lg bg-gray-700" alt="Av" />
                    <div className="flex flex-col">
                       <span className="font-bold text-sm text-white flex items-center gap-2">
                         {player.username}
                         {player.badge === 'fire' && <Flame size={12} className="text-orange-500 fill-orange-500" />}
                         {player.badge === 'new' && <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded">NEW</span>}
                       </span>
                       <span className={`text-[10px] font-bold flex items-center gap-1 ${player.trend === 'up' ? 'text-green-500' : player.trend === 'down' ? 'text-red-500' : 'text-gray-600'}`}>
                          {player.trend === 'up' && <TrendingUp size={10} />}
                          {player.trend === 'down' && <TrendingDown size={10} />}
                          {player.trend === 'same' ? '-' : Math.floor(Math.random() * 5 + 1)} Positions
                       </span>
                    </div>
                 </div>

                 {/* Win Rate (Desktop) */}
                 <div className="hidden md:block col-span-3 text-center">
                    <div className="w-full bg-gray-700 rounded-full h-1.5 max-w-[100px] mx-auto overflow-hidden">
                       <div className="bg-brand-purple h-full rounded-full" style={{ width: player.winRate }}></div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">{player.winRate}</div>
                 </div>

                 {/* Score */}
                 <div className="col-span-5 md:col-span-3 text-right font-black font-mono text-neon-green">
                    {player.value}
                 </div>
              </div>
            ))}
            
            {/* Show More Button */}
            <div className="p-4 text-center">
               <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Load Top 100...</button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Leaderboard;