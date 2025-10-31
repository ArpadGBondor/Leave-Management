import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectInputOption } from '../components/inputs/SelectInput';
import formatBankHolidayName from '../utils/formatBankHolidayName';
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { firebase_collections } from '../../lib/firebase_collections';
import User from '../interface/User.interface';
import ProfileBadge from '../components/profile/ProfileBadge';
import UserHolidayEntitlement from '../interface/UserHolidayEntitlement.interface';
import HolidayEntitlement from '../interface/HolidayEntitlement.interface';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import Button from '../components/buttons/Button';
import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';
import AddEditUserYearlyConfiguration from '../components/forms/AddEditUserYearlyConfiguration';
import { useCompanyContext } from '../context/company/useCompanyContext';
import BankHolidayRegion from '../interface/BankHolidayRegion.interface';
import UpdateTeamMemberUserType from '../components/forms/UpdateTeamMemberUserType';

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
    header: 'Number of Bank Holidays',
    accessor: 'numberOfBankHolidays',
    width: 'max-w-32',
  },
  {
    header: 'Total Holiday Entitlement',
    accessor: 'holidayEntitlementTotal',
    width: 'max-w-32',
  },
];

export default function ManageTeamMember() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [configuredYears, setConfiguredYears] = useState<
    UserHolidayEntitlement[]
  >([]);
  const [editUserType, setEditUserType] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoadingContext();
  const [selectedForEditing, setSelectedForEditing] =
    useState<UserHolidayEntitlement | null>(null);

  const [screenPhase, setScreenPhase] = useState(1);
  const [employmentYears, setEmploymentYears] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const {
    importedYears,
    bankHolidayRegion,
    holidayEntitlement,
    workdaysOfTheWeek,
  } = useCompanyContext();
  const navigate = useNavigate();

  useEffect(() => {
    setEmploymentYears(
      importedYears.filter((year) => {
        // Show already configured years to avoid errors
        if (configuredYears.some(({ id }) => id === year)) return true;
        if (user?.serviceStartDate && user?.serviceStartDate.slice(0, 4) > year)
          return false;
        if (user?.serviceEndDate && user?.serviceEndDate.slice(0, 4) < year)
          return false;
        return true;
      })
    );
  }, [importedYears, user?.serviceEndDate, user?.serviceStartDate]);

  useEffect(() => {
    if (!userId) return;

    startLoading('fetch-configured-years');
    const configurationRef = collection(
      db,
      `${firebase_collections.USERS}/${userId}/${firebase_collections.HOLIDAY_ENTITLEMENT_SUBCOLLECTION}`
    );
    const configurationUnsubscribe = onSnapshot(
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

    startLoading('fetch-user');
    const userRef = doc(db, `${firebase_collections.USERS}/${userId}`);
    const userUnsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setUser(null);
        } else {
          setUser(snapshot.data() as User);
        }
        stopLoading('fetch-user');
      },
      (err) => {
        console.error('Error subscribing to user:', err);
        stopLoading('fetch-user');
      }
    );

    // Cleanup subscription on unmount
    return () => {
      configurationUnsubscribe();
      userUnsubscribe();
    };
  }, [userId]);

  const selectRow = (row: UserHolidayEntitlement) => {
    setSelectedForEditing(row);
    setIsEditing(true);
    setScreenPhase(2);
  };

  const pickNextAvailableYear = (): string => {
    const current = new Date().getFullYear();

    // Filter out already configured years
    const configuredIds = new Set(configuredYears.map((c) => c.id));
    const candidates = employmentYears
      .filter((y) => !configuredIds.has(y))
      .map(Number)
      .sort((a, b) => a - b);

    // Try to find the next future year
    const next = candidates.find((y) => y >= current);
    if (next !== undefined) return String(next);

    // If no future year, try the most recent past year
    const prev = [...candidates].reverse().find((y) => y < current);
    if (prev !== undefined) return String(prev);

    // If nothing found, fail - Button should be disabled in this case
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
      const companyHolidayEntitlement: HolidayEntitlement =
        holidayEntitlement ?? {
          holidayEntitlementBase: 28,
          holidayEntitlementAdditional: 0,
          holidayEntitlementMultiplier: 1,
          holidayEntitlementDeduction: 0,
          holidayEntitlementTotal: 28,
        }; // default;

      const companyWorkdaysOfTheWeek: WorkdaysOfTheWeek = workdaysOfTheWeek ?? {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      }; // default;

      const companyBankHolidayRegion: BankHolidayRegion = bankHolidayRegion ?? {
        bankHolidayRegionId: '', // initialise with no bank holiday region
        numberOfBankHolidays: 0,
      };
      setSelectedForEditing({
        ...companyHolidayEntitlement,
        ...companyWorkdaysOfTheWeek,
        ...companyBankHolidayRegion,
        id,
      });
    }
    setIsEditing(false);
    setScreenPhase(2);
  };

  return (
    <div className="p-4 md:p-8 md:min-w-sm lg:min-w-md rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto  max-w-full space-y-4">
      <div className="flex flex-col justify-stretch items-stretch gap-4 w-full">
        <h2 className="text-4xl font-bold text-brand-purple-700">
          Manage Team Member
        </h2>
        {user && (
          <>
            <div className="bg-brand-green-600 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
              <ProfileBadge user={user} />
              <div className="w-full md:w-1/2">
                {!editUserType && (
                  <Button
                    type="button"
                    variant="secondary"
                    label="Edit user type"
                    onClick={() => setEditUserType(true)}
                  />
                )}
              </div>
            </div>
            {user && editUserType && (
              <UpdateTeamMemberUserType
                user={user}
                onBack={() => {
                  setEditUserType(false);
                }}
              />
            )}
          </>
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
            <div className="flex flex-col md:flex-row-reverse md:justify-stretch gap-1 md:gap-4">
              <Button
                label="Add new year"
                onClick={addNew}
                disabled={employmentYears.every((year) =>
                  configuredYears.map((config) => config.id).includes(year)
                )}
              />
              <Button
                type="button"
                variant="secondary"
                label="Back"
                onClick={() => navigate('/manage-team')}
              />
            </div>
          </>
        )}
        {screenPhase === 2 && selectedForEditing && (
          <AddEditUserYearlyConfiguration
            isEditing={isEditing}
            selectedForEditing={selectedForEditing}
            yearOptions={employmentYears.map(
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
