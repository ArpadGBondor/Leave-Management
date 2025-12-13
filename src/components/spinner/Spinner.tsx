import React from 'react';

/**
 * Spinner component for React + Tailwind projects
 * - TypeScript + Tailwind utility classes
 * - Accessible: `role="status"` + visually-hidden label
 * - Props: size, variant (color), label, inline, className, thickness
 *
 * Example usage:
 *   import Spinner from "./components/Spinner";
 *   <Spinner />
 *   <Spinner size="lg" variant="accent" label="Saving..." />
 */

type SizeKeyword = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  size?: SizeKeyword | number; // keyword or pixel size (number)
  variant?: 'primary' | 'secondary';
  label?: string | null; // screen-reader label; null to hide
  inline?: boolean; // whether spinner should flow inline with text
  className?: string;
  thickness?: number; // stroke width in the SVG coordinate system
};

const sizeMap: Record<SizeKeyword, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorMap: Record<NonNullable<Props['variant']>, string> = {
  primary: 'text-brand-purple-600',
  secondary: 'text-brand-green-600',
};

export default function Spinner({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  inline = false,
  className = '',
  thickness = 4,
}: Props) {
  const sizeClass = typeof size === 'number' ? '' : sizeMap[size];
  const inlineClass = inline ? 'inline-block' : 'block';
  const colorClass = colorMap[variant];

  const style: React.CSSProperties =
    typeof size === 'number' ? { width: size, height: size } : {};

  return (
    <span
      role="status"
      aria-live="polite"
      className={`${inlineClass} ${sizeClass} ${colorClass} ${className} motion-reduce:animate-none`}
      style={style}
    >
      <svg
        className="animate-spin"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={label === null}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth={thickness}
          opacity="0.15"
        />

        <path
          d="M45 25a20 20 0 0 1-20 20"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {label !== null ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
