import { createContext } from 'react';
import HolidayEntitlement from '../../interface/HolidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import ImportBankHolidayResponse from '../../interface/ImportBankHolidayResponse.interface';
import BankHolidayRegionsAndYears from '../../interface/BankHolidayRegionsAndYears.interface';

export interface CompanyContextType {
  updateHolidayEntitlement: (data: HolidayEntitlement) => void;
  updateWorkdaysOfTheWeek: (data: WorkdaysOfTheWeek) => void;
  importBankHolidaysFromGovUK: () => Promise<ImportBankHolidayResponse>;
  fetchImportedBankHolidayRegionsAndYears: (
    refetch?: boolean
  ) => Promise<BankHolidayRegionsAndYears>;
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
  importedRegionsAndYears: BankHolidayRegionsAndYears;
  importedRegionsAndYearsLoaded: boolean;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
