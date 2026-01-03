
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { ChevronLeft, Layers, UserCircle, Trophy, Loader2, Zap, AlertCircle, Timer, Skull } from 'lucide-react';

interface Card {
  suit: 'heart' | 'diamond' | 'club' | 'spade';
  rank: string;
  id: string;
}

interface GameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

const TURN_TIMEOUT = 10;

const MauMauGame: React.FC<GameProps> = ({ user, updateBalance, onBack }) => {
  const [gameState, setGameState] = useState<'WAGER' | 'MATCHMAKING' | 'PLAYING' | 'RESULT' | 'TIMEOUT'>('WAGER');
  const [wager, setWager] = useState('1.0');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [botHand, setBotHand] = useState<Card[]>([]);
  const [topCard, setTopCard] = useState<Card | null>(null);
  const [turn, setTurn] = useState(0); 
  const [drawPenalty, setDrawPenalty] = useState(0);
  const [wishedSuit, setWishedSuit] = useState<Card['suit'] | null>(null);
  const [message, setMessage] = useState('Match starting...');
  const [showSuitPicker, setShowSuitPicker] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_TIMEOUT);

  const suits: Card['suit'][] = ['heart', 'diamond', 'club', 'spade'];
  const ranks = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const createCard = useCallback((): Card => ({
    suit: suits[Math.floor(Math.random() * 4)],
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    id: Math.random().toString(36).substr(2, 9)
  }), []);

  useEffect(() => {
    if (gameState === 'PLAYING' && turn === 0) {
        if (timeLeft <= 0) {
            setGameState('TIMEOUT');
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }
  }, [timeLeft, gameState, turn]);

  const handleStartMatch = () => {
    if (!user) return;
    updateBalance(-parseFloat(wager));
    setGameState('MATCHMAKING');
    setTimeout(() => {
      setPlayerHand(Array.from({ length: 5 }, createCard));
      setBotHand(Array.from({ length: 5 }, createCard));
      setTopCard(createCard());
      setGameState('PLAYING');
      setTurn(0);
      setTimeLeft(TURN_TIMEOUT);
    }, 1500);
  };

  const checkValidMove = (card: Card) => {
    if (!topCard) return false;
    if (card.rank === 'J') return true;
    if (wishedSuit) return card.suit === wishedSuit;
    return card.suit === topCard.suit || card.rank === topCard.rank;
  };

  const playCard = (index: number) => {
    if (turn !== 0 || showSuitPicker || gameState !== 'PLAYING') return;
    const card = playerHand[index];
    if (checkValidMove(card)) {
      const newHand = playerHand.filter((_, i) => i !== index);
      processCardEffect(card, newHand, 0);
    }
  };

  const processCardEffect = (card: Card, newHand: Card[], pIdx: number) => {
    setTopCard(card);
    setWishedSuit(null);
    if (pIdx === 0) setPlayerHand(newHand);
    else setBotHand(newHand);
    
    if (newHand.length === 0) {
      setGameState('RESULT');
      if (pIdx === 0) updateBalance(parseFloat(wager) * 1.9);
      return;
    }

    let nextTurn = pIdx === 0 ? 1 : 0;
    if (card.rank === '7') setDrawPenalty(prev => prev + 2);
    else if (card.rank === '8') nextTurn = pIdx;
    else if (card.rank === 'A') nextTurn = pIdx;
    else if (card.rank === 'J') {
      if (pIdx === 0) { setShowSuitPicker(true); return; }
      else setWishedSuit(suits[Math.floor(Math.random() * 4)]);
    }
    setTurn(nextTurn);
    setTimeLeft(TURN_TIMEOUT);
  };

  const drawCard = () => {
    if (turn !== 0 || gameState !== 'PLAYING') return;
    const penalty = drawPenalty || 1;
    setPlayerHand([...playerHand, ...Array.from({ length: penalty }, createCard)]);
    setDrawPenalty(0);
    setTurn(1);
    setTimeLeft(TURN_TIMEOUT);
  };

  useEffect(() => {
    if (gameState === 'PLAYING' && turn === 1) {
      const timer = setTimeout(() => {
        const playableIndex = botHand.findIndex(checkValidMove);
        if (playableIndex !== -1) processCardEffect(botHand[playableIndex], botHand.filter((_, i) => i !== playableIndex), 1);
        else {
          setBotHand([...botHand, ...Array.from({ length: drawPenalty || 1 }, createCard)]);
          setDrawPenalty(0);
          setTurn(0);
          setTimeLeft(TURN_TIMEOUT);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameState, botHand, topCard, drawPenalty, wishedSuit]);

  if (gameState === 'WAGER') {
    return (
      <div className="max-w-md mx-auto bg-card-bg border-4 border-gray-800 rounded-[3rem] p-8 text-center mt-10 shadow-card-depth animate-in zoom-in">
        <Layers size={64} className="text-neon-blue mx-auto mb-6" />
        <h2 className="text-4xl font-black italic text-white uppercase mb-2 leading-none">MAU MAU</h2>
        <div className="bg-slate-950 p-6 rounded-3xl border-2 border-gray-800 mb-8 text-left">
           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Buy-In (SOL)</label>
           <input type="number" value={wager} onChange={e => setWager(e.target.value)} className="w-full bg-transparent border-none text-white text-3xl font-black focus:outline-none" />
        </div>
        <button onClick={handleStartMatch} className="w-full bg-neon-blue text-white py-6 rounded-3xl font-black text-xl shadow-pop-blue btn-tactile uppercase italic">FIND TABLE</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-4 relative">
      <div className="flex justify-between items-center px-4">
        <button onClick={onBack} className="text-gray-500 bg-white/5 p-3 rounded-2xl"><ChevronLeft size={24}/></button>
        <div className={`bg-slate-900 border-2 px-4 py-2 rounded-xl flex items-center gap-3 transition-all ${timeLeft < 4 ? 'border-neon-red animate-pulse' : 'border-gray-800'}`}>
            <Timer size={16} className={timeLeft < 4 ? 'text-neon-red' : 'text-gray-400'} />
            <span className={`font-mono font-black text-lg ${timeLeft < 4 ? 'text-neon-red' : 'text-white'}`}>{timeLeft}s</span>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col justify-between items-center py-6 bg-slate-950 rounded-[50px] border-8 border-gray-900 shadow-2xl overflow-hidden">
         <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border-2 ${turn === 1 ? 'border-neon-blue' : 'border-transparent opacity-50'}`}><UserCircle size={20} className="text-neon-blue" /></div>
            <div className="flex gap-1">{botHand.map((_, i) => <div key={i} className="w-6 h-10 bg-fox-orange rounded-md border border-white/10"></div>)}</div>
         </div>

         <div className="flex gap-12 items-center">
            <button onClick={drawCard} disabled={turn !== 0} className={`w-20 h-32 bg-fox-orange rounded-2xl border-4 border-white/20 flex flex-col items-center justify-center shadow-2xl transition-all ${turn === 0 ? 'hover:scale-105 cursor-pointer' : 'opacity-50'}`}><Layers size={24} className="text-white/40 mb-1" /><span className="text-white font-black text-[8px] uppercase">DRAW</span></button>
            <div className={`w-20 h-32 bg-white rounded-2xl border-4 flex flex-col items-center justify-center shadow-2xl relative ${topCard?.suit === 'heart' || topCard?.suit === 'diamond' ? 'text-neon-red border-red-100' : 'text-slate-900 border-slate-100'}`}>
                <div className="text-3xl font-black">{topCard?.rank}</div>
                <div className="text-xl">{topCard?.suit === 'heart' ? '♥' : topCard?.suit === 'diamond' ? '♦' : topCard?.suit === 'club' ? '♣' : '♠'}</div>
                {wishedSuit && <div className="absolute -top-3 -right-3 bg-neon-blue text-white px-2 py-1 rounded-full text-[8px] font-black shadow-lg animate-bounce">{wishedSuit.toUpperCase()}</div>}
            </div>
         </div>

         <div className="w-full flex flex-col items-center gap-4 px-4">
            <div className="flex flex-wrap justify-center gap-1.5">
                {playerHand.map((card, i) => {
                    const canPlay = turn === 0 && checkValidMove(card);
                    return (
                        <button key={card.id} onClick={() => playCard(i)} disabled={turn !== 0 || !canPlay} className={`w-14 h-22 bg-white rounded-xl border-4 flex flex-col items-center justify-center shadow-xl transition-all ${canPlay ? 'hover:-translate-y-4 border-neon-blue scale-105 z-10' : 'border-slate-200 opacity-50'} ${card.suit === 'heart' || card.suit === 'diamond' ? 'text-neon-red' : 'text-slate-900'}`}>
                            <div className="text-xl font-black">{card.rank}</div>
                            <div className="text-lg">{card.suit === 'heart' ? '♥' : card.suit === 'diamond' ? '♦' : card.suit === 'club' ? '♣' : '♠'}</div>
                        </button>
                    );
                })}
            </div>
         </div>

         {showSuitPicker && (
             <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6">
                <h3 className="text-2xl font-black text-white uppercase mb-8 italic">Choose Suit</h3>
                <div className="grid grid-cols-2 gap-4">
                    {suits.map(s => <button key={s} onClick={() => { setWishedSuit(s); setShowSuitPicker(false); setTurn(1); setTimeLeft(TURN_TIMEOUT); }} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform"><span className={s === 'heart' || s === 'diamond' ? 'text-neon-red' : 'text-black'}>{s === 'heart' ? '♥' : s === 'diamond' ? '♦' : s === 'club' ? '♣' : '♠'}</span></button>)}
                </div>
             </div>
         )}
      </div>

      {(gameState === 'RESULT' || gameState === 'TIMEOUT') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in zoom-in">
             <div className="bg-card-bg border-4 border-gray-800 rounded-[3rem] p-10 text-center shadow-2xl">
                {gameState === 'RESULT' ? (
                    <>
                        <Trophy size={80} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
                        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-2">VICTORY</h2>
                        <div className="text-4xl font-mono font-black text-neon-green mb-8 italic animate-pulse">+ {(parseFloat(wager) * 1.9).toFixed(2)} SOL</div>
                    </>
                ) : (
                    <>
                        <Skull size={80} className="text-neon-red mx-auto mb-6 animate-shake" />
                        <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-2 leading-none">TIME OUT</h2>
                        <p className="text-gray-500 font-bold uppercase tracking-widest mb-10 italic">Wager was liquidated.</p>
                    </>
                )}
                <button onClick={onBack} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic btn-tactile">LOBBY</button>
             </div>
        </div>
      )}
    </div>
  );
};

export default MauMauGame;
