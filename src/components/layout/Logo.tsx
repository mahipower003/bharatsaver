import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#3B82F6" />
      <path
        d="M23.5 10.5H11.75C10.0917 10.5 9.25 11.3333 9.25 13C9.25 14.6667 10.0917 15.5 11.75 15.5H16.25V18.5H11.75C10.0917 18.5 9.25 19.3333 9.25 21C9.25 22.6667 10.0917 23.5 11.75 23.5H23.5V20.5H16.25V18.5H23.5V15.5H11.75V13.5H23.5V10.5Z"
        fill="white"
      />
    </svg>
  );
}
