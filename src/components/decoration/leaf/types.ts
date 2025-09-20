export const sizes = {
  '12': 'w-6 h-6 md:w-8 md:h-8 xl:w-12 xl:h-12',
  '24': 'w-12 h-12 md:w-16 md:h-16 xl:w-24 xl:h-24',
  '32': 'w-16 h-16 md:w-24 md:h-24 xl:w-32 xl:h-32',
  '48': 'w-24 h-24 md:w-32 md:h-32 xl:w-48 xl:h-48',
  '96': 'w-48 h-48 md:w-64 md:h-64 xl:w-96 xl:h-96',
  '192': 'w-96 h-96 md:w-128 md:h-128 xl:w-192 xl:h-192',
};

export const themes = {
  'purple-1': 'bg-brand-purple-100',
  'purple-2': 'bg-brand-purple-200',
  'purple-3': 'bg-brand-purple-300',
  'purple-4': 'bg-brand-purple-400',
  'green-1': 'bg-brand-green-100',
  'green-2': 'bg-brand-green-200',
  'green-3': 'bg-brand-green-300',
  'green-4': 'bg-brand-green-400',
  white: 'bg-white',
};

export const adjacentTheme: Record<keyof typeof themes, keyof typeof themes> = {
  'purple-1': 'green-4',
  'purple-2': 'green-3',
  'purple-3': 'green-2',
  'purple-4': 'green-1',
  'green-1': 'purple-4',
  'green-2': 'purple-3',
  'green-3': 'purple-2',
  'green-4': 'purple-1',
  white: 'green-2',
};

export const fixBorder = 'border-2 border-brand-green-500';
