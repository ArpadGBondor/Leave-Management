import { createContext } from 'react';
import HolidayEntitlement from '../../interface/holidayEntitlement.interface';
import WorkdaysOfTheWeek from '../../interface/workdaysOfTheWeek.interface';

export interface CompanyContextType {
  updateHolidayEntitlement: (data: HolidayEntitlement) => void;
  updateWorkdaysOfTheWeek: (data: WorkdaysOfTheWeek) => void;
  holidayEntitlement: HolidayEntitlement;
  workdaysOfTheWeek: WorkdaysOfTheWeek;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
