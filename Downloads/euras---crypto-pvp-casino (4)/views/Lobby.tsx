
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { GAMES, MOCK_STREAMERS, IMG_HERO_BANNER } from '../constants';
import { Play, Users, Sun, Star, Loader2, Sparkles, Map, Truck, Skull, Music, Sword, Coins, Zap, Search, LayoutGrid, Flame, TrendingUp, Trophy } from 'lucide-react';

const StableImage: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string; 
  containerClassName?: string;
  fit?: 'cover' | 'contain' | 'natural';
}> = ({ src, alt, className, containerClassName, fit = 'cover' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (src === 'X' || !src) return;
    setIsLoaded(false);
    setHasError(false);
    
    const img = new Image();
    const finalUrl = retryKey > 0 ? `${src}&v=${retryKey}` : src;
    
    img.src = finalUrl;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      if (retryKey < 2) {
        setTimeout(() => setRetryKey(prev => prev + 1), 1500);
      } else {
        setHasError(true);
      }
    };
  }, [src, retryKey]);

  if (src === 'X' || !src) {
    return (
      <div className={`bg-slate-900 flex items-center justify-center min-h-[100px] ${containerClassName}`}>
        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center px-2">Asset Missing</span>
      </div>
    );
  }

  return (
    <div className={`relative bg-slate-950 flex items-center justify-center overflow-hidden ${containerClassName}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
          <Loader2 className="text-fox-orange animate-spin" size={16} />
        </div>
      )}
      
      {hasError ? (
        <div className="flex flex-col items-center justify-center bg-slate-900 p-4 text-center w-full">
          <Star className="text-gray-700 mb-1" size={14} />
          <span className="text-[8px] font-bold text-gray-600 uppercase">Error</span>
        </div>
      ) : (
        <img 
          src={retryKey > 0 ? `${src}&v=${retryKey}` : src} 
          alt={alt}
          className={`${className} transition-all duration-700 ${
            fit === 'natural' ? 'w-full h-auto block' : 
            fit === 'contain' ? 'w-full h-full object-contain' : 
            'w-full h-full object-cover'
          } ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        />
      )}
    </div>
  );
};

