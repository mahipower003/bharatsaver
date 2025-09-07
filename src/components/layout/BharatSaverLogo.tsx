import type { SVGProps } from 'react';

export function BharatSaverLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        className="text-primary"
        fill="currentColor"
      />
      <path
        d="M15.25 14.5C15.25 15.3284 14.5784 16 13.75 16H9.5M15.25 11.5H9.5M12.5 8.5H9.5C8.67157 8.5 8 9.17157 8 10C8 10.8284 8.67157 11.5 9.5 11.5H12.5C13.8807 11.5 15 10.3807 15 9C15 7.61929 13.8807 6.5 12.5 6.5H8"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
