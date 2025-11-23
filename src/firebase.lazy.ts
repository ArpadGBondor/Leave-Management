let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;

export async function getFirebase() {
  if (firebaseApp) {
    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb };
  }

  // Dynamically import Firebase modules
  const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
  ]);

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APP_ID,
  };

  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb };
}
