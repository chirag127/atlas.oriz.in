import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-ui text-atlas-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-atlas-bg-tertiary border border-atlas-border rounded-lg text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:border-atlas-accent-emerald transition-colors font-ui text-sm ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
