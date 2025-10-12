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
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { firebase_collections } from '../../lib/firebase_collections';
import User from '../interface/user.interface';
import ProfileBadge from '../components/profile/ProfileBadge';
import { UserHolidayEntitlement } from '../interface/holidayEntitlement.interface';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
const noOption = { label: 'None', value: '' };

const columns: TableColumn<UserHolidayEntitlement>[] = [
  {
    header: 'Year',
    accessor: 'id',
    sortable: true,
    render: (year: string) => <strong>{year}</strong>,
  },
  {
    header: 'Bank Holiday Region',
    accessor: 'bankHolidayRegionId',
    render: (bankHolidayRegionId: string) => (
      <div>
        {bankHolidayRegionId
          ? formatBankHolidayName(bankHolidayRegionId)
          : 'No region selected'}
      </div>
    ),
  },
  {
    header: 'Base Holiday Entitlement',
    accessor: 'base',
    width: 'max-w-32',
  },
  {
    header: 'Additional Holiday Entitlement',
    accessor: 'additional',
    width: 'max-w-32',
  },
  {
    header: 'Holiday Entitlement Multiplier',
    accessor: 'multiplier',
    width: 'max-w-32',
  },
  {
    header: 'Total Holiday Entitlement',
    accessor: 'total',
    width: 'max-w-32',
  },
];

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
  const [user, setUser] = useState<User | null>(null);
  const [configuredYears, setConfiguredYears] = useState<
    UserHolidayEntitlement[]
  >([]);
  const [importedRegionsAndYears, setImportedRegionsAndYears] =
    useState<BankHolidayRegionsAndYears>({});
  const { startLoading, stopLoading } = useLoadingContext();
  const [selectedForEditing, setSelectedForEditing] =
    useState<UserHolidayEntitlement | null>(null);

  const { chosenBankHoliday } = formData;

  useEffect(() => {
    fetchImportedRegionsAndYears();
    fetchUserDocument();
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

  useEffect(() => {
    if (!userID) return;
    const configurationRef = collection(
      db,
      `${firebase_collections.USERS}/${userID}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}`
    );
    startLoading('fetch-configured-years');
    const unsubscribe = onSnapshot(
      configurationRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data: UserHolidayEntitlement[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as UserHolidayEntitlement[];

        setConfiguredYears(data);
        stopLoading('fetch-configured-years');
      },
      (err) => {
        console.error('Error subscribing to configured years:', err);
        stopLoading('fetch-configured-years');
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userID]);

  const fetchUserDocument = async () => {
    const userRef = doc(db, `${firebase_collections.USERS}/${userID}`);
    const userDoc = await getDoc(userRef);
    setUser(userDoc.data() as User);
  };

  // Fetch existing regions & years from Firestore
  const fetchImportedRegionsAndYears = async () => {
    startLoading('fetch-imported-bank-holiday-regions-and-years');
    try {
      const regions = await fetchImportedBankHolidayRegionsAndYears();
      setImportedRegionsAndYears(regions);
    } catch (error: any) {
      toast.error(error.message || 'Could not load imported regions and years');
    } finally {
      stopLoading('fetch-imported-bank-holiday-regions-and-years');
    }
  };

  return (
    <div className="p-4 md:m-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50  overflow-auto  max-w-full space-y-4">
      <div className="flex flex-col justify-stretch items-stretch gap-4 p-4 md:p-8 w-full h-full overflow-auto">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Manage Team Member
        </h2>
        {user && (
          <div className="bg-brand-green-600 p-4 rounded-xl">
            <ProfileBadge user={user} />
          </div>
        )}

        <Table
          data={configuredYears}
          columns={columns}
          title="Configured years"
          onRowClick={(row) => setSelectedForEditing(row)}
          highlightRow={(row) =>
            selectedForEditing !== null && row.id === selectedForEditing.id
          }
        />

        <p className="text-brand-green-800">
          {'>>>'} Here a form should allow to make changes or create new record{' '}
          {'<<<'}
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
