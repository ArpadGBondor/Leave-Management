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
import { doc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { UserContext, initialUserState } from './UserContext';
import { UserReducer } from './UserReducer';
import User, { userTypeOptions } from '../../interface/User.interface';
import {
  SET_LOADING,
  SET_LOGGED_IN,
  SET_USER,
  SET_HAS_PASSWORD,
} from '../types';
import getBase64FromUrl from '../../utils/getBase64FromUrl';
import { useLoadingContext } from '../loading/useLoadingContext';
import { firebase_collections } from '../../../lib/firebase_collections';

interface Props {
  children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialUserState);
  const { startLoading, stopLoading } = useLoadingContext();

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    if (cred.user) {
      const ref = doc(db, firebase_collections.USERS, cred.user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Convert Google photo URL to Base64
        let photoBase64 = '';
        if (cred.user.photoURL) {
          try {
            photoBase64 = await getBase64FromUrl(cred.user.photoURL);
          } catch (err) {
            console.error('Failed to convert photo to base64', err);
          }
        }

        const token = await cred.user.getIdToken();
        const createUserResponse = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: cred.user.uid,
            name: cred.user.displayName,
            email: cred.user.email,
            photo: photoBase64,
            userType: userTypeOptions[0],
          }),
        });
        if (!createUserResponse.ok) throw new Error('Failed to save user');
        const { doc } = await createUserResponse.json();

        dispatch({ type: SET_USER, payload: doc });
      }
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string, photo: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });

        const token = await cred.user.getIdToken();
        const updateUserResponse = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: cred.user.uid,
            name,
            email,
            photo,
            userType: userTypeOptions[0],
          }),
        });
        if (!updateUserResponse.ok) throw new Error('Failed to save user');
        const { doc } = await updateUserResponse.json();

        dispatch({ type: SET_USER, payload: doc });
      }
    },
    []
  );

  const logout = () => signOut(auth);

  const updateUser = useCallback(
    async (data: Partial<User>) => {
      if (!state.user) return;

      const token = await auth.currentUser?.getIdToken();

      const setClaimsResponse = await fetch('/api/auth-set-user-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: state.user.id,
          userType: data.userType,
        }),
      });
      if (!setClaimsResponse.ok) throw new Error('Failed to set role');
      const { claims } = await setClaimsResponse.json();

      const updateUserResponse = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          id: state.user.id,
          claims,
        }),
      });
      if (!updateUserResponse.ok) throw new Error('Failed to save user');
      const { doc } = await updateUserResponse.json();

      dispatch({ type: SET_USER, payload: doc });
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      startLoading('user');
      dispatch({ type: SET_LOADING, payload: true });

      if (firebaseUser) {
        dispatch({ type: SET_LOGGED_IN, payload: true });

        // Check if account has a password login
        const hasPassword = firebaseUser.providerData.some(
          (p) => p.providerId === 'password'
        );
        dispatch({ type: SET_HAS_PASSWORD, payload: hasPassword });

        // Listen to Firestore user document for real-time updates
        const userRef = doc(db, firebase_collections.USERS, firebaseUser.uid);
        const unsubscribeUserDoc = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            dispatch({ type: SET_USER, payload: snap.data() as User });
          } else {
            // The document might not exist yet (e.g., right after registration)
            dispatch({ type: SET_USER, payload: null });
          }
          dispatch({ type: SET_LOADING, payload: false });
          stopLoading('user');
        });

        // Return this unsubscribe when auth changes
        return unsubscribeUserDoc;
      } else {
        dispatch({ type: SET_LOGGED_IN, payload: false });
        dispatch({ type: SET_HAS_PASSWORD, payload: false });
        dispatch({ type: SET_USER, payload: null });
        dispatch({ type: SET_LOADING, payload: false });
        stopLoading('user');
      }
    });

    return unsubscribeAuth;
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
