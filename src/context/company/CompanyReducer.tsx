import BankHolidayRegion from '../../interface/BankHolidayRegion.interface';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import {
  SET_BANK_HOLIDAY_REGION,
  SET_HOLIDAY_ENTITLEMENT,
  SET_IMPORTED_REGIONS,
  SET_IMPORTED_YEARS,
  SET_WORKDAYS_OF_THE_WEEK,
} from '../types';

export type CompanyState = {
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  bankHolidayRegion: BankHolidayRegion;
  importedRegions: string[];
  importedYears: string[];
};

export type CompanyAction =
  | { type: typeof SET_HOLIDAY_ENTITLEMENT; payload: HolidayEntitlement }
  | { type: typeof SET_WORKDAYS_OF_THE_WEEK; payload: WorkdaysOfTheWeek }
  | { type: typeof SET_BANK_HOLIDAY_REGION; payload: BankHolidayRegion }
  | { type: typeof SET_IMPORTED_REGIONS; payload: string[] }
  | { type: typeof SET_IMPORTED_YEARS; payload: string[] };

export const loadingReducer = (
  state: CompanyState,
  action: CompanyAction
): CompanyState => {
  switch (action.type) {
    case SET_HOLIDAY_ENTITLEMENT:
      return { ...state, holidayEntitlement: action.payload };
    case SET_WORKDAYS_OF_THE_WEEK:
      return { ...state, workdaysOfTheWeek: action.payload };
    case SET_BANK_HOLIDAY_REGION:
      return { ...state, bankHolidayRegion: action.payload };
    case SET_IMPORTED_REGIONS:
      return { ...state, importedRegions: action.payload };
    case SET_IMPORTED_YEARS:
      return { ...state, importedYears: action.payload };
    default:
      return state;
  }
};
