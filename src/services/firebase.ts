import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ChatMessage, UserActivityStats } from '../types';

// Initialize Firebase app once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore targeting the provisioned databaseId
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || '(default)'
);

export const auth = getAuth(app);

// Connection verification test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firestore client offline. Local caching active.');
    }
    return false;
  }
}

// Save chat message to Firestore for persistent history
export async function saveChatMessageToFirestore(
  userId: string,
  message: ChatMessage,
  mode: string,
  gradeLevel: string
) {
  if (!userId) return;
  try {
    const userMsgRef = doc(db, 'users', userId, 'chat_messages', message.id);
    await setDoc(userMsgRef, {
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp,
      mode,
      gradeLevel,
      isOffline: Boolean(message.isOffline),
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore chat save error:', err);
  }
}

// Sync user profile & learning stats to Firestore
export async function syncUserProfileToFirestore(
  userId: string,
  profile: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    stats?: UserActivityStats;
  }
) {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        uid: userId,
        displayName: profile.displayName || 'Student Learner',
        email: profile.email || '',
        photoURL: profile.photoURL || '',
        homeworksSolved: profile.stats?.homeworksSolved || 0,
        mealsSponsored: profile.stats?.mealsSponsored || 0,
        packsDownloaded: profile.stats?.packsDownloaded || 0,
        voiceListens: profile.stats?.voiceListens || 0,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore user profile sync error:', err);
  }
}

// Log meal sponsorship to Firestore ledger
export async function logMealDonationToFirestore(
  donorName: string,
  count: number,
  type: 'direct-sponsor' | 'ad-watch'
) {
  try {
    const donationsRef = collection(db, 'meal_donations');
    await addDoc(donationsRef, {
      donorName: donorName || 'Kind Supporter',
      count: Number(count) || 1,
      type,
      timestamp: new Date().toISOString(),
      serverCreatedAt: Timestamp.now(),
    });
  } catch (err) {
    console.warn('Firestore meal donation log error:', err);
  }
}

// Run connection test silently in background
testFirestoreConnection().catch(() => {});
