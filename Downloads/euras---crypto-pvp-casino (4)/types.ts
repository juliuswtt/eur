
export interface ConnectedWallet {
  address: string;
  provider: 'Phantom' | 'Solflare' | 'Backpack';
  addedAt: number;
}

export interface User {
  id: string; // Interne Datenbank ID
  username: string; // Display Name (z.B. User 402)
  profileKey: string; // 16-stelliger Login-Key
  securityKey: string; // 10-stelliger Geheim-Key
  wallets: ConnectedWallet[]; // Liste aller verknüpften Wallets
  activeWallet: string; // Aktuell genutzte Adresse
  balance: number; // In SOL
  avatar: string;
  ownedItemIds: string[];
  equipped: {
    pfp: string | null;
    effect: string | null;
    emotes: string[];
  };
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number; 
  image: string;
  type: 'skin' | 'effect' | 'emote';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  online: number;
  type: 'luck' | 'skill' | 'hybrid' | 'tycoon' | 'meme' | 'rpg' | 'story' | 'board';
  category: 'pvp' | 'solo'; 
}

export enum ViewState {
  LOBBY = 'LOBBY',
  GAME_POKER = 'GAME_POKER',
  GAME_CONNECT4 = 'GAME_CONNECT4',
  GAME_MARKET = 'GAME_MARKET',
  GAME_LUDO = 'GAME_LUDO',
  GAME_MAUMAU = 'GAME_MAUMAU',
  GAME_ESTATE = 'GAME_ESTATE',
  GAME_TYCOON = 'GAME_TYCOON',
  GAME_UNEMPLOYMENT = 'GAME_UNEMPLOYMENT',
  GAME_EPSTEIN = 'GAME_EPSTEIN',
  GAME_NARCO = 'GAME_NARCO',
  GAME_VEGAS = 'GAME_VEGAS',
  LEADERBOARD = 'LEADERBOARD',
  PARTNER_AMBASSADOR = 'PARTNER_AMBASSADOR',
  PARTNER_AFFILIATE = 'PARTNER_AFFILIATE',
  PARTNER_CREATOR = 'PARTNER_CREATOR',
  VAULT = 'VAULT',
  MY_PACK = 'MY_PACK',
  PROFILE_SETTINGS = 'PROFILE_SETTINGS'
}
