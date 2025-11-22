export function handleInputChange<T>(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: (field: keyof T, value: string) => void,
  autoUpdate?: (state: T) => T
) {
  const { name, value, type } = e.target;
  let parsedValue: any = value;
  if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
    parsedValue = e.target.checked; // <-- THIS is the fix
  } else if (type === 'number') {
    parsedValue = value === '' ? '' : Number(value);
  }
  handleValueChange(
    name as keyof T,
    parsedValue,
    setFormData,
    setError,
    autoUpdate
  );
}

export function handleValueChange<T, V>(
  name: keyof T,
  value: V,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: (field: keyof T, value: string) => void,
  autoUpdate?: (state: T) => T
) {
  setError && setError(name as keyof T, '');
  setFormData((prevState) => {
    let state: T = {
      ...prevState,
      [name]: value,
    };
    if (autoUpdate) state = autoUpdate(state);
    return state;
  });
}
