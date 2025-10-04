import HolidayEntitlement from '../../interface/holidayEntitlement.interface';
import { SET_HOLIDAY_ENTITLEMENT } from '../types';

export type CompanyState = {
  holidayEntitlement: HolidayEntitlement;
};

export type CompanyAction = {
  type: typeof SET_HOLIDAY_ENTITLEMENT;
  payload: HolidayEntitlement;
};

export const loadingReducer = (
  state: CompanyState,
  action: CompanyAction
): CompanyState => {
  switch (action.type) {
    case SET_HOLIDAY_ENTITLEMENT:
      return { ...state, holidayEntitlement: action.payload };
    default:
      return state;
  }
};