interface LobbyProps {
  onChangeView: (view: ViewState) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onChangeView }) => {
  const pvpGames = GAMES.filter(g => g.category === 'pvp');
  const soloGames = GAMES.filter(g => g.category === 'solo');

  const handleGameNavigation = (id: string) => {
    if (id === 'market-royale') onChangeView(ViewState.GAME_MARKET);
    else if (id === 'neon-holdem') onChangeView(ViewState.GAME_POKER);
    else if (id === 'cyber-connect') onChangeView(ViewState.GAME_CONNECT4);
    else if (id === 'euras-race') onChangeView(ViewState.GAME_LUDO);
    else if (id === 'fox-cards') onChangeView(ViewState.GAME_MAUMAU);
    else if (id === 'euras-estate') onChangeView(ViewState.GAME_ESTATE);
    else if (id === 'miami-tycoon') onChangeView(ViewState.GAME_TYCOON);
    else if (id === 'unemployment-sim') onChangeView(ViewState.GAME_UNEMPLOYMENT);
    else if (id === 'the-island') onChangeView(ViewState.GAME_EPSTEIN);
    else if (id === 'narco-fox') onChangeView(ViewState.GAME_NARCO);
    else if (id === 'vegas-degenerate') onChangeView(ViewState.GAME_VEGAS);
  };

  const getPvpBadge = (id: string) => {
    if (id === 'market-royale') return { text: '🔥 HOT', color: 'bg-neon-red' };
    if (id === 'neon-holdem') return { text: '🃏 HIGH STAKES', color: 'bg-brand-purple' };
    if (id === 'euras-estate') return { text: '🏦 TYCOON', color: 'bg-fox-orange' };
    if (id === 'cyber-connect') return { text: '🧠 SKILL', color: 'bg-neon-blue' };
    return { text: '⚔️ PVP', color: 'bg-emerald-500' };
  };

  return (
    <div className="space-y-16 pb-24 max-w-[1400px] mx-auto">
      
      <div className="relative rounded-[2.5rem] overflow-hidden min-h-[350px] md:h-[450px] bg-slate-950 shadow-2xl group cursor-default border border-white/5">
        <div className="absolute inset-0 opacity-40 blur-2xl scale-125">
           <StableImage src={IMG_HERO_BANNER} alt="" className="w-full h-full" fit="cover" />
        </div>
        
        <div className="absolute inset-0 flex items-center justify-end p-4 md:p-8 pr-12 hidden md:flex">
            <StableImage 
              src={IMG_HERO_BANNER} 
              alt="Euras World" 
              containerClassName="w-[60%] h-[90%] rounded-[2rem] shadow-[0_0_50px_rgba(245,158,11,0.2)] border-2 border-white/10"
              className="transition-transform duration-[10s] group-hover:scale-110" 
              fit="cover"
            />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/5 z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-red text-white font-black text-[9px] uppercase rounded-full shadow-pop-red tracking-widest animate-pulse">
               <Flame size={10} fill="currentColor" /> High Stakes PvP
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-fox-orange text-white font-black text-[9px] uppercase rounded-full shadow-pop-orange tracking-widest">
               <Coins size={10} fill="currentColor" /> Provably Fair
            </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter uppercase italic leading-[0.85] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            DOMINATE <br/> 
            <span className="text-fox-orange">THE PACK</span>
          </h1>
          
          <p className="text-gray-400 text-sm font-bold mb-10 uppercase tracking-[0.2em] leading-relaxed hidden md:block max-w-md italic">
            Win Big. Flex Hard. The ultimate underground playground for high rollers. No house, just PvP.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleGameNavigation('market-royale')}
              className="bg-white text-black font-black px-12 py-5 rounded-2xl shadow-pop-blue btn-tactile hover:bg-gray-100 transition-colors flex items-center gap-3 text-lg uppercase italic tracking-tighter"
            >
              <TrendingUp size={22} className="text-neon-green" /> JOIN ARENA
            </button>
            <button 
              onClick={() => onChangeView(ViewState.VAULT)}
              className="bg-slate-900/80 backdrop-blur-md text-fox-orange border border-fox-orange/30 font-black px-8 py-5 rounded-2xl shadow-pop-orange btn-tactile hover:bg-slate-800 transition-colors flex items-center gap-2 text-lg uppercase italic tracking-tighter"
            >
              UPGRADE IDENTITY
            </button>
          </div>
        </div>

        <div className="absolute top-10 right-10 hidden lg:block pointer-events-none">
            <div className="bg-neon-green/10 backdrop-blur-xl border border-neon-green/30 p-4 rounded-3xl animate-float">
                <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">Last Big Win</div>
                <div className="text-2xl font-black text-white italic">+142.50 SOL</div>
            </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-4xl font-black text-white inline-flex items-center gap-4 uppercase italic tracking-tighter">
              <Sword size={32} className="text-neon-green" fill="currentColor" />
              PvP Battlegrounds
            </h2>
            <div className="hidden sm:flex items-center gap-4 text-[11px] font-black text-gray-500 uppercase tracking-widest bg-deep-black/50 px-6 py-3 rounded-full border border-white/5 shadow-inner">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                 <span>{pvpGames.reduce((acc, g) => acc + g.online, 0).toLocaleString()} Active Wolves</span>
               </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {pvpGames.map((game) => {
            const badge = getPvpBadge(game.id);
            return (
              <div 
                key={game.id}
                onClick={() => handleGameNavigation(game.id)}
                className="bg-card-bg rounded-[2.5rem] overflow-hidden border border-gray-800/50 shadow-card-depth hover:-translate-y-3 hover:border-neon-green/40 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.2)] transition-all duration-500 cursor-pointer group flex flex-col relative"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <StableImage src={game.image} alt={game.name} fit="cover" className="group-hover:scale-110 transition-transform duration-[1.5s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent opacity-80"></div>
                  
                  <div className={`absolute top-5 left-5 ${badge.color} text-white text-[9px] font-black px-3 py-1.5 rounded-xl shadow-2xl uppercase tracking-widest italic flex items-center gap-2 border border-white/20`}>
                    {badge.text}
                  </div>
                  
                  <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 text-[10px] font-black text-gray-300 flex items-center gap-2">
                    <Users size={12} className="text-neon-green" /> {game.online}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-neon-green transition-colors">{game.name}</h3>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-neon-green/10 transition-all">
                      <TrendingUp size={16} className="text-neon-green" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                    {game.description}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Trophy size={14} className="text-fox-orange" /> Provably Fair
                    </div>
                    <span className="text-[10px] font-black text-neon-green uppercase tracking-widest bg-neon-green/5 px-3 py-1 rounded-lg">PLAY NOW</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl md:text-3xl font-black text-white inline-flex items-center gap-4 uppercase italic tracking-tighter">
              <div className="w-2 h-8 bg-brand-purple rounded-full shadow-[0_0_15px_#8b5cf6]"></div>
              Euras Originals
            </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {soloGames.map((game) => (
            <div 
              key={game.id}
              onClick={() => handleGameNavigation(game.id)}
              className="bg-card-bg rounded-[2rem] overflow-hidden border border-gray-800/50 shadow-card-depth hover:-translate-y-2 hover:border-brand-purple/40 transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                 <StableImage src={game.image} alt={game.name} fit="cover" className="group-hover:scale-110 transition-transform duration-[1s]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-card-bg/90 via-transparent to-transparent opacity-60"></div>
                 <div className="absolute top-4 right-4 bg-brand-purple text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-xl uppercase tracking-widest italic">{game.type}</div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-base md:text-lg font-black text-white mb-1 uppercase italic tracking-tighter truncate group-hover:text-brand-purple transition-colors">{game.name}</h3>
                <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                   <Zap size={12} className="text-brand-purple" fill="currentColor"/> {game.online} Playing
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-10 shadow-inner">
        <h2 className="text-xl font-black text-white flex items-center gap-3 mb-8 uppercase tracking-tighter italic">
          <div className="w-2 h-6 bg-neon-red rounded-full shadow-[0_0_15px_#f43f5e]"></div>
          Live from the Den
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
          {MOCK_STREAMERS.map((streamer, idx) => (
            <div key={idx} className="min-w-[260px] bg-deep-black rounded-[2rem] border border-white/5 group snap-start transition-all hover:border-fox-orange/30 overflow-hidden shadow-2xl">
              <div className="relative w-full h-32 bg-slate-900/50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <img src={`https://api.dicebear.com/7.x/big-smile/svg?seed=${streamer.name}`} className="w-full h-full object-cover blur-sm" />
                </div>
                <Users className="text-white/10 relative z-10" size={48} />
                <div className="absolute top-3 left-3 bg-neon-red text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-xl uppercase tracking-widest italic animate-pulse">Live</div>
              </div>
              <div className="p-4 bg-card-bg">
                <h3 className="font-black text-white text-sm truncate uppercase tracking-tighter italic group-hover:text-fox-orange transition-colors">{streamer.name}</h3>
                <p className="text-[10px] text-gray-500 font-black mt-1 uppercase truncate">Slaying at <span className="text-fox-orange italic">{streamer.playing}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Lobby;
