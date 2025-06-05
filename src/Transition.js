import { motion } from "framer-motion";
import React, { useEffect } from "react";

const Transition = (OgComponent) => {
  return function WrappedComponent(props) {
    useEffect(() => {
      const spans = document.querySelectorAll(".slideText");

      // Entry animation (add "active")
      spans.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.add("active");
        }, idx * 100); // staggered
      });

      // Exit animation (replace "active" with "fade")
      setTimeout(() => {
        spans.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.remove("active");
            span.classList.add("fade");
          }, idx * 100);
        });
      }, 500); // Start fade out after ~2.3s
    }, []);

    return (
      <>
        <OgComponent {...props} />

        <motion.div
          className="slide-in"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="slideText">Sherzy</span>
            <span className="slideText">Bath</span>
          </div>
          </motion.div>

        <motion.div
          className="slide-out"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ delay: 1.3, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="slideText">Sherzy</span>
            <span className="slideText">Bath</span>
          </div>
        </motion.div>
      </>
    );
  };
};

export default Transition;
