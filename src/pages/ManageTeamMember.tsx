import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firebase_collections } from '../../lib/firebase_collections';
import { db } from '../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import SelectInput, {
  SelectInputOption,
} from '../components/inputs/SelectInput';
import formatBankHolidayName from '../utils/formatBankHolidayName';
import { handleInputChange } from '../utils/onFormDataChange';

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
  const { chosenBankHoliday } = formData;

  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    fetchBankHolidayRegions();
  }, []);

  const fetchBankHolidayRegions = async () => {
    const bankHolidayRef = collection(db, firebase_collections.BANK_HOLIDAYS);

    const bankHolidaySnap = await getDocs(bankHolidayRef);

    const options: SelectInputOption[] = [noOption];
    for (const bankHoliday of bankHolidaySnap.docs) {
      options.push({
        label: formatBankHolidayName(bankHoliday.id),
        value: bankHoliday.id,
      });
      setBankHolidayOptions(options);
    }
  };
  return (
    <div className="p-4 m-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto">
      <div className="flex flex-col justify-stretch items-stretch gap-4 p-4 md:p-8 w-full h-full overflow-auto">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Manage Team Member
        </h2>
        <p className="text-brand-green-800">
          {JSON.stringify(bankHolidayOptions)}
        </p>
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
