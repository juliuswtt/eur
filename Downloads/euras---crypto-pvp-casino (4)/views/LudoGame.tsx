
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from '../types';
import { SOL_PRICE } from '../constants';
import { ChevronLeft, Dices, Trophy, Users, ShieldAlert, Loader2, Star, Coins, Home, Trash2, Zap, Settings, FlaskConical } from 'lucide-react';

interface GameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

type PlayerColor = 'orange' | 'blue' | 'red' | 'green';

interface Player {
  id: number;
  name: string;
  color: PlayerColor;
  pieces: number[]; 
  isBot: boolean;
  avatar: string;
}

const PATH_COORDS: [number, number][] = [
  [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [3, 4], [2, 4], [1, 4], [0, 4],
  [0, 5], [0, 6],
  [1, 6], [2, 6], [3, 6], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10],
  [5, 10], [6, 10],
  [6, 9], [6, 8], [6, 7], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6],
  [10, 5], [10, 4],
  [9, 4], [8, 4], [7, 4], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [5, 0]
];

const START_STEPS = [0, 10, 20, 30];

const HOME_PATHS: { [key: number]: [number, number][] } = {
  0: [[5, 1], [5, 2], [5, 3], [5, 4]],
  1: [[1, 5], [2, 5], [3, 5], [4, 5]],
  2: [[5, 9], [5, 8], [5, 7], [5, 6]],
  3: [[9, 5], [8, 5], [7, 5], [6, 5]],
};

const YARD_POSITIONS: { [key: number]: [number, number][] } = {
  0: [[0, 0], [0, 1], [1, 0], [1, 1]],
  1: [[0, 9], [0, 10], [1, 9], [1, 10]],
  2: [[9, 9], [9, 10], [10, 9], [10, 10]],
  3: [[9, 0], [9, 1], [10, 0], [10, 1]],
};

