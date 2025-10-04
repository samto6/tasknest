import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-bold uppercase tracking-wide text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-4 py-2.5
            bg-background border-2 border-border rounded-[8px]
            text-foreground placeholder:text-muted
            transition-all duration-150
            focus:border-sage-green focus:outline-none focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-dusty-rose focus:border-dusty-rose" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-dusty-rose flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="8" cy="11.5" r="0.5" fill="currentColor"/>
            </svg>
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="text-sm text-muted">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
