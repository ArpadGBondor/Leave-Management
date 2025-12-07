import React, { useReducer, useMemo } from 'react';
import { ConfirmationContext, ConfirmationState } from './ConfirmationContext';
import { ConfirmationReducer } from './ConfirmationReducer';
import {
  SET_CONFIRMATION_MODAL_CLOSE,
  SET_CONFIRMATION_MODAL_OPEN,
} from '../types';
import { ConfirmationOptions } from './types';

const ConfirmationInitialState: ConfirmationState = {
  isOpen: false,
  options: null,
};

const ConfirmationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    ConfirmationReducer,
    ConfirmationInitialState
  );

  const confirm = (options: ConfirmationOptions) => {
    dispatch({ type: SET_CONFIRMATION_MODAL_OPEN, payload: options });
  };

  const close = () => dispatch({ type: SET_CONFIRMATION_MODAL_CLOSE });

  return (
    <ConfirmationContext.Provider value={{ state, confirm, close }}>
      {children}
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationProvider;
