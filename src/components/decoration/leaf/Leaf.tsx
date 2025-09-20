import { sizes, themes, fixBorder } from './types';
import NestedLeaf from './NestedLeaf';

interface LeafDecorProps {
  size?: keyof typeof sizes;
  theme?: keyof typeof themes;
  rotation?: number; // degrees
  position?: string; // tailwind position classes
  layers?: number; // depth of nesting
}

export default function Leaf({
  size = '32',
  theme = 'white',
  rotation = 0,
  position = '',
  layers = 8,
}: LeafDecorProps) {
  return (
    <div
      className={`absolute z-0 ${sizes[size]} rounded-full rounded-bl-none rounded-tr-none ${themes[theme]} ${fixBorder} ${position} overflow-hidden`}
      style={{ rotate: `${rotation}deg` }}
    >
      <NestedLeaf size={size} theme={theme} baseTheme={theme} layers={layers} />
      <div className="w-full h-full flex justify-center items-center">
        <hr
          className={` ${fixBorder} absolute border-t-0 md:border-t-0`}
          style={{
            rotate: '135deg',
            width: '200%',
          }}
        />
      </div>
    </div>
  );
}
