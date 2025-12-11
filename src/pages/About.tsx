import { Link } from 'react-router-dom';
import NavButton from '../components/buttons/NavButton';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function About() {
  return (
    <PageWrapper title={'About this project'} size={'max-w-2xl'}>
      <div className="max-w-sm">
        <p className="mb-4 text-brand-green-800">
          This is a Leave Management practise project, to keep my React skills
          up to date.
        </p>
        <p className="mb-4 text-brand-green-800">
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

        <p className="text-brand-green-800">
          Background image is{' '}
          <a
            href="https://www.pexels.com/hu-hu/foto/457882/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-purple-600 hover:text-brand-purple-400 active:text-brand-purple-900 cursor-pointer hover:underline"
          >
            Asad Photo Maldives's foto
          </a>{' '}
          from Pexels.
        </p>
      </div>
    </PageWrapper>
  );
}
