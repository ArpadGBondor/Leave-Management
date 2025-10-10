export function handleInputChange<T>(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setError?: (field: keyof T, value: string) => void
) {
  const { name, value } = e.target;
  setError && setError(name as keyof T, '');
  setFormData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
}
