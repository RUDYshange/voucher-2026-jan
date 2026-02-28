/**
 * Utility Functions Module
 * 
 * Common utility functions used throughout the application.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge CSS class names with Tailwind CSS aware deduplication
 * 
 * Combines clsx for conditional classes with twMerge for Tailwind-specific merging.
 * This prevents conflicting Tailwind classes from both being applied.
 * 
 * @param {...ClassValue[]} inputs - CSS class strings and conditional objects
 * @returns {string} Merged CSS class string with duplicates removed
 * 
 * @example
 * cn("px-4 py-2", condition && "bg-blue-500")
 * cn("px-4", "px-8") // Returns "px-8" (no duplication)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
