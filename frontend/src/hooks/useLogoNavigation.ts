import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLogoDestination, shouldScrollLogoDestinationToTop } from "../utils/logoNavigation";

export const useLogoNavigation = (destinationOverride?: string) => {
  const navigate = useNavigate();

  return useCallback(() => {
    const destination = destinationOverride ?? getLogoDestination();

    navigate(destination);

    if (shouldScrollLogoDestinationToTop(destination)) {
      window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), 0);
    }
  }, [destinationOverride, navigate]);
};
