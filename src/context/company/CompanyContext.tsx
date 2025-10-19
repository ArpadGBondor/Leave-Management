import { createContext } from 'react';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import ImportBankHolidayResponse from '../../interface/ImportBankHolidayResponse.interface';

export interface CompanyContextType {
  updateHolidayEntitlement: (data: HolidayEntitlement) => void;
  updateWorkdaysOfTheWeek: (data: WorkdaysOfTheWeek) => void;
  importBankHolidaysFromGovUK: () => Promise<ImportBankHolidayResponse>;
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  importedRegions: string[];
  importedYears: string[];
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
