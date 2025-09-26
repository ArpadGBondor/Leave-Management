import React, { useEffect, useReducer, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
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
import { SET_LOADING, SET_LOGGED_IN, SET_USER } from '../types';

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
        const userDoc: User = {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photo: user.photoURL || '',
          timestamp: Timestamp.now(),
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
          timestamp: serverTimestamp() as any,
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

      const ref = doc(db, 'users', state.user.id);
      await updateDoc(ref, data);

      const updatedUser: User = { ...state.user, ...data };
      dispatch({ type: SET_USER, payload: updatedUser });
    },
    [state.user]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch({ type: SET_LOADING, payload: true });

      if (firebaseUser) {
        dispatch({ type: SET_LOGGED_IN, payload: true });

        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          dispatch({ type: SET_USER, payload: snap.data() as User });
        } // else we call SET_USER from register and loginWithGoogle functions
      } else {
        dispatch({ type: SET_LOGGED_IN, payload: false });
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
