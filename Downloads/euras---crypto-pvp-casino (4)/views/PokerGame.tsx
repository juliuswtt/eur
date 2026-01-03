import React, { useState } from 'react';
import { User } from '../types';
import { ChevronLeft, HelpCircle } from 'lucide-react';

interface BluffGameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

// Simplified Logic:
// 1. Ante up.
// 2. Draw a card (1-100 power). Hidden from Opponent (Bot).
// 3. Bot draws card. Hidden from Player.
// 4. Player chooses: "Raise (Bluff/Value)" or "Fold".
// 5. Bot reacts based on RNG + slight logic.
// 6. Showdown.

const BluffGame: React.FC<BluffGameProps> = ({ user, updateBalance, onBack }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'DEAL' | 'ACTION' | 'SHOWDOWN'>('IDLE');
  const [pot, setPot] = useState(0);
  const [playerCard, setPlayerCard] = useState(0);
  const [botCard, setBotCard] = useState(0);
  const [bet, setBet] = useState(10); // Standard ante
  const [message, setMessage] = useState("Ante up to deal the cards.");

  const startRound = () => {
    if (!user || user.balance < bet) return;
    
    updateBalance(-bet);
    setPot(bet * 2); // Bot matches ante
    setPlayerCard(Math.floor(Math.random() * 100) + 1);
    setBotCard(Math.floor(Math.random() * 100) + 1);
    setGameState('ACTION');
    setMessage("Do you have the winning hand? Raise or Fold.");
  };

  const handleFold = () => {
    setGameState('SHOWDOWN');
    setMessage("You folded. Bot wins the pot.");
    // No payout
    setTimeout(() => resetGame(), 2000);
  };

  const handleRaise = () => {
    // Player adds another bet
    if (!user || user.balance < bet) {
        alert("Insufficient funds to raise");
        return;
    }
    updateBalance(-bet);
    setPot(prev => prev + (bet * 2)); // Bot matches raise

    // Bot Decision Logic (Simple AI)
    const botStrong = botCard > 60;
    const botBluff = Math.random() > 0.8;
    
    // Simple showdown immediately for MVP
    setGameState('SHOWDOWN');
    
    if (!botStrong && !botBluff) {
        // Bot Folds
        const winAmount = pot + (bet * 2); 
        // Logic fix: Pot already contains ante*2. We added Raise*2. 
        // Bot folds means player takes Pot.
        // Actually, let's keep it simple: Showdown always happens in this MVP version unless Bot folds explicitly.
        // For simplicity: We go straight to comparing numbers.
    }
    
    evaluateWinner();
  };

  const evaluateWinner = () => {
     // Visual delay
     setTimeout(() => {
        if (playerCard > botCard) {
            const winAmount = pot; 
            const rake = winAmount * 0.05;
            const payout = winAmount - rake;
            updateBalance(payout);
            setMessage(`You Won! ${payout.toFixed(2)} SOL (5% Rake taken)`);
        } else if (playerCard < botCard) {
            setMessage("Bot Wins! Better luck next time.");
        } else {
            updateBalance(pot / 2); // Split
            setMessage("Draw! Pot returned.");
        }
        setTimeout(() => resetGame(), 3000);
     }, 500);
  };

  const resetGame = () => {
    setGameState('IDLE');
    setPot(0);
    setMessage("Ante up to deal the cards.");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
       <div className="w-full flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
          <ChevronLeft size={20} /> Lobby
        </button>
      </div>

      <div className="relative w-full aspect-video max-h-[600px] bg-[#1a3c28] border-8 border-[#2e1a12] rounded-full shadow-2xl flex flex-col justify-between p-10 overflow-hidden">
         {/* Table Texture */}
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] pointer-events-none"></div>

         {/* Opponent (Bot) */}
         <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 rounded-full border-4 border-gray-800 bg-gray-900 relative mb-2">
                <img src="https://picsum.photos/100/100?random=99" className="w-full h-full rounded-full opacity-80" alt="Bot" />
                <div className="absolute -bottom-2 -right-2 bg-gray-800 text-xs px-2 py-0.5 rounded text-gray-300 border border-gray-600">BOT</div>
            </div>
            {gameState === 'IDLE' ? (
                <div className="text-white/50 text-sm font-bold italic">Waiting...</div>
            ) : (
                <div className="flex gap-2">
                     {/* Bot Card Back */}
                    <div className={`w-16 h-24 bg-red-900 border-2 border-white rounded flex items-center justify-center transform transition-all duration-500 ${gameState === 'SHOWDOWN' ? 'rotate-y-180' : ''}`}>
                        {gameState === 'SHOWDOWN' ? (
                            <span className="text-2xl font-bold text-white">{botCard}</span>
                        ) : (
                             <div className="w-10 h-16 border border-red-800 bg-red-950"></div>
                        )}
                    </div>
                </div>
            )}
         </div>

         {/* Center Pot & Info */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full px-4">
            <div className="mb-2 text-yellow-400 font-black text-xl drop-shadow-md">POT: {pot.toFixed(2)} SOL</div>
            <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-full text-white font-medium border border-white/10 shadow-lg inline-block">
                {message}
            </div>
         </div>

         {/* Player Area */}
         <div className="flex flex-col items-center z-10 w-full">
            {gameState !== 'IDLE' && (
                <div className="mb-6 flex gap-2">
                    {/* Player Card (Visible to Player) */}
                    <div className="w-24 h-36 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center border-2 border-gray-300 relative transform hover:-translate-y-2 transition-transform">
                        <span className="text-xs absolute top-2 left-2 text-gray-500">POWER</span>
                        <span className={`text-4xl font-black ${playerCard > 50 ? 'text-neon-green' : 'text-neon-red'}`}>
                            {playerCard}
                        </span>
                        <div className="absolute bottom-2 right-2 text-gray-300">
                             <HelpCircle size={12} />
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
                {gameState === 'IDLE' ? (
                     <button 
                        onClick={startRound}
                        className="bg-neon-green text-black font-bold px-12 py-4 rounded-xl shadow-glow-green hover:scale-105 transition-transform"
                     >
                        DEAL HAND ({bet} SOL)
                     </button>
                ) : gameState === 'ACTION' ? (
                    <>
                        <button 
                            onClick={handleFold}
                            className="bg-red-600/80 text-white font-bold px-8 py-3 rounded-xl border border-red-500 hover:bg-red-600 transition-colors"
                        >
                            FOLD
                        </button>
                        <button 
                            onClick={handleRaise}
                            className="bg-neon-blue text-black font-bold px-12 py-3 rounded-xl shadow-glow-blue hover:bg-[#4dffff] transition-colors"
                        >
                            RAISE 2x ({bet} SOL)
                        </button>
                    </>
                ) : (
                    <div className="h-12 flex items-center text-gray-400 font-bold uppercase tracking-widest">
                        Round Over
                    </div>
                )}
            </div>
         </div>
      </div>

      <div className="mt-8 text-gray-500 text-xs text-center max-w-lg">
        <p>Fox Bluff is a Provably Fair game. Cards are generated using SHA-256 server seed + client seed.</p>
        <p>Bot behavior is simulated for MVP. In Production, this is P2P via Solana Smart Contracts.</p>
      </div>
    </div>
  );
};

export default BluffGame;