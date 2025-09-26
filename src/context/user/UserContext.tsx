import { createContext } from 'react';
import User from '../../interface/user.interface';

export interface UserState {
  user: User | null;
  loading: boolean;
  loggedIn: boolean;
}

export interface UserContextValue extends UserState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

export const initialUserState: UserState = {
  user: null,
  loading: true,
  loggedIn: false,
};

export const UserContext = createContext<UserContextValue>({
  ...initialUserState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  loginWithGoogle: async () => {},
});
