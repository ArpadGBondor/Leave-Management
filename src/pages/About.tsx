import PageWrapper from '../components/pageWrapper/PageWrapper';
import ExternalLink from '../components/link/ExternalLink';
import { version } from '../../package.json';

export default function About() {
  return (
    <PageWrapper title={'About this project'} size={'max-w-2xl'}>
      <div className="max-w-sm">
        <p className="text-brand-green-800 text-2xl font-bold">
          Manage your leaves
        </p>
        <p className="mb-4 text-brand-green-800">Version: {version}</p>
        <p className="mb-4 text-brand-green-800">
          This project is a Leave Management practice application built to
          maintain and enhance my React development skills.
        </p>
        <p className="mb-4 text-brand-green-800">
          Created by{' '}
          <ExternalLink
            to="https://github.com/ArpadGBondor"
            label="Árpád Gábor Bondor"
          />{' '}
          in 2025.
        </p>

        <p className="text-brand-green-800">
          Background image is{' '}
          <ExternalLink
            to="https://www.pexels.com/hu-hu/foto/457882/"
            label="Asad Photo Maldives's foto"
          />{' '}
          from Pexels.
        </p>
      </div>
    </PageWrapper>
  );
}
