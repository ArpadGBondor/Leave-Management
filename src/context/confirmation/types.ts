import { ConfirmationState } from './ConfirmationContext';

export type ConfirmationButton = {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  callback?: () => void;
};

export type ConfirmationOptions = {
  title: string;
  message: string;
  buttons: ConfirmationButton[];
};

export const TestConfirmationState: ConfirmationState = {
  isOpen: true,
  options: {
    title: 'Testing Confirmation Modal',
    message: 'This is just a test',
    buttons: [
      {
        label: 'Option 1',
        callback: () => console.log('Option 1'),
        variant: 'primary',
      },
      {
        label: 'Option 2',
        callback: () => console.log('Option 2'),
        variant: 'danger',
      },
      {
        label: 'Cancel',
        variant: 'secondary',
      },
    ],
  },
};
