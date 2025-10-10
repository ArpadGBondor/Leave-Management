export function handleInputChange<T>(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: (field: keyof T, value: string) => void
) {
  const { name, value } = e.target;
  handleValueChange(name as keyof T, value, setFormData, setError);
}

export function handleValueChange<T, V>(
  name: keyof T,
  value: V,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: (field: keyof T, value: string) => void
) {
  setError && setError(name as keyof T, '');
  setFormData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
}
