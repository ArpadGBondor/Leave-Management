import { useEffect, useState } from 'react';
import SelectInput, { SelectInputOption } from '../inputs/SelectInput';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import formatBankHolidayName from '../../utils/formatBankHolidayName';
import { handleInputChange } from '../../utils/onFormDataChange';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { firebase_collections } from '../../../lib/firebase_collections';
import WorkdaysOfTheWeek from '../../interface/WorkdaysOfTheWeek.interface';

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

  const { importedRegions } = useCompanyContext();

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
    if (!year || !bankHolidayRegionId) {
      setFormData((prevState) => ({
        ...prevState,
        numberOfBankHolidays: 0,
      }));
      return;
    }
    const bankHolidayRef = collection(
      db,
      `/${firebase_collections.BANK_HOLIDAYS}/${bankHolidayRegionId}/${year}`
    );
    const numberOfBankHolidaysUnsubscribe = onSnapshot(
      bankHolidayRef,
      (snapshot) => {
        let numberOfBankHolidays: number = 0;

        for (const doc of snapshot.docs) {
          const date = new Date(doc.id);
          // Do not count days outside of employment
          if (employmentStart && date < employmentStart) continue;
          if (employmentEnd && date > employmentEnd) continue;
          const day = date.getDay();
          switch (day) {
            case 0:
              if (sunday) ++numberOfBankHolidays;
              break;
            case 1:
              if (monday) ++numberOfBankHolidays;
              break;
            case 2:
              if (tuesday) ++numberOfBankHolidays;
              break;
            case 3:
              if (wednesday) ++numberOfBankHolidays;
              break;
            case 4:
              if (thursday) ++numberOfBankHolidays;
              break;
            case 5:
              if (friday) ++numberOfBankHolidays;
              break;
            case 6:
              if (saturday) ++numberOfBankHolidays;
              break;
            default:
              break;
          }
        }
        setFormData((prevState) => ({
          ...prevState,
          numberOfBankHolidays,
        }));
      }
    );

    return () => numberOfBankHolidaysUnsubscribe();
  }, [
    bankHolidayRegionId,
    year,
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
        label="Bank Holidays automatically excluded"
        name="bankHolidayRegionId"
        value={formData.bankHolidayRegionId}
        options={bankHolidayOptions}
        onChange={(e) => handleInputChange(e, setFormData)}
      />
    </>
  );
}
