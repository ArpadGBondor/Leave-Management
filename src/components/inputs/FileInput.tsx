import { useRef, useState } from 'react';

interface FileInputProps {
  value: string;
  onChange: (value: string | null) => void;
  error: string;
  setError: (value: string) => void;
}

export default function FileInput({
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
    <div className="w-full flex flex-col items-center">
      <div className="relative">
        <div
          className={` w-32 h-32 rounded-full border-8  flex items-center justify-center cursor-pointer overflow-hidden ${
            dragOver
              ? 'bg-brand-green-100 border-brand-green-600'
              : 'bg-brand-green-200 border-brand-green-700 hover:border-brand-green-600'
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
            <div className="text-sm text-gray-500 text-center px-2">
              <p>Drag & Drop</p>
              <p>or</p>
              <p>Click</p>
            </div>
          )}

          <input
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
            className="absolute top-2 right-2 bg-brand-purple-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-brand-purple-600"
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
