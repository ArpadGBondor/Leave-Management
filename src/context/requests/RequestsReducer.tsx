import { SET_REQUEST_COUNT } from '../types';

export type RequestsState = {
  requestCount: number;
};

export type RequestsAction = {
  type: typeof SET_REQUEST_COUNT;
  payload: number;
};

export const RequestsReducer = (
  state: RequestsState,
  action: RequestsAction
): RequestsState => {
  switch (action.type) {
    case SET_REQUEST_COUNT:
      return { ...state, requestCount: action.payload };
    default:
      return state;
  }
};
