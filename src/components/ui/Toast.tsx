"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const styles = {
    success: "bg-mint-green/20 border-mint-green text-mint-green",
    error: "bg-dusty-rose/20 border-dusty-rose text-dusty-rose",
    info: "bg-sage-green/20 border-sage-green text-sage-green",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      className={`
        pointer-events-auto
        px-4 py-3 rounded-[8px]
        border-2 ${styles[toast.type]}
        shadow-[4px_4px_0px_rgba(45,49,66,0.2)]
        animate-toast-slide-in
        backdrop-blur-sm
        min-w-[280px]
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icons[toast.type]}</span>
        <span className="font-medium text-sm">{toast.message}</span>
      </div>
    </div>
  );
}
