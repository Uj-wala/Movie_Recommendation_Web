import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const SocialAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorMessage =
      searchParams.get("error_description") ||
      searchParams.get("error") ||
      "";
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (!accessToken) {
      setError("Social authentication failed. Please try again.");
      return;
    }

    localStorage.setItem("access_token", accessToken);

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    // Store role if backend passes it in callback query params
    const role = searchParams.get("role");
    if (role) {
      localStorage.setItem("user_role", role.toLowerCase());
    }

    toast.success("Logged in successfully", {
      id: "auth-login-success",
      duration: 3000,
    });
    navigate("/dashboard", { replace: true });
  }, [navigate, searchParams]);

  useEffect(() => {
    if (!error) return;

    const timeout = window.setTimeout(() => {
      navigate("/login", {
        replace: true,
        state: { socialAuthError: error },
      });
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [error, navigate]);

  return null;
};

export default SocialAuthCallback;
