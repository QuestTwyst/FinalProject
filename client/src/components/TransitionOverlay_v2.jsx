import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function TransitionOverlay() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 220);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
        background: "#0a1220",
        opacity: visible ? 1 : 0,
        backdropFilter: visible ? "blur(10px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(10px)" : "blur(0px)",
        transition: "opacity 260ms ease, backdrop-filter 260ms ease",
      }}
    />
  );
}

export default TransitionOverlay;
