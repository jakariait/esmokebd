import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react"; // or any icon you like

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  // Show/hide button on scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-10 right-6 primaryBgColor accentTextColor p-3 rounded-full shadow-lg z-50 transition-all duration-300 cursor-pointer"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    )
  );
};

export default ScrollToTop;