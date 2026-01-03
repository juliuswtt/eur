
import { Game, ShopItem } from './types';

/**
 * === MASTER BANK CONFIG ===
 */
export const MASTER_WALLET_ADDRESS = "Ct63e3zhh3NebJKQF2C19UHQXoamXvHyiffuLbSQiNLf";

export const DEPOSIT_STEPS = [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 50, 100];

// Aktueller SOL Preis für interne Berechnungen
export const SOL_PRICE = 135.42; 

// Assets & Bilder
export const IMG_MARKET = "https://media.discordapp.net/attachments/1286369837534150741/1453432468936982744/Gemini_Generated_Image_pwxlmupwxlmupwxl.png?ex=6950b9b8&is=694f6838&hm=43315dbd6f8159d5fc303d80c4cc521555b2908b62d21b27f5047f93b7d92406&=&format=webp&quality=lossless&width=1994&height=1994"; 
export const IMG_MIAMI = "https://media.discordapp.net/attachments/1286369837534150741/1454494129957638295/Gemini_Generated_Image_shgfd1shgfd1shgf.png?ex=69514ab7&is=694ff937&hm=2a9ea036d79454721d6e7a82f8e990530c91292d3463aa3b4ce84772c55a624c&=&format=webp&quality=lossless&width=1786&height=1786"; 
export const IMG_UNEMPLOYED = "https://media.discordapp.net/attachments/1286369837534150741/1454494128690958336/Gemini_Generated_Image_6vfmrd6vfmrd6vfm.png?ex=69514ab7&is=694ff937&hm=41b90d635659aae9bef8ceba0c04ea1020f0cb1a22526585c76cf0093c72a463&=&format=webp&quality=lossless&width=1786&height=1786"; 
export const IMG_POKER = "https://media.discordapp.net/attachments/1286369837534150741/1453432317493379082/Gemini_Generated_Image_hi3imshi3imshi3i.png?ex=6950b993&is=694f6813&hm=49c4b3362305d1a7ada57&=&format=webp&quality=lossless&width=1786&height=1786"; 
export const IMG_CONNECT = "https://media.discordapp.net/attachments/1286369837534150741/1453432317878997102/Gemini_Generated_Image_jlqs44jlqs44jlqs.png?ex=6950b994&is=694f6814&hm=d08c6065bff35060ced998b8db73ef40f514cd98bcc598ea82a012a27a3ada57&=&format=webp&quality=lossless&width=1786&height=1786"; 
export const IMG_EPSTEIN = "https://media.discordapp.net/attachments/1286369837534150741/1454494129097543914/Gemini_Generated_Image_janruwjanruwjanr.png?ex=69514ab7&is=694ff937&hm=03897155786e13e1183a627f689b86b6b64309cbaa65b28e97c0b966f7699ebf&=&format=webp&quality=lossless&width=1786&height=1786";
export const IMG_NARCO = "https://media.discordapp.net/attachments/1286369837534150741/1454494130376806583/Gemini_Generated_Image_wq8lcxwq8lcxwq8l.png?ex=69514ab7&is=694ff937&hm=a6b98abd21d94faae519177aef552426c908134e44c9bb8e2d1eac529b0371c7&=&format=webp&quality=lossless&width=1786&height=1786";
export const IMG_VEGAS = "https://media.discordapp.net/attachments/1286369837534150741/1454494129559175190/Gemini_Generated_Image_rxo5svrxo5svrxo5.png?ex=69514ab7&is=694ff937&hm=545a0a89736ead9c1813dd&=&format=webp&quality=lossless&width=1786&height=1786";
export const IMG_HERO_BANNER = "https://media.discordapp.net/attachments/1286369837534150741/1455519884690854032/Gemini_Generated_Image_uwb2w0uwb2w0uwb2.png?ex=69550606&is=6953b486&hm=2edc662843f7232303dfee15e9127d996c320c9b86c113637fe1274cf0324d0c&=&format=webp&quality=lossless"; 

export const IMG_LUDO = "https://images.unsplash.com/photo-1611992437393-794695663740?q=80&w=2070&auto=format&fit=crop"; 
export const IMG_MAUMAU = "https://images.unsplash.com/photo-1543508282-5c1f427f023f?q=80&w=2030&auto=format&fit=crop";
export const IMG_ESTATE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop";

