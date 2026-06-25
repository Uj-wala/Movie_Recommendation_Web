import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type LogoutRenderProps = {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

type LogoutProps = {
  children?: (props: LogoutRenderProps) => ReactNode;
  label?: ReactNode;
  className?: string;
  disabled?: boolean;
  redirectTo?: string;
  replace?: boolean;
  confirm?: boolean;
  confirmationMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  successToastId?: string;
  toastDuration?: number;
  dismissExistingToasts?: boolean;
  dismissSuccessAfterMs?: number;
};

export default function Logout({
  children,
  label = "Logout",
  className = "",
  disabled = false,
  redirectTo = "/login",
  replace = true,
  confirm = false,
  confirmationMessage = "Are you sure you want to logout?",
  successMessage = "Logged out successfully",
  errorMessage = "Unable to logout. Please try again.",
  successToastId = "auth-logout-success",
  toastDuration = 3000,
  dismissExistingToasts = false,
  dismissSuccessAfterMs,
}: LogoutProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    if (isLoading) return;

    if (confirm && !window.confirm(confirmationMessage)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (dismissExistingToasts) {
        toast.dismiss();
      }

      localStorage.clear();
      sessionStorage.clear();

      const toastId = toast.success(successMessage, {
        id: successToastId,
        duration: toastDuration,
      });

      if (dismissSuccessAfterMs) {
        window.setTimeout(() => toast.dismiss(toastId), dismissSuccessAfterMs);
      }

      navigate(redirectTo, { replace });
    } catch (logoutError) {
      console.error("Logout failed", logoutError);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    confirm,
    confirmationMessage,
    dismissExistingToasts,
    dismissSuccessAfterMs,
    errorMessage,
    isLoading,
    navigate,
    redirectTo,
    replace,
    successMessage,
    successToastId,
    toastDuration,
  ]);

  if (children) {
    return <>{children({ logout, isLoading, error })}</>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={logout}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Logging out..." : label}
    </button>
  );
}
