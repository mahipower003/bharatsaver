import type { SVGProps } from 'react';

export function BharatSaverLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M33.3333 14.1667V22.5C33.3333 23.3214 33.0946 24.1242 32.6462 24.8196L23.8899 37.5C22.2593 39.7807 20 39.7807 18.3699 37.5L6.66663 24.1667C6.66663 24.1667 6.66663 19.1667 6.66663 14.1667C6.66663 6.66667 20 3.33333 20 3.33333S33.3333 6.66667 33.3333 14.1667Z"
        fill="currentColor"
      />
      <path
        d="M25.8333 20H15.8333"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.8333 15.833H15.8333"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 11.667C19.1666 11.667 15.8333 14.167 15.8333 17.5003C15.8333 20.8337 19.1666 23.3337 22.5 23.3337C22.5 23.3337 22.5 25.0003 22.5 26.667"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
