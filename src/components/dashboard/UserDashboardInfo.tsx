interface UserDashboardInfoProps {
  label: string;
  value: number | string;
}

export default function UserDashboardInfo({
  label,
  value,
}: UserDashboardInfoProps) {
  return (
    <div
      className={`bg-brand-green-100 rounded-xl flex-1 p-2 flex flex-row md:flex-col justify-between gap-2 items-center`}
    >
      <div className="flex-1 text-sm md:text-base text-brand-green-700 font-medium md:text-center ">
        {label}
      </div>
      <div
        className={`flex-1 text-base sm:text-lg font-semibold text-right md:text-center ${
          typeof value === 'number' && value < 0
            ? 'text-red-500'
            : 'text-brand-purple-700'
        }`}
      >
        {typeof value === 'number' ? value.toFixed(1) : value} days
      </div>
    </div>
  );
}
