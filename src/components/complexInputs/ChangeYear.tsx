import { FaAngleDoubleLeft, FaAngleDoubleRight } from '../../icons/fa';
import Button from '../buttons/Button';

interface ChangeYearProps {
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}

export default function ChangeYear({ year, setYear }: ChangeYearProps) {
  return (
    <div
      className={`bg-brand-green-100 border border-brand-green-600 rounded-xl p-2 flex flex-row justify-between items-center gap-4 mx-auto overflow-hidden  text-brand-purple-600 mb-2`}
    >
      <button
        onClick={() => setYear((prev) => prev - 1)}
        className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
        aria-label="Previous year"
      >
        <FaAngleDoubleLeft />
      </button>
      <h2 className="text-2xl font-semibold">{year}</h2>
      <button
        onClick={() => setYear((prev) => prev + 1)}
        className="p-2 rounded-full hover:bg-brand-purple-200 transition cursor-pointer"
        aria-label="Next year"
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
}
