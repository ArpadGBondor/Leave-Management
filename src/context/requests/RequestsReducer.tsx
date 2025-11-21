import {
  SET_OWN_REJECTED_LEAVES_COUNT,
  SET_OWN_APPROVED_LEAVES_COUNT,
  SET_OWN_REQUEST_COUNT,
  SET_MANAGABLE_REQUEST_COUNT,
} from '../types';
import { RequestsState } from './RequestsContext';

export type RequestsAction =
  | { type: typeof SET_OWN_REJECTED_LEAVES_COUNT; payload: number }
  | { type: typeof SET_OWN_APPROVED_LEAVES_COUNT; payload: number }
  | { type: typeof SET_OWN_REQUEST_COUNT; payload: number }
  | { type: typeof SET_MANAGABLE_REQUEST_COUNT; payload: number };

export const RequestsReducer = (
  state: RequestsState,
  action: RequestsAction
): RequestsState => {
  switch (action.type) {
    case SET_OWN_REJECTED_LEAVES_COUNT:
      return { ...state, ownRejectedLeavesCount: action.payload };
    case SET_OWN_APPROVED_LEAVES_COUNT:
      return { ...state, ownApprovedLeavesCount: action.payload };
    case SET_OWN_REQUEST_COUNT:
      return { ...state, ownRequestCount: action.payload };
    case SET_MANAGABLE_REQUEST_COUNT:
      return { ...state, managableRequestCount: action.payload };
    default:
      return state;
  }
};
