import NavButton from '../components/buttons/NavButton';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper title={'Page Not Found'} size={'max-w-4xl'}>
      <p className="mb-4 text-brand-green-800">
        Oops! The page you are looking for does not exist.
      </p>
      <div className="flex flex-col items-center">
        <NavButton label="Back to Home" link="/" icon="FaArrowLeft" />
      </div>
    </PageWrapper>
  );
}
