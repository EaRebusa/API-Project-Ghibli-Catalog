import React from "react";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";

export const ConfettiButton = React.forwardRef(
  ({ children, className, manualTrigger, ...props }, ref) => {
    const [isConfettiActive, setIsConfettiActive] = React.useState(false);

    // --- NEW: Trigger confetti when the manualTrigger prop changes ---
    React.useEffect(() => {
      if (manualTrigger > 0) {
        handleConfetti();
      }
      // We don't want to re-run this for handleConfetti, so we disable the lint rule here.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manualTrigger]);

    const handleConfetti = (e) => {
      if (e) e.stopPropagation(); // Stop propagation if clicked directly
      if (isConfettiActive) return;

      setIsConfettiActive(true);
      setTimeout(() => {
        setIsConfettiActive(false);
      }, 4000); // Confetti lasts for 4 seconds
    };

    return (
      <div ref={ref} className={className} {...props}>
        {/* --- FIX: Use a Portal to render the confetti outside the card's DOM tree --- */}
        {isConfettiActive &&
          createPortal(
            <Confetti
              // Use window dimensions to cover the whole screen
              width={window.innerWidth}
              height={window.innerHeight}
              // Ensure it's on top of everything
              style={{ position: "fixed", top: 0, left: 0, zIndex: 10001 }}
              // Create a "shower" from the top
              confettiSource={{
                x: 0,
                y: 0,
                w: window.innerWidth,
                h: 0,
              }}
              recycle={false}
              numberOfPieces={400} // More pieces for a full shower effect
              gravity={0.12} // A gentle pull downwards
              initialVelocityY={10} // A small initial push
            />,
            document.body // Render directly into the body tag
          )}
        {children}
      </div>
    );
  },
);