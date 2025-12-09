import { useEffect, useState } from 'react';
import SelectInput, { SelectInputOption } from '../inputs/SelectInput';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import formatBankHolidayName from '../../utils/formatBankHolidayName';
import { handleInputChange } from '../../utils/onFormDataChange';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';
import { useFirebase } from '../../hooks/useFirebase';
import countNumberOfBankHolidaysOnWorkdays from '../../utils/countNumberOfBankHolidaysOnWorkdays';

interface BankHolidayRegionDropdownProps<T> {
  formData: T;
  workdaysOfTheWeek?: WorkdaysOfTheWeek;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  year: string;
  employmentStart?: Date;
  employmentEnd?: Date;
}

export default function BankHolidayRegionDropdown<
  T extends { bankHolidayRegionId: string; numberOfBankHolidays: number }
>({
  formData,
  workdaysOfTheWeek,
  setFormData,
  year,
  employmentStart,
  employmentEnd,
}: BankHolidayRegionDropdownProps<T>) {
  const noOption = { label: 'None', value: '' };

  const [bankHolidayOptions, setBankHolidayOptions] = useState([
    noOption,
  ] as SelectInputOption[]);

  const [bankHolidayDates, setBankHolidayDates] = useState<Date[]>([]);

  const { importedRegions, getBankHolidays } = useCompanyContext();
  const firebase = useFirebase();
  const db = firebase?.db;

  const { bankHolidayRegionId } = formData;

  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    workdaysOfTheWeek ?? {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    };

  useEffect(() => {
    const options: SelectInputOption[] = [noOption];
    for (const region of importedRegions) {
      options.push({
        label: formatBankHolidayName(region),
        value: region,
      });
    }
    setBankHolidayOptions(options);
  }, [importedRegions]);

  useEffect(() => {
    if (!db) return;
    if (!year || !bankHolidayRegionId) {
      setFormData((prevState) => ({
        ...prevState,
        numberOfBankHolidays: 0,
      }));
      return;
    }
    const fetchBankHolidays = async () => {
      const dates = await getBankHolidays(bankHolidayRegionId, year);
      setBankHolidayDates(dates);
    };
    fetchBankHolidays();
  }, [db, bankHolidayRegionId, year]);

  useEffect(() => {
    let numberOfBankHolidays: number = countNumberOfBankHolidaysOnWorkdays(
      bankHolidayDates,
      { monday, tuesday, wednesday, thursday, friday, saturday, sunday },
      employmentStart,
      employmentEnd
    );

    setFormData((prevState) => {
      if (prevState.numberOfBankHolidays !== numberOfBankHolidays) {
        return {
          ...prevState,
          numberOfBankHolidays,
        };
      }
      return prevState;
    });
  }, [
    bankHolidayDates,
    employmentStart,
    employmentEnd,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  ]);

  return (
    <>
      <SelectInput
        id="bankHolidayRegionId"
        label="Bank holidays automatically applied"
        name="bankHolidayRegionId"
        value={formData.bankHolidayRegionId}
        options={bankHolidayOptions}
        onChange={(e) => handleInputChange(e, setFormData)}
      />
    </>
  );
}
