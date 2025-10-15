import BankHolidayRegionsAndYears from '../../interface/BankHolidayRegionsAndYears.interface';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import {
  SET_HOLIDAY_ENTITLEMENT,
  SET_REGIONS_AND_YEARS,
  SET_REGIONS_AND_YEARS_LOADED,
  SET_WORKDAYS_OF_THE_WEEK,
} from '../types';

export type CompanyState = {
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  importedRegionsAndYears: BankHolidayRegionsAndYears;
  importedRegionsAndYearsLoaded: boolean;
};

export type CompanyAction =
  | { type: typeof SET_HOLIDAY_ENTITLEMENT; payload: HolidayEntitlement }
  | { type: typeof SET_WORKDAYS_OF_THE_WEEK; payload: WorkdaysOfTheWeek }
  | {
      type: typeof SET_REGIONS_AND_YEARS;
      payload: BankHolidayRegionsAndYears;
    }
  | { type: typeof SET_REGIONS_AND_YEARS_LOADED; payload: boolean };

export const loadingReducer = (
  state: CompanyState,
  action: CompanyAction
): CompanyState => {
  switch (action.type) {
    case SET_HOLIDAY_ENTITLEMENT:
      return { ...state, holidayEntitlement: action.payload };
    case SET_WORKDAYS_OF_THE_WEEK:
      return { ...state, workdaysOfTheWeek: action.payload };
    case SET_REGIONS_AND_YEARS:
      return { ...state, importedRegionsAndYears: action.payload };
    case SET_REGIONS_AND_YEARS_LOADED:
      return { ...state, importedRegionsAndYearsLoaded: action.payload };
    default:
      return state;
  }
};
