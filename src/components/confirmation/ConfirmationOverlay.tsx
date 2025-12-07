import { useConfirmationContext } from '../../context/confirmation/useConfirmationContext';
import Button from '../buttons/Button';

export default function ConfirmationOverlay() {
  const { state, close } = useConfirmationContext();
  const { isOpen, options } = state;

  if (!isOpen || !options) return null;

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-w-md m-4 md:m-8 p-8 rounded-xl border-4 border-brand-green-500 bg-brand-purple-50 overflow-auto space-y-4">
        <h2 className="text-2xl font-bold text-brand-purple-700">
          {options.title}
        </h2>
        <p className="text-brand-green-800">{options.message}</p>
        <div className="flex flex-col sm:flex-row justify-stretch items-stretch gap-2 sm:gap-4">
          {options.buttons.map((btn, idx) => (
            <div key={idx}>
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
      </div>
    </div>
  );
}
