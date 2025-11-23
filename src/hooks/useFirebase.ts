import { useEffect, useState } from 'react';
import { getFirebase } from '../firebase.lazy';

export function useFirebase() {
  const [firebase, setFirebase] = useState<Awaited<
    ReturnType<typeof getFirebase>
  > | null>(null);

  useEffect(() => {
    getFirebase().then(setFirebase);
  }, []);

  return firebase;
}
