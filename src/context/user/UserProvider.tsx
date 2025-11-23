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
  sendPasswordResetEmail,
} from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { UserContext, initialUserState } from './UserContext';
import { UserReducer } from './UserReducer';
import User, { userTypeOptions } from '../../interface/User.interface';
import {
  SET_LOADING,
  SET_LOGGED_IN,
  SET_USER,
  SET_HAS_PASSWORD,
  SET_USER_COUNT,
} from '../types';
import getBase64FromUrl from '../../utils/getBase64FromUrl';
import { useLoadingContext } from '../loading/useLoadingContext';
import { firebase_collections } from '../../../lib/firebase_collections';
import { useFirebase } from '../../hooks/useFirebase';

interface Props {
  children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducer, initialUserState);
  const { startLoading, stopLoading } = useLoadingContext();
  const firebase = useFirebase();
  const db = firebase?.db;
  const auth = firebase?.auth;

  const login = useCallback(
    async (email: string, password: string) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      await signInWithEmailAndPassword(auth, email, password);
    },
    [auth]
  );

  const loginWithGoogle = useCallback(async () => {
    if (!auth || !db) throw new Error('Firebase not loaded yet');
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
  }, [auth, db]);

  const register = useCallback(
    async (email: string, password: string, name: string, photo: string) => {
      if (!auth) throw new Error('Firebase not loaded yet');
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
    [auth]
  );

  const logout = useCallback(async () => {
    if (!auth) throw new Error('Firebase not loaded yet');
    await signOut(auth);
  }, [auth]);
  /**
   * id always needs to be passed, this way the
   * function can update any user, not just the
   * currently logged in one.
   */
  const updateUser = useCallback(
    async (data: { id: string } & Partial<User>) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const setClaimsResponse = await fetch('/api/auth-set-user-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: data.id,
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
          id: data.id,
          claims,
        }),
      });
      if (!updateUserResponse.ok) throw new Error('Failed to save user');
      const { doc } = await updateUserResponse.json();
      // Only update state if logged in user got updated
      if (data.id === state?.user?.id) {
        dispatch({ type: SET_USER, payload: doc });
      }
    },
    [state?.user, auth?.currentUser]
  );

  /**
   * id always needs to be passed, this way the
   * function can delete any user, not just the
   * currently logged in one.
   */
  const deleteUser = useCallback(
    async (data: { id: string }) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');
      const token = await currentUser.getIdToken();

      const updateUserResponse = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: data.id,
        }),
      });
      if (!updateUserResponse.ok) throw new Error('Failed to delete user');
      // Log out if current user got deleted
      if (data.id === state?.user?.id) {
        await signOut(auth);
      }
    },
    [state?.user, auth?.currentUser]
  );

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!auth) throw new Error('Firebase not loaded yet');
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
    [auth?.currentUser]
  );

  const addPassword = useCallback(
    async (newPassword: string) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No user logged in');

      try {
        // Create a new email/password credential for the current user
        const credential = EmailAuthProvider.credential(
          user.email,
          newPassword
        );

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
    },
    [auth?.currentUser]
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      if (!auth) throw new Error('Firebase not loaded yet');
      await sendPasswordResetEmail(auth, email);
    },
    [auth]
  );

  useEffect(() => {
    if (!db || !auth) return;
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

    const usersRef = collection(db, firebase_collections.USERS);
    const unsubscribeUsers = onSnapshot(usersRef, (snap) => {
      const userCount = snap.docs.length;
      dispatch({ type: SET_USER_COUNT, payload: userCount });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, [auth, db]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        deleteUser,
        updatePassword,
        addPassword,
        forgotPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
