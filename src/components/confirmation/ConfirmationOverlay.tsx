import { useConfirmationContext } from '../../context/confirmation/useConfirmationContext';
import Button from '../buttons/Button';
import PageWrapper from '../pageWrapper/PageWrapper';

export default function ConfirmationOverlay() {
  const { state, close } = useConfirmationContext();
  const { isOpen, options } = state;

  if (!isOpen || !options) return null;

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/40">
      <PageWrapper
        title={options.title}
        size={'max-w-2xl'}
        variant="secondary"
        isModal
      >
        <p className="text-brand-green-800 mb-8">{options.message}</p>
        <div className="flex flex-col sm:flex-row justify-stretch items-stretch gap-2 sm:gap-4">
          {options.buttons.map((btn, idx) => (
            <div key={idx} className="flex-1">
              <Button
                onClick={() => {
                  close();
                  btn.callback?.();
                }}
                label={btn.label}
                variant={btn.variant}
              />
            </div>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}
