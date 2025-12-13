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
import { firebase_collections } from '../../lib/firebase_collections';
import User from '../interface/User.interface';
import ProfileBadge from '../components/profile/ProfileBadge';
import UserHolidayEntitlement from '../interface/UserHolidayEntitlement.interface';
import { useLoadingContext } from '../context/loading/useLoadingContext';
import Table from '../components/table/Table';
import { TableColumn } from '../components/table/types';
import Button from '../components/buttons/Button';
import WorkdaysOfTheWeek from '../interface/WorkdaysOfTheWeek.interface';
import UserYearlyConfigurationAddEdit from '../components/forms/UserYearlyConfigurationAddEdit';
import { useCompanyContext } from '../context/company/useCompanyContext';
import TeamMemberUserDetailsUpdate from '../components/forms/TeamMemberUserDetailsUpdate';
import { useFirebase } from '../hooks/useFirebase';
import countNumberOfBankHolidaysOnWorkdays from '../utils/countNumberOfBankHolidaysOnWorkdays';
import calculateHolidayEntitlementTotal from '../utils/calculateHolidayEntitlementTotal';
import countWorkdays from '../utils/countWorkdays';
import PageWrapper from '../components/pageWrapper/PageWrapper';
import ErrorBlock from '../components/error/ErrorBlock';

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
  const [editUserDetails, setEditUserDetails] = useState<boolean>(false);
  const { startLoading, stopLoading } = useLoadingContext();
  const [selectedForEditing, setSelectedForEditing] =
    useState<UserHolidayEntitlement | null>(null);

  const [screenPhase, setScreenPhase] = useState(1);
  const [employmentYears, setEmploymentYears] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const {
    importedYears,
    getBankHolidays,
    workdaysOfTheWeek: companyWorkdaysOfTheWeek,
    bankHolidayRegion: companyBankHolidayRegion,
    holidayEntitlement: companyHolidayEntitlement,
  } = useCompanyContext();
  const [userError, setUserError] = useState('');

  const firebase = useFirebase();
  const db = firebase?.db;

  useEffect(() => {
    const startYear = user?.serviceStartDate?.substring(0, 4);
    const endYear = user?.serviceEndDate?.substring(0, 4);

    setEmploymentYears(
      importedYears.filter((year) => {
        // Show already configured years to avoid errors
        if (configuredYears.some(({ id }) => id === year)) return true;
        if (startYear && startYear > year) return false;
        if (endYear && endYear < year) return false;
        return true;
      })
    );
  }, [
    importedYears,
    configuredYears,
    user?.serviceEndDate,
    user?.serviceStartDate,
  ]);

  useEffect(() => {
    if (!db) return;
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
          setUserError('User not found.');
        } else {
          setUser(snapshot.data() as User);
          setUserError('');
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
  }, [db, userId]);

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

    let previousSettings: UserHolidayEntitlement | null = null;
    if (configuredYears.length > 0) {
      // if there are years configured, take data from the last one
      previousSettings = configuredYears[0];
      for (const c of configuredYears) {
        if (previousSettings.id < c.id) previousSettings = c;
      }
    }

    const employmentStart: Date | undefined = user?.serviceStartDate
      ? new Date(user.serviceStartDate)
      : undefined;
    const employmentEnd: Date | undefined = user?.serviceEndDate
      ? new Date(user.serviceEndDate)
      : undefined;

    const newWorkdaysOfTheWeek: WorkdaysOfTheWeek = {
      monday:
        previousSettings?.monday ?? companyWorkdaysOfTheWeek.monday ?? true,
      tuesday:
        previousSettings?.tuesday ?? companyWorkdaysOfTheWeek.tuesday ?? true,
      wednesday:
        previousSettings?.wednesday ??
        companyWorkdaysOfTheWeek.wednesday ??
        true,
      thursday:
        previousSettings?.thursday ?? companyWorkdaysOfTheWeek.thursday ?? true,
      friday:
        previousSettings?.friday ?? companyWorkdaysOfTheWeek.friday ?? true,
      saturday:
        previousSettings?.saturday ??
        companyWorkdaysOfTheWeek.saturday ??
        false,
      sunday:
        previousSettings?.sunday ?? companyWorkdaysOfTheWeek.sunday ?? false,
    };

    let bankHolidayRegionId: string =
      previousSettings?.bankHolidayRegionId ??
      companyBankHolidayRegion?.bankHolidayRegionId ??
      '';

    let bankHolidays = await getBankHolidays(bankHolidayRegionId, id);
    // Number of bank holiday days when team member is scheduled to work
    let numberOfBankHolidays = countNumberOfBankHolidaysOnWorkdays(
      bankHolidays,
      newWorkdaysOfTheWeek,
      employmentStart,
      employmentEnd
    );

    let holidayEntitlementBase: number =
      previousSettings?.holidayEntitlementBase ??
      companyHolidayEntitlement?.holidayEntitlementBase ??
      28;
    let holidayEntitlementAdditional: number =
      previousSettings?.holidayEntitlementAdditional ??
      companyHolidayEntitlement?.holidayEntitlementAdditional ??
      0;

    // Need to count total number of workdays of the year
    const firstDayOfTheYear = new Date(`${id}-01-01`);
    const lastDayOfTheYear = new Date(`${id}-12-31`);
    const totalWorkdays = countWorkdays(
      firstDayOfTheYear,
      lastDayOfTheYear,
      [],
      newWorkdaysOfTheWeek
    );

    // Need to count number of workdays of the year that fall between employment start and end date
    const firstEmployedDayOfTheYear =
      employmentStart &&
      employmentStart.getFullYear() === firstDayOfTheYear.getFullYear()
        ? employmentStart
        : firstDayOfTheYear;
    const lastEmployedDayOfTheYear =
      employmentEnd &&
      employmentEnd.getFullYear() === lastDayOfTheYear.getFullYear()
        ? employmentEnd
        : lastDayOfTheYear;

    const employedWorkdays = countWorkdays(
      firstEmployedDayOfTheYear,
      lastEmployedDayOfTheYear,
      [],
      newWorkdaysOfTheWeek
    );
    let multiplierBasedOnEmployment: number = employedWorkdays / totalWorkdays;

    // Need to count number of workdays
    let multiplierBasedOnNumberOfWorkdays: number =
      Object.values(newWorkdaysOfTheWeek).filter(Boolean).length / 5;

    // set recommended multiplier
    let holidayEntitlementMultiplier: number =
      multiplierBasedOnNumberOfWorkdays * multiplierBasedOnEmployment;

    // set recommended reduction
    let holidayEntitlementDeduction: number = numberOfBankHolidays;

    let holidayEntitlementTotal: number = calculateHolidayEntitlementTotal(
      holidayEntitlementBase,
      holidayEntitlementAdditional,
      holidayEntitlementMultiplier,
      holidayEntitlementDeduction
    );

    setSelectedForEditing({
      holidayEntitlementBase,
      holidayEntitlementAdditional,
      holidayEntitlementMultiplier,
      holidayEntitlementDeduction,
      holidayEntitlementTotal,
      ...newWorkdaysOfTheWeek,
      bankHolidayRegionId,
      numberOfBankHolidays,
      id,
    });

    setIsEditing(false);
    setScreenPhase(2);
  };

  return (
    <PageWrapper
      title={'Manage team member'}
      size={'max-w-6xl'}
      backPath="/manage-team"
    >
      {userError ? (
        <ErrorBlock error={userError} />
      ) : (
        <>
          {user && (
            <div>
              <div
                className={`bg-brand-green-600 p-4 flex flex-col md:flex-row gap-4 justify-between items-center ${
                  editUserDetails ? 'rounded-t-xl' : 'rounded-xl'
                }`}
              >
                <ProfileBadge user={user} />
                <div className="w-full md:w-1/2">
                  {!editUserDetails && (
                    <Button
                      type="button"
                      variant="secondary"
                      label="Update Details"
                      onClick={() => setEditUserDetails(true)}
                    />
                  )}
                </div>
              </div>
              {user && editUserDetails && (
                <div className="p-4 rounded-b-xl border border-brand-green-600 bg-brand-purple-100">
                  <TeamMemberUserDetailsUpdate
                    user={user}
                    onBack={() => {
                      setEditUserDetails(false);
                    }}
                  />
                </div>
              )}
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
                  selectedForEditing !== null &&
                  row.id === selectedForEditing.id
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
              </div>
            </>
          )}
          {screenPhase === 2 && selectedForEditing && (
            <UserYearlyConfigurationAddEdit
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
              user={user!}
              onBack={() => {
                setScreenPhase(1);
                setSelectedForEditing(null);
              }}
            />
          )}
        </>
      )}
    </PageWrapper>
  );
}
