import React, { ReactNode } from 'react';

interface PageWrapperProps {
  title: string;
  size: 'max-w-2xl' | 'max-w-4xl' | 'max-w-6xl' | 'max-w-10xl';
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function PageWrapper({
  title,
  size = 'max-w-4xl',
  children,
  variant = 'primary',
}: PageWrapperProps) {
  return (
    <div
      className={`w-full h-full sm:w-auto sm:h-auto md:min-w-md ${
        variant === 'primary'
          ? 'bg-brand-green-600 sm:bg-gradient-to-br sm:from-brand-green-600  sm:to-brand-green-800'
          : 'bg-brand-purple-600 sm:bg-gradient-to-br sm:from-brand-purple-600  sm:to-brand-purple-800'
      }  p-0 sm:p-4 md:p-6 lg:p-8 sm:pt-2 md:pt-2 lg:pt-4 m-0 sm:m-2 md:m-4 lg:m-8 rounded-none sm:rounded-xl flex flex-col justify-stretch items-stretch ${size} overflow-hidden`}
    >
      <header className="mb-2 md:mb-4">
        <h1 className=" pl-4 sm:pl-0 text-2xl md:text-4xl font-bold text-white  [text-shadow:_1px_1px_1px_rgba(255,255,255,0.25),_-1px_-1px_1px_rgba(0,0,0,0.5)]">
          {title}
        </h1>
      </header>
      <div
        className={`flex-1 bg-brand-purple-50 p-4 sm:p-6 overflow-auto shadow-lg space-y-4 border-4 ${
          variant === 'primary'
            ? 'border-b-brand-green-600 border-r-brand-green-600 border-t-brand-green-800 border-l-brand-green-800'
            : 'border-b-brand-purple-600 border-r-brand-purple-600 border-t-brand-purple-800 border-l-brand-purple-800'
        } `}
      >
        {children}
      </div>
    </div>
  );
}
