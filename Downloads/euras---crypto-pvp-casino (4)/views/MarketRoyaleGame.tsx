
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { SOL_PRICE } from '../constants';
import { triggerMasterPayout } from '../services/solana';
import { ChevronLeft, TrendingUp, TrendingDown, Skull, Crown, Loader2, Zap, BarChart3, Activity, FlaskConical, CheckCircle2 } from 'lucide-react';

interface GameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

type PlayerStatus = 'ALIVE' | 'DEAD' | 'WINNER';
type Vote = 'UP' | 'DOWN' | null;

interface Player {
  id: string;
  name: string;
  avatar: string;
  status: PlayerStatus;
  lastVote: Vote;
  isBot: boolean;
}

const TOTAL_PLAYERS = 10;
const ENTRY_FEE = 1.0;
const ROUND_TIME = 5;

const MarketRoyaleGame: React.FC<GameProps> = ({ user, updateBalance, onBack }) => {
  const [stage, setStage] = useState<'WAGER' | 'LOBBY' | 'GAME' | 'RESULT'>('WAGER');
  const [players, setPlayers] = useState<Player[]>([]);
  const [timer, setTimer] = useState(ROUND_TIME);
  const [round, setRound] = useState(1);
  const [chartData, setChartData] = useState<number[]>([122.56, 123.10, 122.80, 123.50, 123.20, 124.10, 123.90, 124.50]);
  const [userVote, setUserVote] = useState<Vote>(null);
  const [marketStatus, setMarketStatus] = useState<'OPEN' | 'LOCKED' | 'MOVING'>('OPEN');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutDone, setPayoutDone] = useState(false);

  const [testMode, setTestMode] = useState({ active: false, forceWin: true, winAmount: 5.7 });
  const [showTestConfig, setShowTestConfig] = useState(false);
  const [testModeInitialized, setTestModeInitialized] = useState(false);

  const startGame = () => {
    const bots = Array.from({length: 9}).map((_, i) => ({
      id: `bot_${i}`,
      name: `B${i+1}`,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=bot${i}`,
      status: 'ALIVE' as PlayerStatus,
      lastVote: null,
      isBot: true
    }));
    const human: Player = { id: user!.id, name: user!.username.substring(0, 5), avatar: user!.avatar, status: 'ALIVE', lastVote: null, isBot: false };
    setPlayers([human, ...bots]);
    setStage('GAME');
    startRound();
  };

  const startRound = () => {
    setMarketStatus('OPEN');
    setUserVote(null);
    setTimer(ROUND_TIME);
    setPlayers(prev => prev.map(p => ({ ...p, lastVote: null })));
  };

  useEffect(() => {
    if (stage === 'GAME' && marketStatus === 'OPEN') {
      if (timer > 0) {
        const t = setTimeout(() => setTimer(timer - 1), 1000);
        return () => clearTimeout(t);
      } else resolveRound();
    }
  }, [timer, stage, marketStatus]);

  const resolveRound = () => {
    setMarketStatus('LOCKED');
    const updatedPlayers = players.map(p => {
      if (p.status === 'DEAD') return p;
      return { ...p, lastVote: p.isBot ? (Math.random() > 0.5 ? 'UP' : 'DOWN' as Vote) : userVote };
    });
    setPlayers(updatedPlayers);

    setTimeout(() => {
        setMarketStatus('MOVING');
        let isPump = Math.random() > 0.5;
        if (testMode.active && testMode.forceWin && userVote) isPump = userVote === 'UP';

        const newPrice = chartData[chartData.length - 1] + (isPump ? 0.85 : -0.85);
        setChartData(prev => [...prev.slice(-15), newPrice]);

        setTimeout(() => {
            const resPlayers = updatedPlayers.map(p => {
                if (p.status === 'DEAD') return p;
                const correct = (isPump && p.lastVote === 'UP') || (!isPump && p.lastVote === 'DOWN');
                return correct ? p : { ...p, status: 'DEAD' as PlayerStatus };
            });
            setPlayers(resPlayers);
            const survivors = resPlayers.filter(p => p.status === 'ALIVE');
            
            if (survivors.length <= 1 || (testMode.active && testMode.forceWin)) {
               if (testMode.active && testMode.forceWin) {
                  setPlayers(resPlayers.map(p => p.id === user?.id ? { ...p, status: 'ALIVE' } : { ...p, status: 'DEAD' }));
               }
               setStage('RESULT');
            }
            else { setRound(r => r + 1); setTimeout(() => startRound(), 1500); }
        }, 1200);
    }, 800);
  };

  const handleClaimWin = async () => {
    if (!user || isProcessingPayout) return;
    setIsProcessingPayout(true);
    
    const winAmt = testMode.active ? testMode.winAmount : (ENTRY_FEE * TOTAL_PLAYERS * 0.95);
    
    // AUTOMATISIERTER CALL AN DEN MASTER-VAULT
    const result: any = await triggerMasterPayout(user.activeWallet, winAmt);
    
    if (result.success) {
        updateBalance(winAmt);
        setPayoutDone(true);
    } else {
        alert("Euras Bank Error. Please contact support.");
    }
    setIsProcessingPayout(false);
  };

  const renderChart = () => {
    const height = 150;
    const width = 400;
    const min = Math.min(...chartData) - 1;
    const max = Math.max(...chartData) + 1;
    const points = chartData.map((val, i) => `${(i / (chartData.length - 1)) * width},${height - ((val - min) / (max - min)) * height}`).join(' ');
    const isGreen = chartData[chartData.length-1] >= chartData[chartData.length-2];

    return (
        <div className="relative w-full h-32 md:h-72 bg-[#020617] rounded-3xl border-2 border-slate-800 overflow-hidden flex-shrink-0">
             <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full p-2 md:p-8" preserveAspectRatio="none">
                <polyline fill="none" stroke={isGreen ? '#10b981' : '#f43f5e'} strokeWidth="4" points={points} className="transition-all duration-700 ease-in-out" />
             </svg>
             <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-lg font-mono font-black border ${isGreen ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' : 'bg-rose-950/80 border-rose-500 text-rose-400'}`}>
                ${chartData[chartData.length-1].toFixed(2)}
             </div>
        </div>
    );
  };

  if (stage === 'WAGER') {
    return (
        <div className="max-w-md mx-auto bg-card-bg border-4 border-gray-800 rounded-[3rem] p-12 text-center mt-6 shadow-card-depth">
          <h2 className="text-5xl font-black italic mb-2 text-white uppercase tracking-tighter">Market Royale</h2>
          <div className="bg-slate-950 p-6 rounded-[2rem] border-2 border-gray-800 mb-8 text-left">
             <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Buy-In</div>
             <div className="text-3xl font-black text-white font-mono leading-none">{ENTRY_FEE} SOL</div>
          </div>
          <button onClick={() => { if(!user) return; updateBalance(-ENTRY_FEE); setStage('LOBBY'); setTimeout(() => startGame(), 1500); }} className="w-full bg-fox-orange text-white font-black py-5 rounded-2xl shadow-pop-orange btn-tactile text-xl italic uppercase tracking-tighter">CONNECT</button>
          {!testModeInitialized && (
            <button onClick={() => setShowTestConfig(true)} className="mt-4 w-full bg-slate-800 text-gray-500 font-black py-3 rounded-xl border border-slate-700 text-[10px] uppercase tracking-widest">
                <FlaskConical size={14} className="inline mr-2"/> TESTMODE CONFIG
            </button>
          )}
          {showTestConfig && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <div className="bg-card-bg border-2 border-brand-purple rounded-[2.5rem] p-8 w-full max-w-sm">
                    <h3 className="text-xl font-black text-white uppercase mb-6">Set Win Amount</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {[5.7, 14.2, 52.1].map(amt => (
                            <button key={amt} onClick={() => setTestMode({...testMode, winAmount: amt})} className={`py-2 rounded-lg text-[10px] font-black ${testMode.winAmount === amt ? 'bg-brand-purple text-white' : 'bg-slate-800 text-gray-600'}`}>{amt}</button>
                        ))}
                    </div>
                    <button onClick={() => { setTestMode({...testMode, active: true}); setTestModeInitialized(true); setShowTestConfig(false); }} className="w-full bg-brand-purple text-white font-black py-4 rounded-xl uppercase italic">INITIALIZE</button>
                </div>
            </div>
          )}
        </div>
    );
  }

  if (stage === 'LOBBY') return <div className="flex flex-col items-center justify-center h-[60vh]"><Loader2 size={64} className="text-fox-orange animate-spin mb-6" /><h3 className="text-2xl font-black text-white uppercase italic">Syncing...</h3></div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full gap-4 pb-12">
       <div className="flex justify-between items-center px-4">
          <button onClick={onBack} className="text-gray-500 bg-white/5 p-2 rounded-xl"><ChevronLeft size={18}/></button>
          <div className="flex gap-1">
             {players.map(p => <div key={p.id} className={`w-10 h-10 rounded-lg border-2 ${p.id === user?.id ? 'border-neon-blue' : 'border-slate-800'} ${p.status === 'DEAD' ? 'opacity-20 grayscale' : ''} overflow-hidden`}><img src={p.avatar} alt="P" className="w-full h-full" /></div>)}
          </div>
       </div>

       <div className="bg-[#0f172a] rounded-[2.5rem] p-10 border-4 border-slate-800 shadow-2xl flex flex-col gap-8 flex-1 relative overflow-hidden">
           <div className="flex justify-between items-center z-10">
               <span className="text-sm font-black text-white italic uppercase">ROUND {round}</span>
               <div className="text-6xl font-mono font-black text-neon-blue">{timer}s</div>
           </div>

           {renderChart()}

           {stage === 'RESULT' ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500 z-20">
                  <h2 className="text-7xl font-black text-white italic uppercase mb-2">VICTORIOUS</h2>
                  <div className="text-5xl font-black text-neon-green font-mono mb-12">
                     + {testMode.active ? testMode.winAmount.toFixed(2) : (ENTRY_FEE * TOTAL_PLAYERS * 0.95).toFixed(1)} SOL
                  </div>
                  
                  {payoutDone ? (
                      <div className="flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4">
                          <div className="flex items-center gap-3 bg-neon-green/20 text-neon-green px-8 py-4 rounded-2xl border border-neon-green/30 font-black uppercase italic tracking-tighter">
                             <CheckCircle2 size={24} /> Payout Confirmed by Bank
                          </div>
                          <button onClick={onBack} className="text-gray-500 font-black uppercase text-xs hover:text-white transition-colors">Return to Lobby</button>
                      </div>
                  ) : (
                      <button 
                        onClick={handleClaimWin}
                        disabled={isProcessingPayout}
                        className="bg-white text-black font-black px-16 py-6 rounded-[2rem] shadow-2xl uppercase text-xl btn-tactile italic flex items-center gap-4"
                      >
                        {isProcessingPayout ? <><Loader2 className="animate-spin" /> AUTHORIZING...</> : 'WITHDRAW WINNINGS'}
                      </button>
                  )}
              </div>
           ) : (
              <div className={`grid grid-cols-2 gap-6 z-10 ${marketStatus !== 'OPEN' ? 'opacity-30 pointer-events-none' : ''}`}>
                  <button onClick={() => setUserVote('UP')} className={`py-12 rounded-3xl flex flex-col items-center border-4 transition-all ${userVote === 'UP' ? 'bg-neon-green border-white scale-95 shadow-xl' : 'bg-emerald-950/40 text-emerald-500 border-emerald-900/30'}`}><TrendingUp size={64} className="mb-2" /><span className="text-3xl font-black italic uppercase">LONG</span></button>
                  <button onClick={() => setUserVote('DOWN')} className={`py-12 rounded-3xl flex flex-col items-center border-4 transition-all ${userVote === 'DOWN' ? 'bg-neon-red border-white scale-95 shadow-xl' : 'bg-rose-950/40 text-rose-500 border-rose-900/30'}`}><TrendingDown size={64} className="mb-2" /><span className="text-3xl font-black italic uppercase">SHORT</span></button>
              </div>
           )}
       </div>
    </div>
  );
};

export default MarketRoyaleGame;
