import { UserState } from './UserContext';
import User from '../../interface/user.interface';
import { SET_USER, SET_LOADING, SET_LOGGED_IN } from '../types';

export type UserAction =
  | { type: typeof SET_USER; payload: User | null }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_LOGGED_IN; payload: boolean };

export const UserReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_LOGGED_IN:
      return { ...state, loggedIn: action.payload };
    default:
      return state;
  }
};
