import { createContext } from 'react';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import ImportBankHolidayResponse from '../../interface/ImportBankHolidayResponse.interface';
import BankHolidayRegion from '../../interface/BankHolidayRegion.interface';

export interface CompanyContextType {
  updateHolidayEntitlement: (data: HolidayEntitlement) => void;
  updateWorkdaysOfTheWeek: (data: WorkdaysOfTheWeek) => void;
  updateBankHolidayRegion: (data: BankHolidayRegion) => void;
  importBankHolidaysFromGovUK: () => Promise<ImportBankHolidayResponse>;
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  bankHolidayRegion: BankHolidayRegion;
  importedRegions: string[];
  importedYears: string[];
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
