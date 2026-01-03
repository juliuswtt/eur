import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { ChevronLeft, RefreshCcw, Settings, Volume2 } from 'lucide-react';

interface DiceGameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

const DiceGame: React.FC<DiceGameProps> = ({ user, updateBalance, onBack }) => {
  const [betAmount, setBetAmount] = useState<string>('1.00');
  const [winChance, setWinChance] = useState<number>(50);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [rollHistory, setRollHistory] = useState<{roll: number, win: boolean}[]>([]);
  const [notification, setNotification] = useState<{msg: string, type: 'win'|'loss'} | null>(null);

  // Sound simulation ref (visual feedback for now)
  const containerRef = useRef<HTMLDivElement>(null);

  const multiplier = (99 / winChance).toFixed(4);
  const potentialProfit = (parseFloat(betAmount) * parseFloat(multiplier) * 0.95).toFixed(2); // 5% Rake implied in profit calc for display, realistically handled on payout

  const handleRoll = () => {
    if (!user) {
      alert("Connect wallet to play!");
      return;
    }
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0 || bet > user.balance) return;

    // Deduct bet immediately
    updateBalance(-bet);
    setIsRolling(true);
    setNotification(null);

    // Simulate Network/RNG Delay
    setTimeout(() => {
      const roll = Math.random() * 100;
      const finalRoll = parseFloat(roll.toFixed(2));
      const isWin = finalRoll < winChance;

      setLastRoll(finalRoll);
      setIsRolling(false);

      if (isWin) {
        const payout = bet * parseFloat(multiplier);
        const netWin = payout; // Balance was already deducted
        updateBalance(netWin);
        setNotification({ msg: `+${(netWin - bet).toFixed(2)} SOL`, type: 'win' });
        
        // Trigger shake effect
        if (containerRef.current) {
          containerRef.current.classList.add('animate-pulse-fast');
          setTimeout(() => containerRef.current?.classList.remove('animate-pulse-fast'), 500);
        }
      } else {
        setNotification({ msg: `-${bet.toFixed(2)} SOL`, type: 'loss' });
        // Trigger shake effect
        if (containerRef.current) {
           containerRef.current.classList.add('animate-shake');
           setTimeout(() => containerRef.current?.classList.remove('animate-shake'), 500);
        }
      }

      setRollHistory(prev => [{ roll: finalRoll, win: isWin }, ...prev].slice(0, 10));
    }, 600);
  };

  const setMax = () => {
    if(user) setBetAmount(Math.floor(user.balance).toString());
  };

  return (
    <div className="max-w-4xl mx-auto" ref={containerRef}>
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ChevronLeft size={20} /> Lobby
        </button>
        <div className="flex gap-4">
           <button className="text-gray-500 hover:text-white"><Volume2 size={20} /></button>
           <button className="text-gray-500 hover:text-white"><Settings size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Controls Panel */}
        <div className="md:col-span-4 bg-card-bg border border-gray-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Bet Amount (SOL)</label>
            <div className="relative">
              <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-deep-black border border-gray-700 rounded-lg py-3 px-4 text-white font-mono focus:border-neon-blue focus:outline-none transition-colors"
              />
              <button 
                onClick={setMax}
                className="absolute right-2 top-2 bg-gray-800 text-xs font-bold text-gray-400 hover:text-white px-2 py-1.5 rounded"
              >
                MAX
              </button>
            </div>
             <div className="grid grid-cols-4 gap-2 mt-2">
                {[0.1, 0.5, 1.0, 2.0].map(val => (
                   <button key={val} onClick={() => setBetAmount(val.toString())} className="bg-gray-800/50 hover:bg-gray-800 text-xs py-1 rounded text-gray-400 transition-colors">{val}</button>
                ))}
             </div>
          </div>

          <div>
             <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
               <span>Profit on Win</span>
               <span>Chance: {winChance}%</span>
             </div>
             <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-center">
                <span className="text-neon-green font-mono font-bold text-xl">{potentialProfit} SOL</span>
             </div>
          </div>

          <button 
            onClick={handleRoll}
            disabled={isRolling}
            className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all transform active:scale-95 ${
              isRolling 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-neon-blue text-black shadow-glow-blue hover:bg-[#4dffff]'
            }`}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>

        {/* Game Visual Area */}
        <div className="md:col-span-8 bg-card-bg border border-gray-800 rounded-2xl p-6 relative flex flex-col justify-center min-h-[400px]">
          
          {/* Result Overlay */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
            <div className="flex gap-1 overflow-hidden h-8">
              {rollHistory.map((h, i) => (
                <div key={i} className={`w-1.5 h-full rounded-full ${h.win ? 'bg-neon-green' : 'bg-gray-700'}`}></div>
              ))}
            </div>
            {notification && (
              <div className={`animate-bounce font-black text-2xl ${notification.type === 'win' ? 'text-neon-green' : 'text-neon-red'}`}>
                {notification.msg}
              </div>
            )}
          </div>

          {/* Large Result Display */}
          <div className="text-center mb-12 relative">
             <div className="text-[100px] md:text-[140px] font-black leading-none font-mono text-white drop-shadow-2xl transition-all">
               {lastRoll !== null ? lastRoll.toFixed(2) : '00.00'}
             </div>
             {lastRoll !== null && (
               <div className={`text-2xl font-bold uppercase ${lastRoll < winChance ? 'text-neon-green' : 'text-neon-red'}`}>
                 {lastRoll < winChance ? 'WINNER' : 'BUST'}
               </div>
             )}
          </div>

          {/* Slider UI */}
          <div className="px-4">
             <div className="relative h-4 bg-gray-800 rounded-full mb-8 select-none">
                {/* Winning Zone */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-neon-green rounded-l-full opacity-50 transition-all duration-200"
                  style={{ width: `${winChance}%` }}
                ></div>
                
                {/* Result Marker */}
                {lastRoll !== null && (
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-white z-20 shadow-[0_0_10px_white] transition-all duration-500 ease-out"
                    style={{ left: `${lastRoll}%` }}
                  ></div>
                )}

                {/* Slider Thumb (Interactive) */}
                <input 
                  type="range" 
                  min="1" 
                  max="98" 
                  value={winChance} 
                  onChange={(e) => setWinChance(parseInt(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                />
                
                {/* Thumb Visual */}
                <div 
                   className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-none transition-all duration-200"
                   style={{ left: `calc(${winChance}% - 16px)` }}
                >
                   <RefreshCcw size={14} className="text-black" />
                </div>
             </div>
             
             <div className="flex justify-between text-gray-500 font-mono text-sm">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiceGame;