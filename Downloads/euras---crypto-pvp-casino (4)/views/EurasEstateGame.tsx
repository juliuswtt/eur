
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '../types';
import { 
  ChevronLeft, Building, Trophy, Coins, Zap, 
  Loader2, Star, UserCircle, ShieldAlert, 
  ArrowUpRight, Home, Hotel, Info, Sparkles, Settings, FlaskConical, Move, Truck, Map, Briefcase, Skull, AlertTriangle
} from 'lucide-react';

interface GameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

type SpaceType = 'PROPERTY' | 'TRANSPORT' | 'UTILITY' | 'TAX' | 'CHANCE' | 'CHEST' | 'GO' | 'JAIL' | 'PARKING' | 'GOTOJAIL';

interface Space {
  id: number;
  name: string;
  type: SpaceType;
  price?: number;
  rent?: number;
  groupColor?: string;
  icon?: React.ReactNode;
}

const BOARD_SPACES: Space[] = [
  { id: 0, name: 'GO', type: 'GO', icon: <ArrowUpRight /> },
  { id: 1, name: 'Degen St', type: 'PROPERTY', groupColor: '#78350f', price: 60, rent: 4 },
  { id: 2, name: 'Pack News', type: 'CHEST' },
  { id: 3, name: 'Alpha Al', type: 'PROPERTY', groupColor: '#78350f', price: 60, rent: 4 },
  { id: 4, name: 'Network Rake', type: 'TAX', price: 200 },
  { id: 5, name: 'Eura Trans S', type: 'TRANSPORT', price: 200, rent: 25, icon: <Truck /> },
  { id: 6, name: 'Solana Ln', type: 'PROPERTY', groupColor: '#06b6d4', price: 100, rent: 6 },
  { id: 7, name: 'Degen Tip', type: 'CHANCE' },
  { id: 8, name: 'Phantom Av', type: 'PROPERTY', groupColor: '#06b6d4', price: 100, rent: 6 },
  { id: 9, name: 'Ledger Bl', type: 'PROPERTY', groupColor: '#06b6d4', price: 120, rent: 8 },
  { id: 10, name: 'SEC PROBE', type: 'JAIL', icon: <ShieldAlert /> },
  { id: 11, name: 'Neon Plz', type: 'PROPERTY', groupColor: '#d946ef', price: 140, rent: 10 },
  { id: 12, name: 'Web3 Serv', type: 'UTILITY', price: 150, rent: 20, icon: <Zap /> },
  { id: 13, name: 'Glitch Wy', type: 'PROPERTY', groupColor: '#d946ef', price: 140, rent: 10 },
  { id: 14, name: 'Cyber Ct', type: 'PROPERTY', groupColor: '#d946ef', price: 160, rent: 12 },
  { id: 15, name: 'Eura Trans W', type: 'TRANSPORT', price: 200, rent: 25, icon: <Truck /> },
  { id: 16, name: 'Meme Rd', type: 'PROPERTY', groupColor: '#f97316', price: 180, rent: 14 },
  { id: 17, name: 'Pack News', type: 'CHEST' },
  { id: 18, name: 'Shilling St', type: 'PROPERTY', groupColor: '#f97316', price: 180, rent: 14 },
  { id: 19, name: 'Hype Sq', type: 'PROPERTY', groupColor: '#f97316', price: 200, rent: 16 },
  { id: 20, name: 'Whale Club', type: 'PARKING', icon: <Star /> },
  { id: 21, name: 'Bull Run', type: 'PROPERTY', groupColor: '#ef4444', price: 220, rent: 18 },
  { id: 22, name: 'Degen Tip', type: 'CHANCE' },
  { id: 23, name: 'Candle Cr', type: 'PROPERTY', groupColor: '#ef4444', price: 220, rent: 18 },
  { id: 24, name: 'Pivot Pt', type: 'PROPERTY', groupColor: '#ef4444', price: 240, rent: 20 },
  { id: 25, name: 'Eura Trans N', type: 'TRANSPORT', price: 200, rent: 25, icon: <Truck /> },
  { id: 26, name: 'FOMO Fl', type: 'PROPERTY', groupColor: '#eab308', price: 260, rent: 22 },
  { id: 27, name: 'Gas Fee', type: 'UTILITY', price: 150, rent: 20, icon: <Zap /> },
  { id: 28, name: 'Whale Wh', type: 'PROPERTY', groupColor: '#eab308', price: 260, rent: 22 },
  { id: 29, name: 'Pump Plz', type: 'PROPERTY', groupColor: '#eab308', price: 280, rent: 24 },
  { id: 30, name: 'GET PROBED', type: 'GOTOJAIL', icon: <Skull /> },
  { id: 31, name: 'Sol Valley', type: 'PROPERTY', groupColor: '#22c55e', price: 300, rent: 26 },
  { id: 32, name: 'Venture Bl', type: 'PROPERTY', groupColor: '#22c55e', price: 300, rent: 26 },
  { id: 33, name: 'Pack News', type: 'CHEST' },
  { id: 34, name: 'Oracle Dr', type: 'PROPERTY', groupColor: '#22c55e', price: 320, rent: 28 },
  { id: 35, name: 'Eura Trans E', type: 'TRANSPORT', price: 200, rent: 25, icon: <Truck /> },
  { id: 36, name: 'Degen Tip', type: 'CHANCE' },
  { id: 37, name: 'Diamond Pk', type: 'PROPERTY', groupColor: '#3b82f6', price: 350, rent: 35 },
  { id: 38, name: 'Whale Tax', type: 'TAX', price: 100 },
  { id: 39, name: 'Eura Hgts', type: 'PROPERTY', groupColor: '#3b82f6', price: 400, rent: 50 },
];

