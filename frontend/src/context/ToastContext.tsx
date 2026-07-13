import { createContext, useContext, type ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  function showToast(message: string, type: ToastType = "success") {
    toast[type](message);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1D1A24",
            color: "#fff",
            border: "1px solid #2A2633",
            borderRadius: 12,
            fontSize: 14,
          },
        }}
      />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
