import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, className = "", children, disabled, ...props }, ref) => {
    const baseStyles = "font-medium transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0";

    const variantStyles = {
      primary: "bg-sage-green text-white border-2 border-sage-green hover:bg-[#6D8A6F] hover:border-[#6D8A6F]",
      secondary: "bg-transparent text-foreground border-2 border-border hover:bg-surface",
      ghost: "bg-transparent text-foreground hover:bg-surface",
      danger: "bg-dusty-rose text-white border-2 border-dusty-rose hover:bg-[#D46550] hover:border-[#D46550]",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm rounded-[6px]",
      md: "px-4 py-2 text-base rounded-[8px]",
      lg: "px-6 py-3 text-lg rounded-[8px]",
    };

    const shadowStyles = {
      primary: "shadow-[4px_4px_0px_rgba(132,169,140,0.4)] active:shadow-[2px_2px_0px_rgba(132,169,140,0.4)]",
      secondary: "shadow-[4px_4px_0px_rgba(45,49,66,0.15)] active:shadow-[2px_2px_0px_rgba(45,49,66,0.15)]",
      ghost: "",
      danger: "shadow-[4px_4px_0px_rgba(224,122,95,0.4)] active:shadow-[2px_2px_0px_rgba(224,122,95,0.4)]",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${shadowStyles[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
