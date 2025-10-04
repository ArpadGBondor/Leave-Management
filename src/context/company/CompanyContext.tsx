import { createContext } from 'react';
import HolidayEntitlement from '../../interface/holidayEntitlement.interface';

export interface CompanyContextType {
  updateHolidayEntitlement: (document: HolidayEntitlement) => void;
  holidayEntitlement: HolidayEntitlement;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(
  undefined
);
