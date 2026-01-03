
import React, { useState } from 'react';
import { User } from '../types';
import { requestDeposit, triggerMasterPayout } from '../services/solana';
import { registerUserInCloud } from '../services/database';
import { Coins, ArrowDownCircle, ArrowUpCircle, Loader2, AlertCircle, Check, RefreshCw, Shield } from 'lucide-react';

interface BankModalProps {
  user: User;
  onClose: () => void;
  onUpdateBalance: (amount: number) => void;
}

const BankModal: React.FC<BankModalProps> = ({ user, onClose, onUpdateBalance }) => {
  const [tab, setTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [amount, setAmount] = useState<number>(0.1);
  const [status, setStatus] = useState<'IDLE' | 'SIGNING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAction = async () => {
    setErrorMsg(null);
    setStatus('SIGNING');
    
    try {
        if (tab === 'DEPOSIT') {
            const result = await requestDeposit(amount, user.activeWallet);
            if (result.success) {
                setStatus('SUCCESS');
                onUpdateBalance(amount);
                // Sofortiger Sync mit Cloud
                await registerUserInCloud({ ...user, balance: user.balance + amount });
            } else {
                setErrorMsg(result.error || "Transaktion abgebrochen.");
                setStatus('ERROR');
            }
        } else {
            if (user.balance < amount) {
                setErrorMsg("Nicht genug Guthaben auf dem Euras-Konto!");
                setStatus('ERROR');
                return;
            }
            setStatus('CONFIRMING');
            const result = await triggerMasterPayout(user.activeWallet, amount);
            if (result.success) {
                setStatus('SUCCESS');
                onUpdateBalance(-amount);
                await registerUserInCloud({ ...user, balance: user.balance - amount });
            } else {
                setErrorMsg(result.error || "Auszahlung fehlgeschlagen.");
                setStatus('ERROR');
            }
        }
    } catch (err: any) {
        setErrorMsg(err.message || "Fehler beim Zugriff auf das Solana Netzwerk.");
        setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-card-bg border-4 border-gray-800 rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5 bg-slate-900/50">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-fox-orange/20 rounded-2xl flex items-center justify-center text-fox-orange border-2 border-fox-orange/30 shadow-lg shadow-fox-orange/10">
                    <Coins size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Euras Vault</h2>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Wallet: {user.activeWallet.substring(0,8)}...</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 gap-2 bg-slate-950 mx-8 mt-6 rounded-2xl border border-white/5 shadow-inner">
            <button 
                onClick={() => { setTab('DEPOSIT'); setStatus('IDLE'); }}
                className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${tab === 'DEPOSIT' ? 'bg-neon-green text-black shadow-neon-glow' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <ArrowDownCircle size={14} /> Deposit SOL
            </button>
            <button 
                onClick={() => { setTab('WITHDRAW'); setStatus('IDLE'); }}
                className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${tab === 'WITHDRAW' ? 'bg-neon-red text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <ArrowUpCircle size={14} /> Withdraw SOL
            </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
            {status === 'SIGNING' || status === 'CONFIRMING' ? (
                <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
                    <div className="relative mb-6">
                        <Loader2 size={80} className="text-fox-orange animate-spin opacity-20" />
                        <RefreshCw size={40} className="text-fox-orange animate-spin absolute top-5 left-5" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter text-center">
                        {tab === 'DEPOSIT' ? 'Transaktion signieren' : 'Auszahlung autorisieren'}
                    </h3>
                    <p className="text-gray-500 text-[10px] font-black uppercase mt-4 tracking-widest text-center px-10 leading-relaxed">
                        Bitte öffne dein Wallet-Fenster und bestätige die Übertragung von {amount} SOL an Euras.
                    </p>
                </div>
            ) : status === 'SUCCESS' ? (
                <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
                    <div className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center text-neon-green mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] border-4 border-neon-green">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">TRANSFER OK</h3>
                    <p className="text-neon-green text-xs font-black mt-2 uppercase tracking-widest">Guthaben wurde synchronisiert</p>
                    <button onClick={onClose} className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase italic shadow-2xl btn-tactile">BACK TO THE DEN</button>
                </div>
            ) : status === 'ERROR' ? (
                <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in">
                    <div className="w-20 h-20 bg-neon-red/10 rounded-full flex items-center justify-center text-neon-red mb-6 border-4 border-neon-red/30">
                        <AlertCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">FEHLER</h3>
                    <p className="text-gray-500 text-[10px] font-black mt-2 uppercase tracking-widest text-center max-w-xs">{errorMsg}</p>
                    <button onClick={() => setStatus('IDLE')} className="mt-8 bg-slate-800 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase italic border border-white/5">ERNEUT VERSUCHEN</button>
                </div>
            ) : (
                <>
                    <div className="bg-slate-950 p-8 rounded-[3rem] border-2 border-gray-800 mb-8 shadow-inner relative">
                        <div className="absolute top-4 right-6 text-[8px] font-black text-gray-700 uppercase tracking-widest italic">Den Balance: {user.balance.toFixed(3)} SOL</div>
                        <div className="flex items-center gap-4">
                            <input 
                                type="number" 
                                value={amount} 
                                step="0.01"
                                onChange={e => setAmount(parseFloat(e.target.value))}
                                className="bg-transparent border-none text-white text-6xl font-black font-mono focus:outline-none w-full placeholder:text-gray-800"
                                placeholder="0.0"
                            />
                            <div className="flex flex-col items-end">
                                <span className="text-2xl font-black text-fox-orange italic uppercase neon-text-orange">SOL</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-10">
                        {[0.01, 0.05, 0.1, 0.5, 1, 5, 10, 25].map(s => (
                            <button 
                                key={s} 
                                onClick={() => setAmount(s)}
                                className={`py-3 rounded-xl text-[10px] font-black border transition-all ${amount === s ? 'bg-fox-orange border-fox-orange text-white shadow-lg shadow-fox-orange/20' : 'bg-slate-900 border-gray-800 text-gray-500 hover:text-gray-300'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={handleAction}
                        className={`w-full py-6 rounded-[2rem] font-black text-2xl italic uppercase tracking-tighter shadow-2xl transition-all btn-tactile ${tab === 'DEPOSIT' ? 'bg-neon-green text-black shadow-pop-green' : 'bg-neon-red text-white shadow-pop-red'}`}
                    >
                        {tab === 'DEPOSIT' ? `SEND TO BANK` : `PAYOUT TO WALLET`}
                    </button>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                        <Shield size={12} className="text-gray-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 italic">Secured by Solana Mainnet</span>
                    </div>
                </>
            )}
        </div>

        <div className="p-6 bg-slate-950 border-t border-white/5 flex items-center justify-between">
            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic">Euras Vault V1.4</span>
            <span className="text-[8px] font-black text-emerald-500 uppercase italic">SOLANA LIVE</span>
        </div>

      </div>
    </div>
  );
};

export default BankModal;
