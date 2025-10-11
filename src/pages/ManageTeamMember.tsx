import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SelectInput, {
  SelectInputOption,
} from '../components/inputs/SelectInput';
import formatBankHolidayName from '../utils/formatBankHolidayName';
import { handleInputChange } from '../utils/onFormDataChange';
import fetchImportedBankHolidayRegionsAndYears, {
  BankHolidayRegionsAndYears,
} from '../utils/fetchImportedBankHolidayRegionsAndYears';
import { toast } from 'react-toastify';
const noOption = { label: 'None', value: '' };

export default function ManageTeamMember() {
  const { userID } = useParams();

  const [bankHolidayOptions, setBankHolidayOptions] = useState([
    noOption,
  ] as SelectInputOption[]);

  const defaultState: {
    chosenBankHoliday: string;
  } = {
    chosenBankHoliday: '',
  };
  const [formData, setFormData] = useState(defaultState);
  const [fetchingInProgress, setFetchingInProgress] = useState(false);
  const [importedRegionsAndYears, setImportedRegionsAndYears] =
    useState<BankHolidayRegionsAndYears>({});

  const { chosenBankHoliday } = formData;

  useEffect(() => {
    fetchImportedRegionsAndYears();
  }, []);

  useEffect(() => {
    const options: SelectInputOption[] = [noOption];
    for (const regionCode in importedRegionsAndYears) {
      options.push({
        label: formatBankHolidayName(regionCode),
        value: regionCode,
      });
      setBankHolidayOptions(options);
    }
  }, [importedRegionsAndYears]);

  // Fetch existing regions & years from Firestore
  const fetchImportedRegionsAndYears = async () => {
    setFetchingInProgress(true);
    try {
      const regions = await fetchImportedBankHolidayRegionsAndYears();
      setImportedRegionsAndYears(regions);
    } catch (error: any) {
      toast.error(error.message || 'Could not load imported regions and years');
    } finally {
      setFetchingInProgress(false);
    }
  };

  return (
    <div className="p-4 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto">
      <div className="flex flex-col justify-stretch items-stretch gap-4 p-4 md:p-8 w-full h-full overflow-auto">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Manage Team Member
        </h2>
        <SelectInput
          id="chosenBankHoliday"
          label="Bank Holidays automatically excluded"
          name="chosenBankHoliday"
          value={chosenBankHoliday}
          options={bankHolidayOptions}
          onChange={(e) => handleInputChange(e, setFormData)}
        />
      </div>
    </div>
  );
}
