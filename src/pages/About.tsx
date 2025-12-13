import PageWrapper from '../components/pageWrapper/PageWrapper';
import ExternalLink from '../components/link/ExternalLink';
import { version } from '../../package.json';

export default function About() {
  return (
    <PageWrapper title={'About this project'} size={'max-w-2xl'} backPath="/">
      <div className="max-w-sm">
        <p className="text-brand-green-800 text-2xl font-bold">
          Manage your leaves
        </p>
        <p className="mb-4 text-brand-green-800">Version: {version}</p>
        <p className="mb-4 text-brand-green-800">
          Created by{' '}
          <ExternalLink
            to="https://github.com/ArpadGBondor"
            label="Árpád Gábor Bondor"
          />{' '}
          in 2025.
        </p>
        <p className="mb-4 text-brand-green-800">
          I created this leave management web application to expand my
          portfolio, and improve my React skills. The goal was to create a
          full-stack web-application with React, Tailwind, serverless backend,
          and database connection. I chose Firebase Firestore as the database,
          and Firebase also handles the user-authentication for the project.
        </p>

        <p className="text-brand-green-800">
          The background image is{' '}
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
