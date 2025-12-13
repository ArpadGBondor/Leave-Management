interface ErrorProps {
  error: string;
}

export default function ErrorBlock({ error }: ErrorProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700">Error</h2>
      <div className="text-brand-green-800">{error}</div>
    </div>
  );
}
