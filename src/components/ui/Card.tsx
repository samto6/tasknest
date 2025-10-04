import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
}

export default function Card({ header, footer, noPadding = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface border-2 border-border rounded-[8px] shadow-[4px_4px_0px_rgba(45,49,66,0.15)] ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b-2 border-border">
          {header}
        </div>
      )}
      <div className={noPadding ? "" : "p-6"}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t-2 border-border bg-warm-gray-100 dark:bg-[#1A1A1E]">
          {footer}
        </div>
      )}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`font-semibold text-xl ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`font-semibold text-lg ${className}`}>{children}</h3>;
}

export function CardDescription({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`text-muted text-sm ${className}`}>{children}</p>;
}
