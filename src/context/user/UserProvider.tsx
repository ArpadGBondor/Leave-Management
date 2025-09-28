import React, { useEffect, useReducer, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  linkWithCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { UserContext, initialUserState } from './UserContext';
import { UserReducer } from './UserReducer';
import User from '../../interface/user.interface';
import {
  SET_LOADING,
  SET_LOGGED_IN,
  SET_USER,
  SET_HAS_PASSWORD,
} from '../types';
import getBase64FromUrl from '../../utils/getBase64FromUrl';

interface Props {
  children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialUserState);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Convert Google photo URL to Base64
        let photoBase64 = '';
        if (user.photoURL) {
          try {
            photoBase64 = await getBase64FromUrl(user.photoURL);
          } catch (err) {
            console.error('Failed to convert photo to base64', err);
          }
        }
        const userDoc: User = {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photo: photoBase64,
          created: Timestamp.now(),
          updated: Timestamp.now(),
        };

        await setDoc(ref, userDoc);
        dispatch({ type: SET_USER, payload: userDoc });
      }
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });

        const userDoc: User = {
          id: cred.user.uid,
          name,
          email: cred.user.email || '',
          photo: cred.user.photoURL || '',
          created: Timestamp.now(),
          updated: Timestamp.now(),
        };

        await setDoc(doc(db, 'users', cred.user.uid), userDoc);
        dispatch({ type: SET_USER, payload: userDoc });
      }
    },
    []
  );

  const logout = () => signOut(auth);

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      if (!state.user) return;

      const updatedFields = { ...data, updated: Timestamp.now() };
      const ref = doc(db, 'users', state.user.id);
      await updateDoc(ref, updatedFields);

      const updatedUser: User = { ...state.user, ...updatedFields };
      dispatch({ type: SET_USER, payload: updatedUser });
    },
    [state.user]
  );

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No user logged in');

      // Build credential with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Reauthenticate
      await reauthenticateWithCredential(user, credential);

      // Now you can update password
      await firebaseUpdatePassword(user, newPassword);
    },
    []
  );

  const addPassword = useCallback(async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('No user logged in');

    try {
      // Create a new email/password credential for the current user
      const credential = EmailAuthProvider.credential(user.email, newPassword);

      // Link the credential to the existing SSO account
      await linkWithCredential(user, credential);

      dispatch({ type: SET_HAS_PASSWORD, payload: true });
      console.log('Password added successfully!');
    } catch (err: any) {
      console.error('Failed to add password', err);
      if (err.code === 'auth/credential-already-in-use') {
        throw new Error('This email is already linked to another account.');
      } else {
        throw err;
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch({ type: SET_LOADING, payload: true });

      if (firebaseUser) {
        dispatch({ type: SET_LOGGED_IN, payload: true });

        // Check if account has a password login
        const hasPassword = firebaseUser.providerData.some(
          (p) => p.providerId === 'password'
        );
        dispatch({ type: SET_HAS_PASSWORD, payload: hasPassword });

        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          dispatch({ type: SET_USER, payload: snap.data() as User });
        } // else we call SET_USER from register and loginWithGoogle functions
      } else {
        dispatch({ type: SET_LOGGED_IN, payload: false });
        dispatch({ type: SET_HAS_PASSWORD, payload: false });
        dispatch({ type: SET_USER, payload: null });
      }

      dispatch({ type: SET_LOADING, payload: false });
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        updatePassword,
        addPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
