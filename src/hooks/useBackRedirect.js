import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @param {string|null} redirectPath - where to redirect on back
 * @param {boolean} disableBack - if true, completely blocks back button
 */
const useBackRedirect = (redirectPath = "/", disableBack = false) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBack = () => {
      if (disableBack) {
        // 🔴 Completely block back
        window.history.pushState(null, "", window.location.href);
      } else {
        // 🟢 Redirect instead of going back
        navigate(redirectPath, { replace: true });
      }
    };

    // Push current page into history stack
    window.history.pushState(null, "", window.location.href);

    // Listen for back button
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate, redirectPath, disableBack]);
};

export default useBackRedirect;