import React, { useRef } from 'react'
import gsap from 'gsap';
import { useEffect } from 'react';
function About({isPlus}) {
  const hideTextRefs = useRef([]);

  useEffect(() => {
    if (isPlus) {
      gsap.from(
        hideTextRefs.current,
        {
          top: '20vw',
          ease: 'power4.out',
          duration: 1.5,
          stagger: 0.3 
        }
      );
      console.log('here2')
      console.log(hideTextRefs.current)
    }
    
  }, [hideTextRefs, isPlus]);
  return (
    <div className='Sherzybath'>
      <span><span ref={(el) => hideTextRefs.current[0] = el} className='hide-text'>Fast and <i>efficient</i> when given </span></span>
      <span><span ref={(el) => hideTextRefs.current[1] = el} className='hide-text'>a task, but <strong>creativity</strong> is always</span></span>
      <span><span ref={(el) => hideTextRefs.current[2] = el} className='hide-text'>going to be a <u>slow</u> process.</span></span>
      
    </div>
  )
}

export default About