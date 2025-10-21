import { createContext } from 'react';
import User from '../../interface/User.interface';

export interface UserState {
  user: User | null;
  loading: boolean;
  loggedIn: boolean;
  hasPassword: boolean;
}

export interface UserContextValue extends UserState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    photo: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { id: string } & Partial<User>) => Promise<void>;
  deleteUser: (data: { id: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  addPassword: (newPassword: string) => Promise<void>;
}

export const initialUserState: UserState = {
  user: null,
  loading: true,
  loggedIn: false,
  hasPassword: false,
};

export const UserContext = createContext<UserContextValue>({
  ...initialUserState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
  loginWithGoogle: async () => {},
  updatePassword: async () => {},
  addPassword: async () => {},
});
