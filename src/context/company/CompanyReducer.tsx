import HolidayEntitlement from '../../interface/holidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/workdaysOfTheWeek.interface';
import { SET_HOLIDAY_ENTITLEMENT, SET_WORKDAYS_OF_THE_WEEK } from '../types';

export type CompanyState = {
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
};

export type CompanyAction =
  | { type: typeof SET_HOLIDAY_ENTITLEMENT; payload: HolidayEntitlement }
  | { type: typeof SET_WORKDAYS_OF_THE_WEEK; payload: WorkdaysOfTheWeek };

export const loadingReducer = (
  state: CompanyState,
  action: CompanyAction
): CompanyState => {
  switch (action.type) {
    case SET_HOLIDAY_ENTITLEMENT:
      return { ...state, holidayEntitlement: action.payload };
    case SET_WORKDAYS_OF_THE_WEEK:
      return { ...state, workdaysOfTheWeek: action.payload };
    default:
      return state;
  }
};
