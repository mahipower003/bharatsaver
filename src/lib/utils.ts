import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, short: boolean = false) {
    if (short) {
        if (Math.abs(value) >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)}Cr`;
        }
        if (Math.abs(value) >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`;
        }
         if (Math.abs(value) >= 1000) {
            return `₹${(value / 1000).toFixed(1)}k`;
        }
        return `₹${value.toFixed(0)}`;
    }
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
}
