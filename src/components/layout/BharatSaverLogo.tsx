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
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        fill="currentColor"
        className="text-primary"
      />
      <path
        d="M10.5 8.5H14.5M10.5 11.5H14.5M12.5 11.5C13.6046 11.5 14.5 10.6046 14.5 9.5C14.5 8.39543 13.6046 7.5 12.5 7.5H10.5C9.39543 7.5 8.5 8.39543 8.5 9.5V14.5L10.5 12.5"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