const EurasEstateGame: React.FC<GameProps> = ({ user, updateBalance, onBack }) => {
  const [gameState, setGameState] = useState<'WAGER' | 'PLAYING' | 'ACTION' | 'RESULT' | 'GAMEOVER'>('WAGER');
  const [wager, setWager] = useState('5.0');
  const [turn, setTurn] = useState(0); 
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [doublesCount, setDoublesCount] = useState(0);
  
  const [owners, setOwners] = useState<{[key: number]: number}>({}); 
  const [players, setPlayers] = useState([
    { id: 0, name: 'YOU', money: 1500, position: 0, avatar: '🦊', color: '#F59E0B' },
    { id: 1, name: 'BOT', money: 1500, position: 0, avatar: '🦉', color: '#3B82F6' },
  ]);

  const [displayPositions, setDisplayPositions] = useState([0, 0]);
  const [lastActionMsg, setLastActionMsg] = useState('Welcome to Euras Estate!');

  const movePlayer = async (pIdx: number, steps: number) => {
    setIsMoving(true);
    let currentPos = players[pIdx].position;
    
    for (let i = 0; i < steps; i++) {
        currentPos = (currentPos + 1) % 40;
        setDisplayPositions(prev => {
            const next = [...prev];
            next[pIdx] = currentPos;
            return next;
        });
        if (currentPos === 0) {
            setPlayers(prev => {
                const next = [...prev];
                next[pIdx].money += 200;
                return next;
            });
            setLastActionMsg(`${players[pIdx].name} passed GO! +$200`);
        }
        await new Promise(r => setTimeout(r, 200));
    }

    setPlayers(prev => {
        const next = [...prev];
        next[pIdx].position = currentPos;
        return next;
    });
    setIsMoving(false);
    handleLanding(pIdx, currentPos);
  };

  const handleLanding = (pIdx: number, pos: number) => {
    const space = BOARD_SPACES[pos];
    
    // Tax Logic
    if (space.type === 'TAX') {
        const cost = space.price || 100;
        updateMoney(pIdx, -cost);
        setLastActionMsg(`${players[pIdx].name} paid ${space.name}: -$${cost}`);
    }

    // Rent Logic
    const owner = owners[pos];
    if (owner !== undefined && owner !== pIdx) {
        const rent = space.rent || 10;
        updateMoney(pIdx, -rent);
        updateMoney(owner, rent);
        setLastActionMsg(`${players[pIdx].name} paid $${rent} rent to ${players[owner].name}`);
    }

    // Jail Logic
    if (space.type === 'GOTOJAIL') {
        setPlayers(prev => {
            const next = [...prev];
            next[pIdx].position = 10;
            return next;
        });
        setDisplayPositions(prev => {
            const next = [...prev];
            next[pIdx] = 10;
            return next;
        });
        setLastActionMsg(`${players[pIdx].name} sent to SEC PROBE!`);
        if (pIdx === 1) setTimeout(() => nextTurn(false), 2000);
        else setGameState('PLAYING');
        return;
    }

    // Bot Logic: Buy everything if possible
    if (pIdx === 1) {
        if (owner === undefined && space.price && players[1].money >= space.price) {
            setTimeout(() => {
                setOwners(prev => ({...prev, [pos]: 1}));
                updateMoney(1, -space.price!);
                setLastActionMsg(`Bot bought ${space.name}!`);
                setTimeout(() => nextTurn(dice[0] === dice[1]), 1000);
            }, 1000);
        } else {
            setTimeout(() => nextTurn(dice[0] === dice[1]), 1500);
        }
    } else {
        // Player Action
        if (owner === undefined && space.price) setGameState('ACTION');
        else setGameState('PLAYING');
    }
  };

  const updateMoney = (pIdx: number, amount: number) => {
    setPlayers(prev => {
        const next = [...prev];
        next[pIdx].money += amount;
        if (next[0].money <= 0) setGameState('GAMEOVER');
        return next;
    });
  };

  const nextTurn = (wasDoubles: boolean) => {
    if (wasDoubles && doublesCount < 3) {
        setLastActionMsg(`${players[turn].name} rolled Pasch! Again!`);
        if (turn === 1) rollDice();
    } else {
        setTurn(t => t === 0 ? 1 : 0);
        setDoublesCount(0);
        if (turn === 0) setTimeout(() => rollDice(), 1000);
    }
  };

  const rollDice = () => {
    if (isRolling || isMoving) return;
    setIsRolling(true);
    setTimeout(() => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        setDice([d1, d2]);
        setIsRolling(false);
        const isPasch = d1 === d2;
        if (isPasch) setDoublesCount(c => c + 1);
        movePlayer(turn, d1 + d2);
    }, 800);
  };

  const buyProperty = () => {
    const pos = players[0].position;
    const space = BOARD_SPACES[pos];
    if (space.price && players[0].money >= space.price) {
        setOwners(prev => ({...prev, [pos]: 0}));
        updateMoney(0, -space.price);
        setLastActionMsg(`You acquired ${space.name}!`);
        setGameState('PLAYING');
        nextTurn(dice[0] === dice[1]);
    }
  };

  const getSpaceStyle = (i: number) => {
    if (i <= 10) return { gridRow: 11, gridColumn: 11 - i };
    if (i <= 20) return { gridRow: 21 - i, gridColumn: 1 };
    if (i <= 30) return { gridRow: 1, gridColumn: i - 19 };
    return { gridRow: i - 29, gridColumn: 11 };
  };

  if (gameState === 'WAGER') {
    return (
      <div className="max-w-md mx-auto bg-card-bg border-4 border-gray-800 rounded-[3rem] p-8 text-center mt-10 shadow-card-depth animate-in zoom-in">
        <Building size={64} className="text-neon-green mx-auto mb-6" />
        <h2 className="text-4xl font-black italic text-white uppercase mb-2 leading-none">EURAS ESTATE</h2>
        <div className="bg-slate-950 p-6 rounded-3xl border-2 border-gray-800 mb-8 text-left">
           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Fee (SOL)</label>
           <input type="number" value={wager} onChange={e => setWager(e.target.value)} className="w-full bg-transparent border-none text-white text-3xl font-black focus:outline-none" />
        </div>
        <button onClick={() => { updateBalance(-parseFloat(wager)); setGameState('PLAYING'); }} className="w-full bg-neon-green text-black py-6 rounded-3xl font-black text-xl shadow-pop-green btn-tactile uppercase italic">START TYCOON</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full gap-2 pb-12 overflow-hidden relative">
      <div className="flex justify-between items-center px-4 shrink-0">
        <button onClick={onBack} className="text-gray-500 bg-white/5 p-2 rounded-xl active:scale-90 transition-transform"><ChevronLeft size={24}/></button>
        <div className="flex gap-2">
           {players.map(p => (
              <div key={p.id} className={`bg-slate-900 border-2 px-4 py-2 rounded-xl flex items-center gap-3 transition-all ${turn === p.id ? 'border-white scale-105 shadow-lg' : 'border-gray-800 opacity-60'}`}>
                <span className="text-xl">{p.avatar}</span>
                <div className="text-left">
                    <div className="text-[8px] font-black text-gray-500 uppercase">{p.name}</div>
                    <div className="text-sm font-black text-white font-mono">${p.money}</div>
                </div>
              </div>
           ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-1 md:p-3 relative shadow-2xl aspect-square border-4 md:border-8 border-slate-900 mx-auto w-full max-w-[600px] overflow-hidden">
          <div className="grid grid-cols-11 grid-rows-11 h-full w-full bg-[#c0d8c0]">
              <div className="grid-in-center col-start-2 col-end-11 row-start-2 row-end-11 bg-[#c0d8c0] flex flex-col items-center justify-center relative border-2 border-slate-900/5">
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-800/10 rotate-[-35deg] pointer-events-none absolute">EURAS ESTATE</h2>
                  <div className="z-10 flex flex-col items-center gap-4 text-center px-4">
                      <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-900/10 min-h-[40px] flex items-center">
                          <p className="text-[10px] font-black uppercase text-slate-700 italic animate-in slide-in-from-top-2">{lastActionMsg}</p>
                      </div>
                      <div className="flex gap-4">
                         {[0, 1].map(i => (
                            <div key={i} className={`w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-black text-slate-900 shadow-xl border-4 border-slate-200 transition-all ${isRolling ? 'animate-shake' : ''}`}>
                               {dice[i]}
                            </div>
                         ))}
                      </div>
                      {turn === 0 && !isRolling && !isMoving && gameState === 'PLAYING' && (
                        <button onClick={rollDice} className="px-10 py-4 rounded-2xl bg-fox-orange text-white font-black italic uppercase shadow-pop-orange btn-tactile">ROLL DICE</button>
                      )}
                      {gameState === 'ACTION' && turn === 0 && (
                        <div className="flex gap-4 animate-in zoom-in">
                            <button onClick={buyProperty} className="bg-neon-green text-white px-6 py-4 rounded-2xl font-black uppercase italic shadow-pop-green btn-tactile">BUY ${BOARD_SPACES[players[0].position].price}</button>
                            <button onClick={() => nextTurn(dice[0] === dice[1])} className="bg-slate-800 text-white px-6 py-4 rounded-2xl font-black uppercase italic btn-tactile">SKIP</button>
                        </div>
                      )}
                  </div>
              </div>

              {BOARD_SPACES.map((s, i) => (
                  <div key={i} style={getSpaceStyle(i)} className={`border border-slate-900/10 flex flex-col relative bg-white/60 transition-colors ${owners[i] !== undefined ? (owners[i] === 0 ? 'bg-orange-100' : 'bg-blue-100') : ''}`}>
                      {s.groupColor && <div className="h-1/4 w-full border-b border-slate-900/10" style={{ backgroundColor: s.groupColor }}></div>}
                      <div className="flex-1 flex flex-col items-center justify-center p-0.5 text-center">
                          <span className="text-[5px] md:text-[8px] font-black uppercase text-slate-900 truncate w-full">{s.name}</span>
                          {s.icon && <div className="text-slate-800/40 mt-0.5 scale-75">{s.icon}</div>}
                          {s.price && owners[i] === undefined && <span className="text-[4px] md:text-[6px] font-bold text-slate-600">${s.price}</span>}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                          {displayPositions.map((pos, pIdx) => pos === i && (
                              <div key={pIdx} className={`w-5 h-5 md:w-8 md:h-8 bg-white rounded-full border-2 shadow-lg flex items-center justify-center text-[10px] md:text-base animate-bounce transition-all duration-300 ${pIdx === 0 ? 'scale-110 z-40' : 'z-30 opacity-80'}`} style={{ borderColor: players[pIdx].color }}>{players[pIdx].avatar}</div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>
      {gameState === 'GAMEOVER' && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
             <div className="bg-card-bg border-4 border-rose-500 rounded-[3rem] p-12 text-center shadow-2xl max-w-sm w-full">
                <Skull size={80} className="text-rose-500 mx-auto mb-6 animate-shake" />
                <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter mb-4 leading-none">REKT</h2>
                <p className="text-gray-500 font-bold uppercase tracking-widest mb-10 italic">Your estate was liquidated. Market dump got you.</p>
                <button onClick={onBack} className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg uppercase italic btn-tactile">BACK TO LOBBY</button>
             </div>
        </div>
      )}
    </div>
  );
};

export default EurasEstateGame;