export const SHOP_CATALOG: ShopItem[] = [
  { id: 'skin_neon', name: 'Neon Alpha', description: 'Glow in the dark, hunt in the light.', price: 5.5, image: 'https://api.dicebear.com/7.x/big-smile/svg?seed=NeonAlpha&backgroundColor=b6e3f4', type: 'skin', rarity: 'legendary' },
  { id: 'skin_gold', name: 'Golden Eura', description: 'Pure 24K digital gold fur.', price: 12.0, image: 'https://api.dicebear.com/7.x/big-smile/svg?seed=GoldenEuras&backgroundColor=f59e0b', type: 'skin', rarity: 'legendary' },
  { id: 'skin_cyber', name: 'Cyber Wolf', description: 'Augmented for maximum betting efficiency.', price: 2.5, image: 'https://api.dicebear.com/7.x/big-smile/svg?seed=CyberWolf&backgroundColor=1e293b', type: 'skin', rarity: 'epic' },
  { id: 'skin_hype', name: 'Hype Beast', description: 'Always rocking the latest drop.', price: 1.0, image: 'https://api.dicebear.com/7.x/big-smile/svg?seed=HypeBeast&backgroundColor=ffdfbf', type: 'skin', rarity: 'rare' },
  { id: 'eff_fire', name: 'Inferno Glow', description: 'Sets your username on fire.', price: 1.5, image: '🔥', type: 'effect', rarity: 'rare' },
  { id: 'eff_rainbow', name: 'RGB Matrix', description: 'Cycling colors for your name.', price: 3.0, image: '🌈', type: 'effect', rarity: 'epic' },
  { id: 'eff_glitch', name: 'Void Glitch', description: 'Distorted reality effect.', price: 5.0, image: '👾', type: 'effect', rarity: 'legendary' },
  { id: 'emo_lfg', name: 'LFG Paws', description: 'Let\'s freaking go!', price: 0.25, image: '🚀', type: 'emote', rarity: 'common' },
  { id: 'emo_rekt', name: 'Rekt Eura', description: 'When the market dumps...', price: 0.25, image: '📉', type: 'emote', rarity: 'common' },
  { id: 'emo_diamond', name: 'Diamond Paws', description: 'Strong hands only.', price: 0.5, image: '💎', type: 'emote', rarity: 'rare' },
];

export const MOCK_STREAMERS = [
  { name: 'X-Degen-Alpha', playing: 'Market Royale' },
  { name: 'Sly_Fox_Casino', playing: 'Fox Cards' },
  { name: 'Whale_Bull_88', playing: 'Texas Hold\'em' },
  { name: 'Wise_Owl_SOL', playing: 'Euras Estate' },
  { name: 'Moon_Shot_Lizard', playing: 'Ludo Royale' },
];

export const GAMES: Game[] = [
  { id: 'market-royale', name: 'Market Royale', description: '10 Players Arena. Predict the Pump. Win the Pot.', image: IMG_MARKET, online: 2105, type: 'hybrid', category: 'pvp' },
  { id: 'neon-holdem', name: 'Texas Hold\'em', description: 'PvP Poker Duel. High Stakes. Skill & Bluffs.', image: IMG_POKER, online: 1243, type: 'skill', category: 'pvp' },
  { id: 'cyber-connect', name: 'Cyber Connect', description: 'PvP Strategy. Connect 4 to claim the SOL.', image: IMG_CONNECT, online: 856, type: 'skill', category: 'pvp' },
  { id: 'euras-race', name: 'Ludo Royale', description: '4 Player Board Brawl. Race your pieces home.', image: IMG_LUDO, online: 542, type: 'luck', category: 'pvp' },
  { id: 'fox-cards', name: 'Mau Mau', description: 'Classic card strategy. First to empty wins.', image: IMG_MAUMAU, online: 320, type: 'skill', category: 'pvp' },
  { id: 'euras-estate', name: 'Euras Estate', description: 'PvP Monopoly Style. Buy. Trade. Ruin the rest.', image: IMG_ESTATE, online: 184, type: 'board', category: 'pvp' },
  { id: 'miami-tycoon', name: 'Miami Simulator', description: 'Live the life of a high-rolling crypto guru in Miami.', image: IMG_MIAMI, online: 4321, type: 'tycoon', category: 'solo' },
  { id: 'unemployment-sim', name: 'Unemployment Sim', description: 'Fake productivity. Hide your degen lifestyle.', image: IMG_UNEMPLOYED, online: 1542, type: 'meme', category: 'solo' },
  { id: 'the-island', name: 'The Island', description: 'Stealth mission. Find the list. Avoid detection.', image: IMG_EPSTEIN, online: 892, type: 'story', category: 'solo' },
  { id: 'narco-fox', name: 'Narco Euras', description: 'Build your empire. Run the border. Wash the cash.', image: IMG_NARCO, online: 2314, type: 'rpg', category: 'solo' },
  { id: 'vegas-degenerate', name: 'Vegas Night', description: 'POV Streamer life. Flex your wallet. Go viral.', image: IMG_VEGAS, online: 942, type: 'rpg', category: 'solo' },
];
