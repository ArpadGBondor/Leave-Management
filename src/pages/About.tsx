import { Link } from 'react-router-dom';
import NavButton from '../components/buttons/NavButton';

export default function About() {
  return (
    <div className="max-w-md m-8 p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto">
      <h1 className="text-4xl font-bold text-brand-purple-600 mb-4">
        About this project
      </h1>
      <div className="mb-8">
        <p className="mb-4 text-brand-green-800">
          This is a Leave Management practise project, to keep my React skills
          up to date.
        </p>
        <p className="text-brand-green-800">
          Created by{' '}
          <a
            href="https://github.com/ArpadGBondor"
            target="_blank"
            rel="noreferrer"
            className="text-brand-purple-600 hover:text-brand-purple-400 active:text-brand-purple-900 cursor-pointer hover:underline"
          >
            Árpád Gábor Bondor
          </a>{' '}
          in 2025.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <NavButton label="Back to Home" link="/" icon="FaArrowLeft" />
      </div>
    </div>
  );
}
