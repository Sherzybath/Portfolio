import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const DraggableExpandableDiv = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const divRef = useRef(null);

  // Handle resizing of the window
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep the div in a fixed position relative to the viewport
  useEffect(() => {
    const handleScroll = () => {
      if (divRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        divRef.current.style.top = `${rect.top}px`;
        divRef.current.style.left = `${rect.left}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle expanding and collapsing the div
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Ensure the div stays within the screen boundaries
  const handleDragEnd = (event, info) => {
    if (divRef.current) {
      const { x, y } = info.point;
      const { width, height } = divRef.current.getBoundingClientRect();

      let newX = x;
      let newY = y;

      if (x + width > windowSize.width) {
        newX = windowSize.width - width;
      }
      if (x < 0) {
        newX = 0;
      }
      if (y + height > windowSize.height) {
        newY = windowSize.height - height;
      }
      if (y < 0) {
        newY = 0;
      }

      divRef.current.style.left = `${newX}px`;
      divRef.current.style.top = `${newY}px`;
    }
  };

  return (
    <motion.div
      ref={divRef}
      drag
      dragConstraints={{ left: 0, right: windowSize.width, top: 0, bottom: windowSize.height }}
      onDragEnd={handleDragEnd}
      onClick={handleToggleExpand}
      style={{
        position: 'fixed',
        width: isExpanded ? '300px' : '100px',  // Adjust width based on expanded state
        height: isExpanded ? '300px' : '100px', // Adjust height based on expanded state
        backgroundColor: 'lightblue',
        top: '50px',  // Set initial position
        left: '50px', // Set initial position
      }}
    >
      Click and Drag Me!
    </motion.div>
  );
};

export default DraggableExpandableDiv;
