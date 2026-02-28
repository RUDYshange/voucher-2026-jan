/**
 * FormField Component
 * 
 * Wrapper component for form inputs with consistent styling.
 * Provides label, error message display, optional hint text, and required field indicator.
 * Used throughout the application for consistent form appearance and validation handling.
 * 
 * @component
 * @param {FormFieldProps} props - Component props
 * @returns {JSX.Element} A form field container with label and optional error/hint
 */

import type React from "react"

/**
 * FormFieldProps
 * 
 * @typedef {Object} FormFieldProps
 * @property {string} label - The label text displayed above the input
 * @property {string} [error] - Error message to display below the input (if validation failed)
 * @property {boolean} [required=false] - Whether to show the required asterisk indicator
 * @property {React.ReactNode} children - The form input element(s) to wrap
 * @property {string} [hint] - Helper text displayed below the input
 */
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

/**
 * FormField Component
 * 
 * Renders a labeled form field with optional error and hint text.
 * - Shows red asterisk for required fields
 * - Displays error messages in red for validation feedback
 * - Shows hint text in muted color for additional context
 * 
 * @param {FormFieldProps} props - Component props
 * @returns {JSX.Element} A form field container
 * 
 * @example
 * <FormField label="Email" error={emailError} required hint="Enter your email address">
 *   <input type="email" />
 * </FormField>
 */
export function FormField({ label, error, required = false, children, hint }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  )
}
