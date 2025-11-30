interface UserDashboardInfoProps {
  label: string;
  value: number;
}

export default function UserDashboardInfo({
  label,
  value,
}: UserDashboardInfoProps) {
  return (
    <div
      className={`bg-brand-green-100 rounded-xl flex-1 p-2 flex flex-col justify-between gap-2 items-center`}
    >
      <div className="flex-2 text-center text-brand-green-700 font-medium flex flex-col justify-center items-center">
        {label}
      </div>
      <div
        className={`flex-1 text-2xl font-semibold ${
          value < 0 ? 'text-red-500' : 'text-brand-purple-700'
        }`}
      >
        {value.toFixed(1)}
      </div>
    </div>
  );
}
