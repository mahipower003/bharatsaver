import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="20" x2="40" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" />
      <path
        d="M23.116 14.3H16.888C15.908 14.3 15.148 14.6 14.608 15.1C14.068 15.6 13.8 16.276 13.8 17.128C13.8 17.98 14.068 18.664 14.608 19.18C15.148 19.696 15.908 19.952 16.888 19.952H25.3V21.608H16.888L13.864 25.7H25.564V27.4H12V25.7L18.736 18.256C19.096 17.848 19.276 17.452 19.276 17.068C19.276 16.54 19.06 16.12 18.628 15.808C18.196 15.496 17.62 15.34 16.9 15.34H12V14.3H13.6V12.6H23.116V14.3Z"
        fill="white"
      />
    </svg>
  );
}
