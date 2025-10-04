import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "wellness" | "streak";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-warm-gray-200 text-warm-gray-600 border-warm-gray-300",
    success: "bg-mint-green/20 text-mint-green border-mint-green/40",
    warning: "bg-mustard-yellow/20 text-[#D4A574] border-mustard-yellow/40",
    danger: "bg-dusty-rose/20 text-dusty-rose border-dusty-rose/40",
    wellness: "bg-soft-lavender/20 text-soft-lavender border-soft-lavender/40",
    streak: "bg-warm-coral/20 text-warm-coral border-warm-coral/40",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2.5 py-0.5
        text-xs font-semibold uppercase tracking-wide
        border-2 rounded-[6px]
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
