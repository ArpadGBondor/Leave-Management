import { useEffect, useState } from 'react';
import SelectInput, { SelectInputOption } from '../inputs/SelectInput';
import { useCompanyContext } from '../../context/company/useCompanyContext';
import formatBankHolidayName from '../../utils/formatBankHolidayName';
import { handleInputChange } from '../../utils/onFormDataChange';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { firebase_collections } from '../../../lib/firebase_collections';

interface BankHolidayRegionDropdownProps<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  year: string;
}

export default function BankHolidayRegionDropdown<
  T extends { bankHolidayRegionId: string; numberOfBankHolidays: number }
>({ formData, setFormData, year }: BankHolidayRegionDropdownProps<T>) {
  const noOption = { label: 'None', value: '' };

  const [bankHolidayOptions, setBankHolidayOptions] = useState([
    noOption,
  ] as SelectInputOption[]);

  const { importedRegions } = useCompanyContext();

  const { bankHolidayRegionId } = formData;

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
        const numberOfBankHolidays: number = snapshot.docs.length;
        setFormData((prevState) => ({
          ...prevState,
          numberOfBankHolidays,
        }));
      }
    );

    return () => numberOfBankHolidaysUnsubscribe();
  }, [bankHolidayRegionId, year]);

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
      {formData.numberOfBankHolidays > 0 && (
        <p className=" text-brand-green-800 text-center">
          Number of bank holiday days in {year}:{' '}
          <span className="font-bold">{formData.numberOfBankHolidays}</span>
        </p>
      )}
    </>
  );
}
