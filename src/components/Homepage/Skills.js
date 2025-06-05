
import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import gsap from 'gsap';
import { clamp } from "@popmotion/popcorn";
function useScrollConstraints(ref) {
    const [constraints, setConstraints] = useState({ top: 0, bottom: 0 });
  
    useEffect(() => {
      const element = ref.current;
      const viewportHeight = element.offsetHeight;
      const contentHeight = element.firstChild.offsetHeight;
  
      setConstraints({ top: viewportHeight - contentHeight, bottom: 0 });
    }, []);
  
    return constraints;
}

function Skills({isPlus}) {
    const y = useMotionValue(0);
    const ref = useRef(null);
  
    const { top, bottom } = useScrollConstraints(ref);
  
    function handleWheel(event) {
      event.preventDefault();
      const newY = y.get() - event.deltaY;
      const clampedY = clamp(top, bottom, newY);
      y.stop();
      y.set(clampedY);
    }
    const hideTextRefs = useRef([]);

    useEffect(() => {
      if (isPlus) {
        gsap.from(
          hideTextRefs.current,
          {
            right: '20vw',
            ease: 'power4.out',
            duration: 0.7,
            stagger: 0.3 
          }
        );
      }
    }, [isPlus]);
    return (
      <div className="SkillsContainer" ref={ref} onWheel={handleWheel}>
        <motion.div
          drag="y"
          dragConstraints={{ top, bottom }}
          className="scrollable"
          style={{ y }}
        >
          <div ref={(el) => hideTextRefs.current[0] = el} className="skill">
            <span>Machine Learning</span>
          </div>
          <div ref={(el) => hideTextRefs.current[1] = el} className="skill">
            <span>Data Structures</span>
          </div>
          <div ref={(el) => hideTextRefs.current[2] = el} className="skill">
            <span>REACT.js</span>
          </div>
          <div ref={(el) => hideTextRefs.current[3] = el} className="skill">
            <span>Express.js</span>
          </div>
          <div ref={(el) => hideTextRefs.current[4] = el} className="skill">
            <span>Python</span>
          </div>
          <div ref={(el) => hideTextRefs.current[5] = el} className="skill">
            <span>Java</span>
          </div>
          <div ref={(el) => hideTextRefs.current[6] = el} className="skill">
            <span>C++</span>
          </div>
          <div ref={(el) => hideTextRefs.current[7] = el} className="skill">
            <span>SQL</span>
          </div>
          <div ref={(el) => hideTextRefs.current[8] = el} className="skill">
            <span>Mongoose</span>
          </div>
          <div ref={(el) => hideTextRefs.current[9] = el} className="skill">
            <span>Socket</span>
          </div>

        </motion.div>
      </div>
    );
}

export default Skills

