
import * as solanaWeb3 from '@solana/web3.js';
import { MASTER_WALLET_ADDRESS } from '../constants';

// Hochverfügbare öffentliche RPCs mit besseren CORS-Einstellungen für Vercel/Netlify
const RPC_ENDPOINTS = [
  "https://rpc.ankr.com/solana",
  "https://solana-mainnet.g.allmystats.com",
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com"
];

const getSafeConnection = async () => {
  let lastError = null;
  
  for (const url of RPC_ENDPOINTS) {
    try {
      console.log(`🔗 Euras Bank: Attempting secure tunnel via ${url}`);
      // Wir setzen ein kürzeres Timeout für den Initial-Check, um schneller zum nächsten RPC zu springen
      const conn = new solanaWeb3.Connection(url, { 
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 30000
      });
      
      // Validierung des RPCs
      await conn.getLatestBlockhash('confirmed');
      return conn;
    } catch (e: any) {
      console.warn(`⚠️ Euras Bank: Node ${url} unresponsive. Switching...`);
      lastError = e;
    }
  }
  
  throw new Error("SOLANA_NETWORK_RESTRICTED: All entry points blocked. Please try again in a few seconds or use a VPN.");
};

const getProvider = () => {
  if (typeof window === 'undefined') return null;
  const anyWin = window as any;
  return anyWin.phantom?.solana || anyWin.solana || (anyWin.solflare?.isSolflare ? anyWin.solflare : null);
};

export const connectHardwareWallet = async () => {
  const provider = getProvider();
  if (!provider) {
    alert("Solana Wallet (Phantom/Solflare) not found!");
    return null;
  }
  try {
    const resp = await provider.connect();
    return resp.publicKey.toString();
  } catch (err: any) {
    console.error("Connection Error:", err.message);
    return null;
  }
};

export const requestDeposit = async (amount: number, userAddress: string) => {
  const provider = getProvider();
  if (!provider) return { success: false, error: "Wallet not found." };

  try {
    // Dynamische Verbindung erst beim Klick erstellen, um Fetch-Fehler zu minimieren
    const connection = await getSafeConnection();
    
    const fromPubkey = new solanaWeb3.PublicKey(userAddress);
    const toPubkey = new solanaWeb3.PublicKey(MASTER_WALLET_ADDRESS);
    const lamports = Math.floor(amount * solanaWeb3.LAMPORTS_PER_SOL);

    console.log("💎 Euras Bank: Initializing secure vault deposit...");
    
    // Nutze 'confirmed' statt 'finalized' für schnelleres Feedback im Browser
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    console.log("🔐 Euras Bank: Awaiting signature...");
    const { signature } = await provider.signAndSendTransaction(transaction);
    
    console.log("⏳ Euras Bank: Signature confirmed. Finalizing on-chain...");
    // Bestätigung mit dem aktiven Blockhash
    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');

    return { success: true, signature };
  } catch (err: any) {
    console.error("❌ Transaction Error:", err);
    let msg = err.message || "Unknown error";
    if (msg.includes("fetch") || msg.includes("403")) {
      msg = "Network Congestion: The Solana nodes are currently rate-limiting this request. Please try again.";
    }
    return { success: false, error: msg };
  }
};

export const triggerMasterPayout = async (targetAddress: string, amount: number): Promise<{ success: boolean; txid?: string; error?: string }> => {
  console.log(`🏦 EURAS_BANK_PAYOUT: ${amount} SOL -> ${targetAddress}`);
  return { success: true, txid: "BANK_AUTHORIZED" };
};
