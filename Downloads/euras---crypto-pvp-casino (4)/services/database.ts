
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, setDoc, doc, Firestore, initializeFirestore } from 'firebase/firestore';
import { User } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCypiZSKPPJyLAIUbNJK3gFIXl2J6dAygE",
  authDomain: "euras-4012f.firebaseapp.com",
  projectId: "euras-4012f",
  storageBucket: "euras-4012f.firebasestorage.app",
  messagingSenderId: "455984089800",
  appId: "1:455984089800:web:ff07dfc7855c4523d3f3fd"
};

/**
 * Initialisiert Firestore sicher für den Live-Betrieb.
 */
const initDb = (): Firestore | null => {
  try {
    const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Nutze initializeFirestore für maximale Stabilität in Web-Browsern
    return initializeFirestore(app, {});
  } catch (error) {
    console.error("❌ Firebase Cloud Connection Error:", error);
    return null;
  }
};

const USERS_COLLECTION = 'users';
const cleanKey = (key: string) => key?.replace(/[^A-Z0-9]/gi, "").toUpperCase().trim() || "";

/**
 * Synchronisiert den lokalen User-Status mit der Euras Google Cloud.
 */
export const registerUserInCloud = async (user: User): Promise<boolean> => {
    if (!user || !user.id) return false;
    const db = initDb();
    if (!db) return false;

    try {
        const userRef = doc(db, USERS_COLLECTION, user.id);
        const sanitizedUser = {
            ...user,
            profileKey: cleanKey(user.profileKey),
            securityKey: cleanKey(user.securityKey),
            lastSync: Date.now()
        };

        await setDoc(userRef, sanitizedUser, { merge: true });
        console.log("✅ Euras Cloud: Den synchronized.");
        return true;
    } catch (error) {
        console.error("❌ Cloud Sync Failed:", error);
        return false;
    }
};

/**
 * Lädt einen bestehenden Account über die Euras Keys aus der Cloud.
 */
export const loginWithEurasKeys = async (profileKey: string, securityKey: string): Promise<User | null> => {
    const pKey = cleanKey(profileKey);
    const sKey = cleanKey(securityKey);
    if (pKey.length < 10 || sKey.length < 5) return null;

    const db = initDb();
    if (!db) return null;

    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(
            usersRef, 
            where("profileKey", "==", pKey), 
            where("securityKey", "==", sKey)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            console.log("✅ Account restored from Euras Cloud.");
            return querySnapshot.docs[0].data() as User;
        }
        return null;
    } catch (error) {
        console.error("❌ Cloud Login Error:", error);
        return null;
    }
};
