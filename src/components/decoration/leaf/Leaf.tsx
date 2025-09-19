import { sizes, themes, adjacentTheme } from './types';
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
      className={`absolute z-0 ${sizes[size]} rounded-full rounded-bl-none rounded-tr-none ${themes[theme]} ${position} overflow-hidden`}
      style={{ rotate: `${rotation}deg` }}
    >
      <NestedLeaf size={size} theme={theme} baseTheme={theme} layers={layers} />
    </div>
  );
}
