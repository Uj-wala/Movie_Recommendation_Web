import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
