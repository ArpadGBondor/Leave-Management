export type LoadingState = {
  active: Set<string>;
};

export type LoadingAction =
  | { type: 'START'; key: string }
  | { type: 'STOP'; key: string };

export const loadingReducer = (
  state: LoadingState,
  action: LoadingAction
): LoadingState => {
  switch (action.type) {
    case 'START': {
      const newSet = new Set(state.active);
      newSet.add(action.key);
      return { active: newSet };
    }
    case 'STOP': {
      const newSet = new Set(state.active);
      newSet.delete(action.key);
      return { active: newSet };
    }
    default:
      return state;
  }
};
