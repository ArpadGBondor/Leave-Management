import { LOADING_START, LOADING_STOP } from '../types';

export type LoadingState = {
  active: Set<string>;
};

export type LoadingAction =
  | { type: typeof LOADING_START; key: string }
  | { type: typeof LOADING_STOP; key: string };

export const loadingReducer = (
  state: LoadingState,
  action: LoadingAction
): LoadingState => {
  switch (action.type) {
    case LOADING_START: {
      const newSet = new Set(state.active);
      newSet.add(action.key);
      return { active: newSet };
    }
    case LOADING_STOP: {
      const newSet = new Set(state.active);
      newSet.delete(action.key);
      return { active: newSet };
    }
    default:
      return state;
  }
};
