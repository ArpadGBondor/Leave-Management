import Button from '../buttons/Button';

interface ChangeYearProps {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function ChangeYear({ year, setYear }: ChangeYearProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div>
        <Button
          onClick={() => setYear((prev) => prev - 1)}
          label={'<< Previous year'}
          variant="secondary"
        />
      </div>
      <h2 className="text-3xl font-bold text-brand-purple-600">{year}</h2>
      <div>
        <Button
          onClick={() => setYear((prev) => prev + 1)}
          label={'Next year >>'}
          variant="secondary"
        />
      </div>
    </div>
  );
}
