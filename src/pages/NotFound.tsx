import PageWrapper from '../components/pageWrapper/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper title={'Page not found'} size={'max-w-4xl'} backPath="/">
      <p className="text-brand-green-800">
        Oops! The page you are looking for does not exist.
      </p>
    </PageWrapper>
  );
}
