import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SelectInputOption } from '../components/inputs/SelectInput';
import formatBankHolidayName from '../utils/formatBankHolidayName';
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
import HolidayEntitlement, {
  UserHolidayEntitlement,
} from '../interface/holidayEntitlement.interface';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import Button from '../components/buttons/Button';
import WorkdaysOfTheWeek from '../interface/workdaysOfTheWeek.interface';
import AddEditUserYearlyConfiguration from '../components/forms/AddEditUserYearlyConfiguration';
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
  const { userId } = useParams();
  const [bankHolidayOptions, setBankHolidayOptions] = useState([
    noOption,
  ] as SelectInputOption[]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [configuredYears, setConfiguredYears] = useState<
    UserHolidayEntitlement[]
  >([]);
  const [importedRegionsAndYears, setImportedRegionsAndYears] =
    useState<BankHolidayRegionsAndYears>({});
  const { startLoading, stopLoading } = useLoadingContext();
  const [selectedForEditing, setSelectedForEditing] =
    useState<UserHolidayEntitlement | null>(null);

  const [screenPhase, setScreenPhase] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

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
    }
    setBankHolidayOptions(options);

    const years: string[] = Array.from(
      new Set(Object.values(importedRegionsAndYears).flat())
    ).sort();
    setAvailableYears(years);
  }, [importedRegionsAndYears]);

  useEffect(() => {
    if (!userId) return;
    const configurationRef = collection(
      db,
      `${firebase_collections.USERS}/${userId}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}`
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
  }, [userId]);

  const fetchUserDocument = async () => {
    const userRef = doc(db, `${firebase_collections.USERS}/${userId}`);
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

  const selectRow = (row: UserHolidayEntitlement) => {
    setSelectedForEditing(row);
    setIsEditing(true);
    setScreenPhase(2);
  };

  const pickNextAvailableYear = (): string => {
    const current = new Date().getFullYear();

    // 1️⃣ Filter out already configured years
    const configuredIds = new Set(configuredYears.map((c) => c.id));
    const candidates = availableYears
      .filter((y) => !configuredIds.has(y))
      .map(Number)
      .sort((a, b) => a - b);

    // 2️⃣ Try to find the next future year
    const next = candidates.find((y) => y >= current);
    if (next !== undefined) return String(next);

    // 3️⃣ If no future year, try the most recent past year
    const prev = [...candidates].reverse().find((y) => y < current);
    if (prev !== undefined) return String(prev);

    // 4️⃣ If nothing found, fail - Button should be disabled in this case
    throw new Error("Can't create new configuration.");
  };

  const addNew = async () => {
    const id = pickNextAvailableYear(); // next or previous year that is available and not configured yet
    if (configuredYears.length > 0) {
      // if there are years configured, take data from the last one
      let row = configuredYears[0];
      for (const c of configuredYears) {
        if (row.id < c.id) row = c;
      }

      setSelectedForEditing({
        ...row,
        id,
      });
    } else {
      const companyHolidayEntitlementSnap = await getDoc(
        doc(
          db,
          `${firebase_collections.CONFIG}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}`
        )
      );
      const companyHolidayEntitlement: HolidayEntitlement =
        companyHolidayEntitlementSnap.exists()
          ? (companyHolidayEntitlementSnap.data() as HolidayEntitlement)
          : { base: 28, additional: 0, multiplier: 1, total: 28 }; // default;

      const companyWorkdaysOfTheWeekSnap = await getDoc(
        doc(
          db,
          `${firebase_collections.CONFIG}/${firebase_collections.WORKDAYS_OF_THE_WEEK}`
        )
      );
      const companyWorkdaysOfTheWeek: WorkdaysOfTheWeek =
        companyWorkdaysOfTheWeekSnap.exists()
          ? (companyWorkdaysOfTheWeekSnap.data() as WorkdaysOfTheWeek)
          : {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: false,
              sunday: false,
            }; // default;
      setSelectedForEditing({
        ...companyHolidayEntitlement,
        ...companyWorkdaysOfTheWeek,
        bankHolidayRegionId: '', // initialise with no bank holiday region
        id,
      });
    }
    setIsEditing(false);
    setScreenPhase(2);
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
        {screenPhase === 1 && (
          <>
            <Table
              data={configuredYears}
              columns={columns}
              title="Configured years"
              onRowClick={(row) => selectRow(row)}
              highlightRow={(row) =>
                selectedForEditing !== null && row.id === selectedForEditing.id
              }
            />
            <Button
              label="Add new"
              onClick={addNew}
              disabled={availableYears.every((year) =>
                configuredYears.map((config) => config.id).includes(year)
              )}
            />
          </>
        )}
        {screenPhase === 2 && selectedForEditing && (
          <AddEditUserYearlyConfiguration
            bankHolidayOptions={bankHolidayOptions}
            isEditing={isEditing}
            selectedForEditing={selectedForEditing}
            yearOptions={availableYears.map(
              (year): SelectInputOption => ({
                label: year,
                value: year,
                disabled: configuredYears
                  .map((config) => config.id)
                  .includes(year),
              })
            )}
            userId={userId!}
            onBack={() => {
              setScreenPhase(1);
              setSelectedForEditing(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
