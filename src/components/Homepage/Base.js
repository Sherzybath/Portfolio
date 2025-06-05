
import React, { useRef, useState, useEffect } from 'react';
import Compiler from "./Compiler";
import InfoBox from "./InfoBox";
import { motion, useDragControls } from 'framer-motion';
import Transition from '../../Transition'
import TransitionBase from '../../TransitionBase';
import Skills from './Skills';
import ADHD from './ADHD'
import About from './About';
import Contacts from './Contacts';
import Education from './Education';
import gsap from 'gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck} from '@fortawesome/free-solid-svg-icons';
function Base() {
  // REFERENCES
  // REFERENCES
  // REFERENCES
  const boardRef = useRef(null);
  const compilerRef = useRef(null); 
  const infoBoxRefs = useRef([]);
  const skillsBoxRefs = useRef([]);
  const hideTextRefs = useRef([]);
  const baseRefs = useRef([]);
  const trackpadRef = useRef(null);
  const popupRef = useRef(null);

  // USESTATES
  // USESTATES
  // USESTATES
  const [isAbout, setAbout] = useState(false)
  const [isPlus, setPlus] = useState(null);
  const [isHelp, setHelp] = useState(false);
  // DRAG CONTROL
  // DRAG CONTROL
  // DRAG CONTROL
  const controls = useDragControls()
  function startDrag(event) {
    controls.start(event)
  }
  // PopUpAnimation
  // PopUpAnimation
  // PopUpAnimation
  // PopUpAnimation

  const triggerPopup = () => {
    const tl = gsap.timeline();
  
    // Initial state: visible but collapsed
    tl.set(popupRef.current, { opacity: 1, borderWidth: '1px' });
  
    // Slide up
    tl.to(popupRef.current, {
      y: '-15vh',
      duration: 0.6,
      ease: 'power4.out'
    })
  
    // Expand width and increase border
    .to(popupRef.current, {
      width: '9vw',
      borderWidth: '3px',
      duration: 0.4,
      ease: 'power2.out'
    }, "-=0.2")
  
    // Fade in the text
    .to('.popup-text', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  
    // Wait, then fade out text
    .to('.popup-text', {
      delay: 0.5,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    })
  
    // Collapse width and shrink border
    .to(popupRef.current, {
      width: '0vw',
      borderWidth: '0.5px',
      duration: 0.4,
      ease: 'power2.in'
    })
  
    // Slide back down and hide
    .to(popupRef.current, {
      delay:0.2,
      y: '0vh',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in'
    }, "-=0.3");
  };
  
  
  // TEXT REVEAL
  // TEXT REVEAL
  // TEXT REVEAL
  useEffect(() => {
    if (isPlus) {
      gsap.fromTo(
        baseRefs.current[0],
        { scale: 0, opacity: 0, transformOrigin: 'bottom right' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      )
      gsap.fromTo(
        baseRefs.current[1],
        { scale: 0, opacity: 0, transformOrigin: 'bottom right' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      )
      gsap.fromTo(
        baseRefs.current[2],
        { scale: 0, opacity: 0, transformOrigin: 'top' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      )
      gsap.from(
        baseRefs.current[3],
        { bottom: '20vw',
          ease: 'power4.out',
          duration: 1.7,
        },
      )
      gsap.fromTo(
        trackpadRef.current,
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      )
      gsap.fromTo(
        baseRefs.current[4],
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      )
    }
    
  }, [isPlus]);
  
  return (
    <div className="board" >

      <div className='abouts'>
        <div className='col'>
          <div className="line">
            <motion.div 
              drag 
              dragConstraints={{left: 0, top:0, right:0, bottom:0}} 
              dragElastic={0.5}
              whileDrag={{scale:1.2, zIndex:10}} 
              ref={(el) => infoBoxRefs.current[0] = el} className='infobox AboutInfo'>
                <h1 ref={(el) => baseRefs.current[0] = el}>Siddharth Vethody</h1>
                <About isPlus={isPlus} />
            </motion.div>
            <div ref={boardRef}> <Compiler control={controls} compilerRef={compilerRef} infoBoxRefs={infoBoxRefs.current} boardRef={boardRef} isPlus={isPlus} setPlus={setPlus} isHelp={isHelp} setHelp={setHelp}/></div>
            
          </div>
          <div className="line">
            <motion.div 
                drag 
                dragControls={controls}
                dragConstraints={{left: 0, top:0, right:0, bottom:0}} 
                dragElastic={0.5}
                whileDrag={{scale:1.2, zIndex:10}} 
                ref={(el) => infoBoxRefs.current[2] = el} className='infobox EducationInfo'>
                  <h1 ref={(el) => baseRefs.current[1] = el} >SkillSet</h1>
                  <Education isPlus={isPlus} />
            </motion.div>
            <div 
              ref={(el) => infoBoxRefs.current[3] = el} className='infobox AdhdInfo'>
                
                <h1 ref={(el) => baseRefs.current[2] = el}>ADHD</h1>
                <div ref={trackpadRef} onPointerDown={startDrag} className='trackpad'></div>
            </div>
            
          </div>
        </div>
        <div className='col'>
        <motion.div 
              drag 
              dragControls={controls}
              dragConstraints={{left: 0, top:0, right:0, bottom:0}} 
              dragElastic={0.5}
              whileDrag={{scale:1.2, zIndex: 10}} 
              ref={(el) => infoBoxRefs.current[1] = el} className='infobox SkillsInfo'>
                <h1><span className='hide-text' ref={(el) => baseRefs.current[3] = el}>Skills</span></h1>
                <Skills isPlus={isPlus} />
            </motion.div>
          <motion.div 
              drag 
              dragControls={controls}
              dragConstraints={{left: 0, top:0, right:0, bottom:0}} 
              dragElastic={0.5}
              whileDrag={{scale:1.2, zIndex:10}} 
              ref={(el) => infoBoxRefs.current[4] = el} className='infobox ContactInfo'>
                <h1 ref={(el) => baseRefs.current[4] = el}><span>Contact</span><span>  </span><i>me</i></h1>
                <Contacts Popup={triggerPopup} isPlus={isPlus} />
            </motion.div>
        </div>
        <div ref={popupRef} className='PopUp'><span className='popup-text'>Link Copied</span></div>
      </div>
      
  </div>
  )
}

export default Transition(Base)