import { useRef, useState } from 'react';

interface FileInputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string | null) => void;
  error: string;
  setError: (value: string) => void;
}

export default function FileInput({
  id,
  label,
  name,
  value,
  onChange,
  error,
  setError,
}: FileInputProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 500 * 1024) {
      setError('File size should be less than 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setError('');
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-brand-green-800 text-medium w-full"
      >
        {label}
      </label>

      <div className="relative">
        <div
          className={` w-32 h-32 rounded-full border-8  flex items-center justify-center cursor-pointer overflow-hidden ${
            dragOver
              ? error
                ? 'bg-red-200 border-red-600 text-red-800'
                : 'bg-brand-green-100 border-brand-green-600 text-brand-green-800'
              : error
              ? 'bg-red-200 border-red-700 hover:border-red-600 text-red-900'
              : 'bg-brand-green-200 border-brand-green-700 hover:border-brand-green-600 text-brand-green-900'
          }`}
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-full"
              />
            </>
          ) : (
            <div className="text-sm  text-center px-2">
              <p>Drag & Drop</p>
              <p>or</p>
              <p>Click</p>
            </div>
          )}

          <input
            id={id}
            name={name}
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </div>
        {value && (
          <button
            type="button"
            className="absolute top-1 right-1 bg-brand-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold hover:bg-brand-purple-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setError('');
              onChange(null);
            }}
          >
            {'✕'}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <span className="text-sm text-red-600 font-medium">{error}</span>
      )}
    </div>
  );
}
