import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function Unauthorised() {
  return (
    <PageWrapper title={'Unauthorised Access'} size={'max-w-4xl'} backPath="/">
      <p className="text-brand-green-800">
        You don’t have permission to view this page.
      </p>
    </PageWrapper>
  );
}
