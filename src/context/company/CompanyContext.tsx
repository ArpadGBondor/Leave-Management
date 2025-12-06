import { createContext } from 'react';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import ImportBankHolidayResponse from '../../interface/ImportBankHolidayResponse.interface';
import BankHolidayRegion from '../../interface/BankHolidayRegion.interface';

export type CompanyState = {
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  bankHolidayRegion: BankHolidayRegion;
  importedRegions: string[];
  importedYears: string[];
  bankHolidayCache: Record<string, Date[]>;
};

export interface CompanyContextType extends CompanyState {
  updateHolidayEntitlement: (data: HolidayEntitlement) => void;
  updateWorkdaysOfTheWeek: (data: WorkdaysOfTheWeek) => void;
  updateBankHolidayRegion: (data: BankHolidayRegion) => void;
  importBankHolidaysFromGovUK: () => Promise<ImportBankHolidayResponse>;
  getBankHolidays: (regionId: string, year: string) => Promise<Date[]>;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
