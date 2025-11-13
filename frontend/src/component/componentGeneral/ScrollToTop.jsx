import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior (handled by CSS)
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll to top
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
