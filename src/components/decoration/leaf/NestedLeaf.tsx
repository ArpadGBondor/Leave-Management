import { sizes, themes, adjacentTheme } from './types';
export default function NestedLeaf({
  size,
  theme,
  baseTheme,
  layers,
  depth = 1,
}: {
  size: keyof typeof sizes;
  theme: keyof typeof themes;
  baseTheme: keyof typeof themes;
  layers: number;
  depth?: number;
}) {
  if (layers <= 0) return null;

  // alternate automatically: odd layers use adjacent theme
  const currentTheme = depth % 2 === 0 ? baseTheme : adjacentTheme[baseTheme];

  return (
    <div
      className={`absolute z-0 w-full h-full rounded-full rounded-bl-none rounded-tr-none ${themes[currentTheme]} top-[10%] -left-[10%]`}
    >
      <NestedLeaf
        size={size}
        theme={theme}
        baseTheme={baseTheme}
        layers={layers - 1}
        depth={depth + 1}
      />
    </div>
  );
}
