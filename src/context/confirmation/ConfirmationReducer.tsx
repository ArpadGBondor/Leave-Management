import {
  SET_CONFIRMATION_MODAL_OPEN,
  SET_CONFIRMATION_MODAL_CLOSE,
} from '../types';
import { ConfirmationState } from './ConfirmationContext';
import { ConfirmationOptions } from './types';

export type ConfirmationAction =
  | { type: typeof SET_CONFIRMATION_MODAL_OPEN; payload: ConfirmationOptions }
  | { type: typeof SET_CONFIRMATION_MODAL_CLOSE };

export const ConfirmationReducer = (
  state: ConfirmationState,
  action: ConfirmationAction
): ConfirmationState => {
  switch (action.type) {
    case SET_CONFIRMATION_MODAL_OPEN:
      return { isOpen: true, options: action.payload };
    case SET_CONFIRMATION_MODAL_CLOSE:
      return { isOpen: false, options: null };
    default:
      return state;
  }
};