const LudoGame: React.FC<GameProps> = ({ user, updateBalance, onBack }) => {
  const [gameState, setGameState] = useState<'WAGER' | 'MATCHMAKING' | 'PLAYING' | 'RESULT'>('WAGER');
  const [wager, setWager] = useState('1.0');
  const [turn, setTurn] = useState(0); 
  const [dice, setDice] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [log, setLog] = useState<string[]>(['Roll a 6 to deploy!']);
  const [winners, setWinners] = useState<number[]>([]);
  const [boardShake, setBoardShake] = useState(false);

  const [testMode, setTestMode] = useState({ active: false, forceWin: true, winAmount: 30 });
  const [showTestConfig, setShowTestConfig] = useState(false);
  const [testModeInitialized, setTestModeInitialized] = useState(false);

  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: 'YOU', color: 'orange', pieces: [-1, -1, -1, -1], isBot: false, avatar: '🦊' },
    { id: 1, name: 'OWL', color: 'blue', pieces: [-1, -1, -1, -1], isBot: true, avatar: '🦉' },
    { id: 2, name: 'BULL', color: 'red', pieces: [-1, -1, -1, -1], isBot: true, avatar: '🐂' },
    { id: 3, name: 'LIZ', color: 'green', pieces: [-1, -1, -1, -1], isBot: true, avatar: '🦎' },
  ]);

  const [displayPositions, setDisplayPositions] = useState<number[][]>(players.map(p => [...p.pieces]));

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 3));

  const handleStartMatch = () => {
    if (!user) return;
    if (parseFloat(wager) > user.balance) return alert("Insufficient balance");
    updateBalance(-parseFloat(wager));
    setGameState('MATCHMAKING');
    setTimeout(() => {
      setGameState('PLAYING');
      setTurn(0);
    }, 1500);
  };

  const rollDice = useCallback(() => {
    if (isRolling || isMoving || winners.includes(turn)) return;
    setIsRolling(true);
    setDice(null);
    setTimeout(() => {
      let val = Math.floor(Math.random() * 6) + 1;
      setDice(val);
      setIsRolling(false);
      const p = players[turn];
      const movable = p.pieces.some((pos) => {
        if (pos === -1) return val === 6;
        if (pos >= 44) return false;
        return pos + val <= 44;
      });
      if (!movable) {
        addLog(`${p.name} rolled ${val}. No moves!`);
        setTimeout(() => nextTurn(), 1000);
      } else if (p.isBot) {
        setTimeout(() => botMove(val), 800);
      }
    }, 800);
  }, [isRolling, isMoving, winners, turn, players]);

  // Triggert Bot-Züge automatisch
  useEffect(() => {
    if (gameState === 'PLAYING' && players[turn]?.isBot && !isRolling && !isMoving && !dice) {
       const botTimer = setTimeout(() => rollDice(), 1500);
       return () => clearTimeout(botTimer);
    }
  }, [turn, gameState, players, isRolling, isMoving, dice, rollDice]);

  const botMove = (roll: number) => {
    const p = players[turn];
    const available = p.pieces
      .map((pos, idx) => ({ pos, idx }))
      .filter(({ pos }) => (pos === -1 ? roll === 6 : pos + roll <= 44));
    const move = available.sort((a, b) => b.pos - a.pos)[0];
    if (move) movePiece(turn, move.idx, roll);
  };

  const movePiece = async (pIdx: number, pcIdx: number, roll: number) => {
    if (isMoving || pIdx !== turn) return;
    const p = players[pIdx];
    const currentPos = p.pieces[pcIdx];
    if (currentPos === -1 && roll !== 6) return;
    if (currentPos >= 0 && currentPos + roll > 44) return;
    setIsMoving(true);
    let steppingPos = currentPos;
    if (currentPos === -1) {
      steppingPos = 0;
      setDisplayPositions(prev => prev.map((pp, i) => i === pIdx ? pp.map((pos, j) => j === pcIdx ? 0 : pos) : pp));
      await new Promise(r => setTimeout(r, 250));
    } else {
      for (let i = 1; i <= roll; i++) {
        steppingPos++;
        setDisplayPositions(prev => prev.map((pp, i_p) => i_p === pIdx ? pp.map((pos, j) => j === pcIdx ? steppingPos : pos) : pp));
        await new Promise(r => setTimeout(r, 200));
      }
    }
    let captured = false;
    const finalTrackPos = steppingPos;
    setPlayers(prev => {
      const nextPlayers = JSON.parse(JSON.stringify(prev));
      nextPlayers[pIdx].pieces[pcIdx] = finalTrackPos;
      if (finalTrackPos >= 0 && finalTrackPos < 40) {
        const globalIdx = (START_STEPS[pIdx] + finalTrackPos) % 40;
        nextPlayers.forEach((otherP: Player, otherIdx: number) => {
          if (otherIdx === pIdx) return;
          otherP.pieces.forEach((oPos, oPcIdx) => {
            if (oPos >= 0 && oPos < 40) {
              const otherGlobalIdx = (START_STEPS[otherIdx] + oPos) % 40;
              if (globalIdx === otherGlobalIdx) {
                nextPlayers[otherIdx].pieces[oPcIdx] = -1;
                setDisplayPositions(d => d.map((dp, i) => i === otherIdx ? dp.map((pos, j) => j === oPcIdx ? -1 : pos) : dp));
                captured = true;
              }
            }
          });
        });
      }
      if (nextPlayers[pIdx].pieces.every((pos: number) => pos === 44)) {
        if (!winners.includes(pIdx)) {
          setWinners(w => [...w, pIdx]);
          if (pIdx === 0) setGameState('RESULT');
        }
      }
      return nextPlayers;
    });
    if (captured) {
      addLog("BOOM! Captured!");
      setBoardShake(true);
      setTimeout(() => setBoardShake(false), 400);
    }
    setIsMoving(false);
    if (roll === 6 || captured) {
      addLog(roll === 6 ? "SIX! Roll again." : "Hit! Roll again.");
      setDice(null);
    } else {
      setTimeout(() => nextTurn(), 400);
    }
  };

  const nextTurn = () => {
    setDice(null);
    let next = (turn + 1) % 4;
    while (winners.includes(next) && winners.length < 3) next = (next + 1) % 4;
    setTurn(next);
  };

  const getCellType = (r: number, c: number) => {
    if (r === 4 && c === 0) return 'orange';
    if (r === 0 && c === 6) return 'blue';
    if (r === 6 && c === 10) return 'red';
    if (r === 10 && c === 4) return 'green';
    if (r === 5 && c >= 1 && c <= 4) return 'orange';
    if (c === 5 && r >= 1 && r <= 4) return 'blue';
    if (r === 5 && c >= 6 && c <= 9) return 'red';
    if (c === 5 && r >= 6 && r <= 9) return 'green';
    const isTrack = PATH_COORDS.some(p => p[0] === r && p[1] === c);
    if (isTrack) return 'track';
    return 'empty';
  };

  const getPieceCoords = (pIdx: number, pos: number, pcIdx: number) => {
    if (pos === -1) return YARD_POSITIONS[pIdx][pcIdx];
    if (pos >= 40) {
      if (pos === 44) return [5, 5] as [number, number];
      return HOME_PATHS[pIdx][pos - 40];
    }
    return PATH_COORDS[(START_STEPS[pIdx] + pos) % 40];
  };

  if (gameState === 'WAGER') {
    return (
      <div className="max-w-md mx-auto bg-card-bg border-4 border-gray-800 rounded-[3rem] p-6 md:p-8 text-center mt-10 shadow-card-depth animate-in zoom-in relative overflow-hidden">
        {testMode.active && <div className="absolute top-0 left-0 w-full h-1 bg-fox-orange animate-pulse"></div>}
        <Dices size={64} className="text-fox-orange mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase mb-2">LUDO ROYALE</h2>
        <div className="bg-slate-950 p-6 rounded-3xl border-2 border-gray-800 mb-8 text-left">
           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Stake (SOL)</label>
           <input type="number" value={wager} onChange={e => setWager(e.target.value)} className="w-full bg-transparent border-none text-white text-3xl font-black focus:outline-none" />
        </div>

        <div className="flex flex-col gap-3">
            <button onClick={handleStartMatch} className="w-full bg-fox-orange text-white py-6 rounded-3xl font-black text-xl shadow-pop-orange btn-tactile uppercase italic tracking-tighter">JOIN TABLE</button>
            {!testModeInitialized && (
              <button onClick={() => setShowTestConfig(true)} className="w-full bg-slate-800 text-gray-400 font-black py-4 rounded-2xl border-2 border-gray-700 flex items-center justify-center gap-2 text-xs uppercase tracking-widest hover:bg-slate-700 transition-all">
                  <FlaskConical size={16} /> CONFIGURE TESTMODE
              </button>
            )}
        </div>

        {showTestConfig && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <div className="bg-card-bg border-4 border-brand-purple rounded-[3rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in">
                    <h3 className="text-2xl font-black text-white italic uppercase mb-6">Test Settings</h3>
                    <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 mb-6">
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-4">Set Original Win (SOL)</span>
                        <div className="grid grid-cols-4 gap-2">
                            {[10, 20, 30, 50, 80, 100].map(amt => (
                                <button 
                                    key={amt} 
                                    onClick={() => setTestMode({...testMode, winAmount: amt})}
                                    className={`py-2 rounded-xl text-xs font-black transition-all ${testMode.winAmount === amt ? 'bg-brand-purple text-white' : 'bg-slate-800 text-gray-500'}`}
                                >
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
    <div className="max-w-5xl mx-auto flex flex-col h-full gap-2 md:gap-4 overflow-hidden relative pb-12">
      <div className="flex justify-between items-center px-2 md:px-4 flex-shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-1 font-black text-[9px] md:text-sm uppercase bg-white/5 p-2 px-3 md:px-4 rounded-xl border border-white/5"><ChevronLeft size={16}/> Fold</button>
        <div className="flex gap-1 md:gap-2">
            {players.map(p => (
              <div key={p.id} className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center border-2 transition-all ${turn === p.id ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-40'}`} style={{ backgroundColor: p.color === 'orange' ? '#F59E0B' : p.color === 'blue' ? '#3B82F6' : p.color === 'red' ? '#F43F5E' : '#10B981' }}>
                <span className="text-xs md:text-sm">{p.avatar}</span>
              </div>
            ))}
        </div>
        <div className="bg-slate-900 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Coins size={12} className="text-fox-orange" />
            <span className="text-xs md:text-sm font-black text-white font-mono">{testMode.active ? testMode.winAmount : (parseFloat(wager) * 4).toFixed(1)}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 md:gap-6 overflow-y-auto no-scrollbar">
        <div className="lg:col-span-8 flex items-center justify-center p-1">
            <div className={`relative aspect-square w-full max-w-[400px] md:max-w-[500px] bg-slate-900 rounded-[1.5rem] border-[6px] md:border-[8px] border-gray-800 shadow-2xl grid grid-cols-11 grid-rows-11 overflow-hidden transition-transform duration-100 ${boardShake ? 'animate-shake' : ''}`}>
                {[...Array(11)].map((_, r) => [...Array(11)].map((_, c) => {
                    const type = getCellType(r, c);
                    return (
                        <div key={`${r}-${c}`} className={`border border-white/5 flex items-center justify-center relative
                            ${type === 'orange' ? 'bg-fox-orange/40 shadow-[inset_0_0_5px_rgba(245,158,11,0.5)]' :
                              type === 'blue' ? 'bg-neon-blue/40 shadow-[inset_0_0_5px_rgba(59,130,246,0.5)]' :
                              type === 'red' ? 'bg-neon-red/40 shadow-[inset_0_0_5px_rgba(244,63,94,0.5)]' :
                              type === 'green' ? 'bg-neon-green/40 shadow-[inset_0_0_5px_rgba(16,185,129,0.5)]' :
                              type === 'track' ? 'bg-white/10' : 'bg-transparent'}
                        `}>
                            {type !== 'empty' && type !== 'track' && <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-white/30"></div>}
                        </div>
                    );
                }))}
                {displayPositions.map((pSet, pIdx) => pSet.map((pos, pcIdx) => {
                    const [r, c] = getPieceCoords(pIdx, pos, pcIdx);
                    const isMovable = turn === pIdx && !isMoving && !!dice && (
                      pos === -1 ? dice === 6 : pos + dice <= 44
                    );
                    return (
                        <button
                            key={`${pIdx}-${pcIdx}`}
                            disabled={!isMovable || pIdx !== 0}
                            onClick={() => movePiece(pIdx, pcIdx, dice!)}
                            style={{ 
                                top: `${(r / 11) * 100}%`, 
                                left: `${(c / 11) * 100}%`,
                                width: '9.09%',
                                height: '9.09%'
                            }}
                            className={`absolute z-30 flex items-center justify-center p-0.5 md:p-1 transition-all duration-300
                                ${isMovable && pIdx === 0 ? 'animate-bounce cursor-pointer' : 'cursor-default'}
                            `}
                        >
                            <div className={`w-full h-full rounded-full border border-white/50 flex items-center justify-center shadow-lg transform transition-transform animate-in zoom-in duration-500
                                ${pIdx === 0 ? 'bg-fox-orange' : pIdx === 1 ? 'bg-neon-blue' : pIdx === 2 ? 'bg-neon-red' : pIdx === 3 ? 'bg-neon-green' : 'bg-gray-500'}
                                ${isMovable ? 'scale-125 ring-2 ring-white shadow-[0_0_10px_white]' : 'scale-100'}
                            `}>
                                <span className="text-[9px] md:text-base">{players[pIdx].avatar}</span>
                            </div>
                        </button>
                    );
                }))}
            </div>
        </div>
        
        <div className="lg:col-span-4 flex flex-col gap-2 md:gap-4 p-2 lg:p-0">
            <div className="bg-card-bg border-4 border-gray-800 p-4 md:p-8 rounded-[2rem] shadow-card-depth flex flex-col items-center gap-4 md:gap-8 relative overflow-hidden group">
                <div className={`w-20 h-20 md:w-28 md:h-28 bg-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-4xl md:text-6xl font-black text-black shadow-2xl transition-all relative
                    ${isRolling ? 'animate-shake scale-110' : 'hover:scale-105'}
                `}>
                    {isRolling ? '?' : dice || <Dices size={40} className="text-gray-200" />}
                </div>
                <button 
                    onClick={rollDice}
                    disabled={turn !== 0 || isRolling || isMoving || !!dice}
                    className={`w-full py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-2xl uppercase italic shadow-pop-orange btn-tactile transition-all
                        ${turn === 0 && !isRolling && !isMoving && !dice ? 'bg-fox-orange text-white' : 'bg-gray-800 text-gray-600 opacity-50'}
                    `}
                >
                    {isRolling ? 'ROLLING...' : dice ? 'MOVE' : 'ROLL'}
                </button>
                <div className="w-full flex flex-col gap-1 bg-black/20 p-3 rounded-xl border border-white/5">
                    {log.map((m, i) => (
                        <div key={i} className={`text-[8px] md:text-[10px] font-black uppercase italic ${i === 0 ? 'text-white' : 'text-white/20'}`}>{m}</div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {gameState === 'RESULT' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
             <div className="bg-card-bg border-4 border-gray-800 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden max-w-sm w-full animate-in zoom-in">
                <Trophy size={64} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-2">VICTORY</h2>
                <div className="text-3xl font-mono font-black text-neon-green mb-8 flex flex-col items-center">
                    <span>+ {testMode.active ? testMode.winAmount.toFixed(2) : (parseFloat(wager) * 3.8).toFixed(2)} SOL</span>
                </div>
                <button 
                    onClick={() => {
                        if (testMode.active) updateBalance(testMode.winAmount);
                        onBack();
                    }} 
                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg uppercase italic shadow-2xl btn-tactile"
                >
                    CLAIM SOL
                </button>
             </div>
        </div>
      )}
    </div>
  );
};

export default LudoGame;
