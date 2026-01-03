
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
  ChevronLeft, Camera, Zap, Music, Smartphone, 
  Flame, Star, DollarSign, Users, Eye, Send, 
  Sparkles, Coins, Video, MessageSquare, Heart,
  Ghost, Skull, TrendingUp, Mic, Share2, MoreVertical,
  ThumbsUp, Ban, Trophy, Target
} from 'lucide-react';

interface Props {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

interface EventCard {
  id: string;
  title: string;
  desc: string;
  type: 'GAMBLE' | 'FIGHT' | 'PARTY' | 'STUNT' | 'CELEB';
  cost: number;
  rewardType: 'CASH' | 'CLOUT' | 'BOTH';
  celeb?: string;
}

const VEGAS_EVENTS: EventCard[] = [
  { id: 'steve_flip', title: 'Coin Flip w/ Steve Will Bet', desc: 'Double your stash or go broke. Happy Dad on the house.', type: 'CELEB', celeb: 'Steve Will Bet', cost: 1000, rewardType: 'BOTH' },
  { id: 'dana_cage', title: 'Dana Fight Ring-Side', desc: 'Bet on the main event. 2.0x Payout.', type: 'FIGHT', celeb: 'Dana Fight', cost: 2000, rewardType: 'CASH' },
  { id: 'donald_pump', title: 'Trump Plaza Meeting', desc: 'Flex your wallet for maximum Clout.', type: 'CELEB', celeb: 'Donald Pump', cost: 5000, rewardType: 'CLOUT' },
  { id: 'togi_vip', title: 'VIP Table w/ Togi', desc: 'Bottle service. Maximum Hype.', type: 'PARTY', celeb: 'Togster', cost: 3000, rewardType: 'CLOUT' },
  { id: 'slot_max', title: 'High Roller Slots', desc: 'Spin for the 1000x Jackpot.', type: 'GAMBLE', cost: 500, rewardType: 'CASH' },
];

const VegasDegenerateGame: React.FC<Props> = ({ user, updateBalance, onBack }) => {
  const [cash, setCash] = useState(10000);
  const [hype, setHype] = useState(30); // 0-100
  const [viewers, setViewers] = useState(1200);
  const [clout, setClout] = useState(420);
  const [activeEvent, setActiveEvent] = useState<EventCard | null>(null);
  const [chat, setChat] = useState<{user: string, msg: string, color: string}[]>([]);
  const [isWinning, setIsWinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  // Live Chat Logic
  useEffect(() => {
    const users = ['SolanaWhale', 'DegenMaster', 'Anon99', 'CryptoBae', 'SteveFan', 'EurasWolf'];
    const msgs = ['LFG!!! 🚀', 'DO IT!', 'He is actually insane', 'Euras to the moon!', 'Show the balance!', 'Is that Dana?', '100x incoming', 'RIP WALLET'];
    const colors = ['text-fox-orange', 'text-neon-blue', 'text-brand-purple', 'text-neon-green', 'text-pink-500'];

    const interval = setInterval(() => {
      const newMsg = {
        user: users[Math.floor(Math.random() * users.length)],
        msg: msgs[Math.floor(Math.random() * msgs.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setChat(prev => [newMsg, ...prev].slice(0, 15));
      
      // Dynamic Viewers
      setViewers(v => Math.max(800, v + Math.floor(Math.random() * 200 - 80)));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Hype Decay
  useEffect(() => {
    const decay = setInterval(() => setHype(h => Math.max(10, h - 1)), 2000);
    return () => clearInterval(decay);
  }, []);

  const handleAction = (event: EventCard) => {
    if (cash < event.cost) {
      setChat(prev => [{ user: 'SYSTEM', msg: 'INSUFFICIENT FUNDS, BROKE BOY!', color: 'text-neon-red' }, ...prev]);
      return;
    }

    setCash(c => c - event.cost);
    setHype(h => Math.min(100, h + 15));
    setActiveEvent(event);

    // Outcome Simulation
    setTimeout(() => {
      const win = Math.random() > 0.5;
      if (win) {
        const winAmt = event.rewardType === 'CLOUT' ? 0 : event.cost * 2.5;
        const cloutAmt = event.rewardType === 'CASH' ? 100 : 500;
        
        if (winAmt > 0) {
          setIsWinning(true);
          setLastWin(winAmt);
          setCash(c => c + winAmt);
          updateBalance(winAmt / 1000); // Small meta-balance update
          setTimeout(() => setIsWinning(false), 3000);
        }
        setClout(c => c + cloutAmt);
        setChat(prev => [{ user: 'CHAT', msg: 'HOLY SHIT HE DID IT! 🤑', color: 'text-neon-green' }, ...prev]);
      } else {
        setChat(prev => [{ user: 'CHAT', msg: 'REKT. 💀', color: 'text-neon-red' }, ...prev]);
      }
      setActiveEvent(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-deep-black z-[100] flex flex-col font-sans overflow-hidden select-none">
      
      {/* POV VEGAS STRIP BACKGROUND (Simulated with Gradient and dynamic elements) */}
      <div className="absolute inset-0 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
          {/* Neon Lights Simulation */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-fox-orange/10 blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-purple/10 blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute top-0 w-full h-1/2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* STREAMER HUD */}
      <div className="relative z-20 flex-1 flex flex-col p-4 md:p-8">
          
          {/* TOP INFO BAR */}
          <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
                      <div className="w-3 h-3 bg-neon-red rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
                      <span className="text-[10px] font-black uppercase italic tracking-widest text-white">LIVE</span>
                      <div className="w-px h-4 bg-white/10"></div>
                      <span className="text-xs font-mono font-black text-white">{viewers.toLocaleString()}</span>
                      <Eye size={14} className="text-white/50" />
                  </div>
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
                      <TrendingUp size={14} className="text-fox-orange" />
                      <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-fox-orange transition-all duration-500" style={{ width: `${hype}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-fox-orange uppercase italic">Hype</span>
                  </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                  <button onClick={onBack} className="bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 text-white/50 hover:text-white transition-colors">
                      <ChevronLeft size={24} />
                  </button>
                  <div className="bg-neon-green/10 border border-neon-green/30 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col items-end">
                      <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.2em] italic">Degen Bank</span>
                      <span className="text-2xl font-black text-white font-mono tracking-tighter">${cash.toLocaleString()}</span>
                  </div>
              </div>
          </div>

          {/* MAIN EVENT AREA - POV ACTION */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
              
              {/* Dynamic Encounter / Card Stack */}
              {!activeEvent && !isWinning ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                      <div className="mb-12 text-center">
                          <h2 className="text-5xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">
                              CHOOSE YOUR <br/> <span className="text-fox-orange">NEXT MOVE</span>
                          </h2>
                          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">Swipe through the Vegas Strip</p>
                      </div>

                      <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar snap-x px-10 w-screen justify-center">
                          {VEGAS_EVENTS.map(event => (
                              <button 
                                key={event.id}
                                onClick={() => handleAction(event)}
                                className="min-w-[280px] md:min-w-[350px] bg-card-bg border-4 border-white/5 rounded-[3rem] p-8 snap-center flex flex-col items-center text-center shadow-card-depth group hover:border-fox-orange transition-all hover:-translate-y-2"
                              >
                                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                                      {event.type === 'CELEB' ? '🤳' : event.type === 'GAMBLE' ? '🎰' : event.type === 'FIGHT' ? '🥊' : '🍾'}
                                  </div>
                                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-fox-orange transition-colors">{event.title}</h3>
                                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-8 leading-relaxed">{event.desc}</p>
                                  <div className="mt-auto w-full bg-white text-black py-4 rounded-2xl font-black italic uppercase tracking-tighter text-lg shadow-xl btn-tactile">
                                      BET ${event.cost.toLocaleString()}
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>
              ) : activeEvent ? (
                  <div className="flex flex-col items-center text-center animate-pulse">
                      <div className="w-32 h-32 bg-white/10 rounded-[3rem] border-4 border-white/20 flex items-center justify-center text-6xl mb-8 animate-bounce">
                          {activeEvent.celeb ? '🤩' : '🔥'}
                      </div>
                      <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-2">ACTION...</h2>
                      <p className="text-fox-orange font-black uppercase tracking-widest italic">{activeEvent.celeb || 'HIGH STAKES'}</p>
                  </div>
              ) : null}

              {/* MEGA WIN OVERLAY */}
              {isWinning && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-in zoom-in duration-300">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-green/20 blur-[100px] animate-pulse"></div>
                        <div className="p-12 bg-white/5 border-8 border-neon-green rounded-[4rem] flex flex-col items-center shadow-[0_0_100px_#10b981] animate-bounce relative z-10">
                            <Sparkles className="text-yellow-400 mb-6" size={80} />
                            <h3 className="text-8xl md:text-[10rem] font-black italic text-white uppercase tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">MEGA WIN</h3>
                            <div className="text-5xl md:text-7xl font-black text-white mt-4 font-mono">+$ {lastWin.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
              )}
          </div>

          {/* BOTTOM STREAMER OVERLAY (Social Elements) */}
          <div className="mt-auto flex gap-6 items-end">
              
              {/* CHAT BOX (TikTok Style) */}
              <div className="flex-1 max-w-sm h-[30vh] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10"></div>
                  <div className="flex flex-col-reverse h-full gap-2 overflow-y-auto no-scrollbar p-4">
                      {chat.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 animate-in slide-in-from-left duration-300">
                            <span className={`font-black italic text-[10px] uppercase shrink-0 ${m.color}`}>{m.user}:</span>
                            <span className="text-white text-[10px] font-bold leading-tight drop-shadow-md">{m.msg}</span>
                        </div>
                      ))}
                  </div>
              </div>

              {/* STREAM CONTROLS (Floating Right) */}
              <div className="flex flex-col gap-4 pb-4">
                  {[
                    { icon: <Heart size={24} />, count: clout, label: 'Clout', color: 'text-neon-red' },
                    { icon: <Share2 size={24} />, count: Math.floor(viewers / 10), label: 'Shares', color: 'text-white' },
                    { icon: <MessageSquare size={24} />, count: chat.length * 10, label: 'Chat', color: 'text-neon-blue' },
                  ].map((btn, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 group">
                        <button className="w-14 h-14 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform hover:bg-white/10">
                            {btn.icon}
                        </button>
                        <span className="text-[10px] font-black text-white font-mono">{btn.count.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="w-14 h-14 bg-fox-orange rounded-full flex items-center justify-center shadow-pop-orange animate-float border-2 border-white/20">
                      <div className="text-xl font-black">🦊</div>
                  </div>
              </div>
          </div>
      </div>

      {/* FLASH EFFECTS */}
      {hype > 80 && (
          <div className="absolute inset-0 pointer-events-none z-30 border-[20px] border-fox-orange/20 animate-pulse"></div>
      )}
      
    </div>
  );
};

export default VegasDegenerateGame;
