
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { SOL_PRICE } from '../constants';
import { ChevronLeft, Spade, Heart, Club, Diamond, Loader2, Coins, UserCircle, Trophy, FlaskConical } from 'lucide-react';

interface GameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

type GameStage = 'WAGER' | 'MATCHMAKING' | 'PREFLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN';

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

const createDeck = (): Card[] => {
  let deck: Card[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach((rank, index) => {
      deck.push({ suit, rank, value: index + 2 });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const evaluateHand = (cards: Card[]): { rank: number, name: string } => {
  if (cards.length < 5) return { rank: 0, name: 'Incomplete' };
  const sorted = [...cards].sort((a, b) => b.value - a.value);
  const values = sorted.map(c => c.value);
  const suits = sorted.map(c => c.suit);
  const valueCounts: { [key: number]: number } = {};
  values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
  const counts = Object.values(valueCounts).sort((a, b) => b - a);
  const isFlush = SUITS.some(s => suits.filter(suit => suit === s).length >= 5);
  let isStraight = false;
  const uniqueValues = Array.from(new Set(values)).sort((a, b) => b - a);
  for (let i = 0; i <= uniqueValues.length - 5; i++) {
    if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
      isStraight = true;
      break;
    }
  }
  if (isFlush && isStraight) return { rank: 8, name: 'Straight Flush' };
  if (counts[0] === 4) return { rank: 7, name: 'Four of a Kind' };
  if (counts[0] === 3 && counts[1] >= 2) return { rank: 6, name: 'Full House' };
  if (isFlush) return { rank: 5, name: 'Flush' };
  if (isStraight) return { rank: 4, name: 'Straight' };
  if (counts[0] === 3) return { rank: 3, name: 'Three of a Kind' };
  if (counts[0] === 2 && counts[1] === 2) return { rank: 2, name: 'Two Pair' };
  if (counts[0] === 2) return { rank: 1, name: 'One Pair' };
  return { rank: 0, name: 'High Card' };
};

const CardView: React.FC<{ card: Card | null; hidden?: boolean; isMobile?: boolean }> = ({ card, hidden, isMobile }) => {
  if (hidden || !card) {
    return (
      <div className={`${isMobile ? 'w-10 h-14' : 'w-14 h-20 md:w-24 md:h-32'} bg-fox-orange rounded-lg md:rounded-xl border-2 md:border-4 border-amber-300 flex items-center justify-center shadow-lg md:shadow-2xl`}>
        <div className="text-white font-black text-lg md:text-3xl italic">🐕</div>
      </div>
    );
  }
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const Icon = card.suit === 'spades' ? Spade : card.suit === 'hearts' ? Heart : card.suit === 'clubs' ? Club : Diamond;
  return (
    <div className={`${isMobile ? 'w-10 h-14 p-1' : 'w-14 h-20 md:w-24 md:h-32 p-3'} bg-white rounded-lg md:rounded-xl flex flex-col items-center justify-between shadow-lg md:shadow-2xl border border-gray-100`}>
      <div className={`${isMobile ? 'text-[9px]' : 'text-sm md:text-xl'} font-black self-start ${isRed ? 'text-neon-red' : 'text-slate-900'}`}>{card.rank}</div>
      <Icon className={`${isMobile ? 'w-4 h-4' : 'w-8 h-8 md:w-14 md:h-14'} ${isRed ? 'text-neon-red' : 'text-slate-900'}`} fill={isRed ? 'currentColor' : 'black'} />
      <div className={`${isMobile ? 'text-[9px]' : 'text-sm md:text-xl'} font-black self-end rotate-180 ${isRed ? 'text-neon-red' : 'text-slate-900'}`}>{card.rank}</div>
    </div>
  );
};

const TexasHoldemGame: React.FC<GameProps> = ({ user, updateBalance, onBack }) => {
  const [stage, setStage] = useState<GameStage>('WAGER');
  const [wager, setWager] = useState('1.0');
  const [pot, setPot] = useState(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [botHand, setBotHand] = useState<Card[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [message, setMessage] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [handNames, setHandNames] = useState({ player: '', bot: '' });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [testMode, setTestMode] = useState({ active: false, forceWin: true, winAmount: 25.4 });
  const [showTestConfig, setShowTestConfig] = useState(false);
  const [testModeInitialized, setTestModeInitialized] = useState(false);

  const initializeGame = () => {
    const bet = parseFloat(wager);
    const newDeck = createDeck();
    setDeck(newDeck);
    setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
    setBotHand([newDeck.pop()!, newDeck.pop()!]);
    setPot(bet * 2);
    setCommunityCards([]);
    setStage('PREFLOP');
    setIsPlayerTurn(true);
    setMessage("Ante placed. Your move.");
  };

  const handleStartMatch = () => {
    if (!user) return alert("Connect Wallet!");
    const bet = parseFloat(wager);
    if (bet > user.balance) return alert("Insufficient funds");
    updateBalance(-bet);
    setStage('MATCHMAKING');
    setTimeout(() => initializeGame(), 2000);
  };

  const advanceStage = () => {
    setIsPlayerTurn(false);
    setMessage("Dealing...");
    setTimeout(() => {
      const currentDeck = [...deck];
      if (stage === 'PREFLOP') {
        setCommunityCards([currentDeck.pop()!, currentDeck.pop()!, currentDeck.pop()!]);
        setStage('FLOP');
      } else if (stage === 'FLOP') {
        setCommunityCards(prev => [...prev, currentDeck.pop()!]);
        setStage('TURN');
      } else if (stage === 'TURN') {
        setCommunityCards(prev => [...prev, currentDeck.pop()!]);
        setStage('RIVER');
      } else if (stage === 'RIVER') {
        setStage('SHOWDOWN');
        resolveShowdown();
        return;
      }
      setDeck(currentDeck);
      setIsPlayerTurn(true);
      setMessage("Round continues. Action?");
    }, 1000);
  };

  const resolveShowdown = () => {
    const playerFull = [...playerHand, ...communityCards];
    const botFull = [...botHand, ...communityCards];
    let pEval = evaluateHand(playerFull);
    let bEval = evaluateHand(botFull);
    
    if (testMode.active && testMode.forceWin) {
        pEval = { rank: 9, name: 'Royal Flush' };
        bEval = { rank: 1, name: 'One Pair' };
    }
    
    setHandNames({ player: pEval.name, bot: bEval.name });
    if (pEval.rank > bEval.rank) {
      const payout = testMode.active ? testMode.winAmount : pot * 0.95;
      updateBalance(payout);
      setMessage(`WIN: ${pEval.name}! +${payout.toFixed(2)} SOL`);
    } else {
      setMessage(`BOT WINS: ${bEval.name}`);
    }
    setTimeout(() => resetGame(), 5000);
  };

  const resetGame = () => {
    setStage('WAGER');
    setPot(0);
    setCommunityCards([]);
    setHandNames({ player: '', bot: '' });
  };

  if (stage === 'WAGER') {
    return (
      <div className="max-w-md mx-auto bg-card-bg border-4 border-gray-800 rounded-[3rem] p-6 md:p-8 text-center mt-10 shadow-card-depth animate-in zoom-in relative overflow-hidden">
        <Spade size={64} className="text-fox-orange mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase mb-2">NEON POKER</h2>
        <div className="bg-slate-950 p-6 rounded-3xl border-2 border-gray-800 mb-8 text-left">
           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Wager (SOL)</label>
           <input type="number" value={wager} onChange={e => setWager(e.target.value)} className="w-full bg-transparent border-none text-white text-3xl font-black focus:outline-none" />
        </div>

        <div className="flex flex-col gap-3">
            <button onClick={handleStartMatch} className="w-full bg-fox-orange text-white py-6 rounded-3xl font-black text-xl shadow-pop-orange btn-tactile uppercase">FIND TABLE</button>
            {!testModeInitialized && (
              <button onClick={() => setShowTestConfig(true)} className="w-full bg-slate-800 text-gray-400 font-black py-4 rounded-2xl border-2 border-gray-700 flex items-center justify-center gap-2 text-xs uppercase tracking-widest animate-in fade-in duration-300">
                  <FlaskConical size={16} /> CONFIGURE TESTMODE
              </button>
            )}
        </div>

        {showTestConfig && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <div className="bg-card-bg border-4 border-brand-purple rounded-[3rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in">
                    <h3 className="text-2xl font-black text-white italic uppercase mb-6">Test Settings</h3>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 mb-6">
                        <span className="text-[10px] font-black uppercase text-gray-500 block mb-4">Set Original Win (SOL)</span>
                        <div className="grid grid-cols-3 gap-2">
                            {[10, 20, 30, 50, 80, 100].map(amt => (
                                <button key={amt} onClick={() => setTestMode({...testMode, winAmount: amt})} className={`py-2 rounded-xl text-xs font-black transition-all ${testMode.winAmount === amt ? 'bg-brand-purple text-white' : 'bg-slate-800 text-gray-500'}`}>
                                    {amt}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => { setTestMode({...testMode, active: true, forceWin: true}); setTestModeInitialized(true); setShowTestConfig(false); }} className="w-full bg-brand-purple text-white font-black py-4 rounded-2xl shadow-pop-purple uppercase italic tracking-tighter text-lg">INITIALIZE</button>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full gap-2 md:gap-4 pb-12">
       <div className="flex justify-between items-center px-2 md:px-4">
         <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-1 font-black text-[9px] md:text-sm uppercase bg-white/5 p-2 px-3 rounded-xl border border-white/5"><ChevronLeft size={16}/> Back</button>
         <div className="bg-slate-900 border-2 border-emerald-500/30 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-xl font-black text-emerald-400 flex items-center gap-2">
            POT: {testMode.active ? testMode.winAmount.toFixed(2) : pot.toFixed(2)} SOL
         </div>
       </div>

       <div className="relative flex-1 bg-[#064e3b] border-[8px] md:border-[24px] border-[#3f2e22] rounded-[40px] md:rounded-[200px] shadow-2xl flex flex-col justify-between py-6 md:py-10 overflow-hidden min-h-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] opacity-20 pointer-events-none"></div>
          
          <div className="flex flex-col items-center gap-1 md:gap-2 z-10 scale-[0.8] md:scale-100">
             <div className="w-10 h-10 md:w-20 md:h-20 rounded-xl bg-slate-900 border-2 border-white/10 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=pokerbot`} alt="Bot" />
             </div>
             <div className="flex gap-1 md:gap-2">
                <CardView card={botHand[0]} hidden={stage !== 'SHOWDOWN'} isMobile={isMobile} />
                <CardView card={botHand[1]} hidden={stage !== 'SHOWDOWN'} isMobile={isMobile} />
             </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 z-10">
             <div className="bg-black/60 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-white text-[8px] md:text-xs font-black uppercase italic tracking-widest border border-white/10 text-center mx-2">
                {message}
             </div>
             <div className="flex gap-1 md:gap-4 overflow-x-auto no-scrollbar max-w-full px-2">
                {communityCards.map((card, i) => <CardView key={i} card={card} isMobile={isMobile} />)}
                {[...Array(5 - communityCards.length)].map((_, i) => (
                   <div key={i} className="w-10 h-14 md:w-24 md:h-32 border-2 border-white/10 rounded-lg md:rounded-xl bg-white/5 border-dashed"></div>
                ))}
             </div>
          </div>

          <div className="flex flex-col items-center z-10 scale-[0.8] md:scale-110 mb-2 md:mb-0">
             {(stage === 'SHOWDOWN' || (testMode.active && testMode.forceWin)) && handNames.player && <div className="bg-neon-green px-3 md:px-4 py-1 rounded-full text-black font-black text-[8px] md:text-[10px] uppercase mb-1 md:mb-2 shadow-glow-green">{handNames.player}</div>}
             <div className="flex gap-1 md:gap-2 mb-2 md:mb-4">
                <CardView card={playerHand[0]} isMobile={isMobile} />
                <CardView card={playerHand[1]} isMobile={isMobile} />
             </div>
             <div className="bg-slate-900/95 p-2 md:p-6 rounded-[20px] md:rounded-[30px] border-2 md:border-4 border-slate-700 flex gap-2 md:gap-4 backdrop-blur-md shadow-2xl">
                {isPlayerTurn ? (
                   <>
                     <button onClick={() => { setMessage("Folded."); setTimeout(() => resetGame(), 1000); }} className="px-4 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-neon-red text-white text-[10px] md:text-sm font-black uppercase shadow-pop-red btn-tactile">Fold</button>
                     <button onClick={advanceStage} className="px-6 md:px-14 py-2 md:py-4 rounded-xl md:rounded-2xl bg-neon-blue text-white text-[10px] md:text-sm font-black uppercase shadow-pop-blue btn-tactile">Call</button>
                   </>
                ) : stage !== 'SHOWDOWN' && (
                   <div className="px-8 md:px-12 py-2 md:py-4 text-gray-500 font-black uppercase text-[10px] italic animate-pulse">Waiting...</div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default TexasHoldemGame;
