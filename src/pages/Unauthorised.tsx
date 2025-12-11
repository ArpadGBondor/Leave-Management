import NavButton from '../components/buttons/NavButton';
import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Unauthorised() {
  return (
    <PageWrapper title={'Unauthorised Access'} size={'max-w-4xl'}>
      <p className="mb-4 text-brand-green-800">
        You don’t have permission to view this page.
      </p>
      <div className="flex flex-col items-center">
        <NavButton label="Back to Home" link="/" icon="FaArrowLeft" />
      </div>
    </PageWrapper>
  );
}
