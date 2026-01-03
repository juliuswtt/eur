
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { ChevronLeft, Loader2, Trophy, Grid3X3, Zap, Settings, FlaskConical } from 'lucide-react';

interface GameProps {
  user: User | null;
  updateBalance: (amount: number) => void;
  onBack: () => void;
}

const ROWS = 6;
const COLS = 7;
type Player = 1 | 2 | null;

const ConnectFourGame: React.FC<GameProps> = ({ user, updateBalance, onBack }) => {
  const [stage, setStage] = useState<'WAGER' | 'MATCHMAKING' | 'PLAYING' | 'GAMEOVER'>('WAGER');
  const [wager, setWager] = useState('1.0');
  const [board, setBoard] = useState<Player[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);

  const initBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  const startGame = () => {
    setBoard(initBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setStage('PLAYING');
  };

  const handleStartMatch = () => {
    if (!user) return;
    if (parseFloat(wager) > user.balance) return alert("Insufficient SOL");
    updateBalance(-parseFloat(wager));
    setStage('MATCHMAKING');
    setTimeout(() => startGame(), 1500);
  };

  const checkWin = (b: Player[][], player: Player) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (b[r][c] !== player) continue;
        for (const [dr, dc] of directions) {
            let cells: [number, number][] = [[r,c]];
            for (let i = 1; i < 4; i++) {
                const nr = r + dr * i;
                const nc = c + dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc] === player) cells.push([nr, nc]);
                else break;
            }
            if (cells.length === 4) return cells;
        }
      }
    }
    return null;
  };

  const dropPiece = (colIndex: number) => {
    if (stage !== 'PLAYING' || winner) return;
    const newBoard = board.map(row => [...row]);
    let placedRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!newBoard[r][colIndex]) {
            newBoard[r][colIndex] = currentPlayer;
            placedRow = r;
            break;
        }
    }
    if (placedRow === -1) return;
    setBoard(newBoard);
    const winLine = checkWin(newBoard, currentPlayer);
    if (winLine) {
        setWinner(currentPlayer);
        setWinningCells(winLine);
        setStage('GAMEOVER');
        if (currentPlayer === 1) updateBalance(parseFloat(wager) * 1.95);
    } else {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        if (nextPlayer === 2) setTimeout(() => makeBotMove(newBoard), 600);
    }
  };

  const makeBotMove = (currentBoard: Player[][]) => {
     const validCols = [];
     for(let c=0; c<COLS; c++) if(!currentBoard[0][c]) validCols.push(c);
     if(validCols.length > 0) {
         const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
         const nextBoard = currentBoard.map(row => [...row]);
         for (let r = ROWS - 1; r >= 0; r--) {
            if (!nextBoard[r][randomCol]) {
                nextBoard[r][randomCol] = 2;
                break;
            }
         }
         setBoard(nextBoard);
         const winLine = checkWin(nextBoard, 2);
         if(winLine) {
             setWinner(2);
             setWinningCells(winLine);
             setStage('GAMEOVER');
         } else {
             setCurrentPlayer(1);
         }
     }
  };

  if (stage === 'WAGER') {
    return (
      <div className="max-w-md mx-auto bg-card-bg border-4 border-gray-800 rounded-[3rem] p-8 text-center mt-10 shadow-card-depth animate-in zoom-in">
        <Grid3X3 size={64} className="text-neon-blue mx-auto mb-6" />
        <h2 className="text-4xl font-black italic text-white uppercase mb-2">CYBER CONNECT</h2>
        <div className="bg-slate-950 p-6 rounded-3xl border-2 border-gray-800 mb-8 text-left">
           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Wager (SOL)</label>
           <input type="number" value={wager} onChange={e => setWager(e.target.value)} className="w-full bg-transparent border-none text-white text-3xl font-black focus:outline-none" />
        </div>
        <button onClick={handleStartMatch} className="w-full bg-neon-blue text-white py-6 rounded-3xl font-black text-xl shadow-pop-blue btn-tactile uppercase italic">FIND OPPONENT</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center h-full">
       <div className="w-full flex justify-between items-center mb-8 px-4">
         <button onClick={onBack} className="text-gray-500 bg-white/5 p-2 rounded-xl"><ChevronLeft size={24}/></button>
         <div className="flex gap-2">
            <div className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all border-2 ${currentPlayer === 1 ? 'bg-neon-blue/40 text-white border-neon-blue shadow-[0_0_15px_#3b82f6]' : 'bg-slate-800 text-gray-600'}`}>YOU</div>
            <div className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all border-2 ${currentPlayer === 2 ? 'bg-fox-orange/40 text-white border-fox-orange shadow-[0_0_15px_#f59e0b]' : 'bg-slate-800 text-gray-600'}`}>BOT</div>
         </div>
       </div>

       {stage === 'MATCHMAKING' ? (
           <div className="flex flex-col items-center justify-center h-[40vh]">
             <Loader2 size={60} className="text-neon-blue animate-spin mb-8" />
             <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Syncing Nodes...</h3>
           </div>
       ) : (
           <div className="relative w-full max-w-[450px] aspect-[7/6.5] p-4 md:p-6 bg-slate-400 rounded-[30px] border-[12px] border-slate-600 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="grid grid-cols-7 gap-2 md:gap-3 h-full bg-slate-300 p-2 md:p-4 rounded-[20px] shadow-inner">
                 {board.map((row, rIndex) => row.map((cell, cIndex) => {
                    const isWinCell = winningCells.some(([r,c]) => r === rIndex && c === cIndex);
                    return (
                        <div key={`${rIndex}-${cIndex}`} onClick={() => dropPiece(cIndex)} className="w-full aspect-square rounded-full bg-slate-900 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer relative active:scale-90 transition-transform">
                            {cell === 1 && <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-blue-200 via-blue-500 to-blue-800 shadow-[0_0_15px_#3b82f6] border-2 border-white/50"><div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full"></div></div>}
                            {cell === 2 && <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-orange-200 via-orange-500 to-orange-800 shadow-[0_0_15px_#f59e0b] border-2 border-white/50"><div className="absolute top-1 left-2 w-2 h-2 bg-white/40 rounded-full"></div></div>}
                            {isWinCell && <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse shadow-[0_0_20px_white] z-10"></div>}
                        </div>
                    );
                 }))}
              </div>
              {stage === 'GAMEOVER' && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-[20px] p-6 text-center animate-in fade-in duration-500">
                      <Trophy size={60} className={`mb-6 animate-bounce ${winner === 1 ? 'text-neon-blue' : 'text-fox-orange'}`} />
                      <h2 className="text-6xl font-black italic mb-2 text-white uppercase tracking-tighter">{winner === 1 ? 'VICTORY' : 'DEFEAT'}</h2>
                      <p className="text-neon-green text-3xl font-black uppercase mb-8">+ {(parseFloat(wager)*1.95).toFixed(2)} SOL</p>
                      <button onClick={() => setStage('WAGER')} className="bg-white text-black font-black px-12 py-4 rounded-2xl shadow-2xl btn-tactile uppercase italic">REPLAY</button>
                  </div>
              )}
           </div>
       )}
    </div>
  );
};

export default ConnectFourGame;
