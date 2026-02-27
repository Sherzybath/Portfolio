import React from 'react'
import Transition from '../../Transition'
import Compiler from './Compiler'
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import Rilli from './Rilli/Rilli'
import { CSSPlugin } from "gsap/CSSPlugin";
import {motion, AnimatePresence} from 'framer-motion'
import SkillWeave from './SkillWeave/SkillWeave'
import Rentique from './Rentique/Rentique'

function Project() {
  // REFERENCES
  // REFERENCES
  // REFERENCES
  const boardRef = useRef(null)
  const compilerRef = useRef(null)
  const overlayRef = useRef(null)
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const titleRef = useRef(null)
  const spanRefs = useRef([])
  const projectCont = useRef(null)
  const PillarsRef = useRef([])
  // USE STATES
  // USE STATES
  // USE STATES
  const [swapTick, setSwapTick] = useState(0);
  const [currentComponent, setCurrentComponent] = useState('Rilli');
  const [isHelp, setHelp] = useState(false);

  // SWAP COLOR
  // SWAP COLOR
  // SWAP COLOR
  const themes = {
    Rilli: {
      "--primary-color": "#b29577",
      "--secondary-color": "#1a1a1a",
    },
    SkillWeave: {
      "--primary-color": "#fff4f0",
      "--secondary-color": "#13544e",
    },
    Rentique: {
      "--primary-color": "#1a1a1a",
      "--secondary-color": "#ececec",
    }
  };

  // Apply color theme when switching components
  useEffect(() => {
    const theme = themes[currentComponent];
    if (theme) {
      gsap.to(document.documentElement, {
        "--primary-color": theme["--primary-color"],
        "--secondary-color": theme["--secondary-color"],
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [currentComponent]);
  // LANDING PAGE
  // LANDING PAGE
  // LANDING PAGE
  function revealLandingPage(){
    gsap.to(heroRef.current, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      delay: 0.85,
      duration: 2,
      ease: "power4.inOut",
      onStart: () => {
        gsap.to(heroRef.current, {
          transform: "translate(-50%, -50%) scale(1)",
          duration: 2.25,
          ease: "power3.inOut",
          delay: 0.25,
        })
        gsap.to(overlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 2,
          delay: 0.5,
          ease: "power4.inOut"
        })
        gsap.to(videoRef.current, {
          transform: 'scale(1)',
          duration: 2.25,
          ease: "power3.inOut",
          delay: 0.5,
        })
        gsap.to(compilerRef.current, {
          top: '2vh',
          left: '1.5vw',
          opacity: '1',
          duration: 0.5,
          ease: "power3.out",
          delay: 3,
        })
        gsap.to(projectCont.current, {
          y: '0',       // Start from below the screen
          yPercent: 0,      // Ensure no unexpected percentage shift
          top: 0,           // Ensures the final position is top: 0
          duration: 1,    
          ease: "power3.out",
          delay: 2,
        })
        gsap.to(PillarsRef.current, {
          y: '0',       // Start from below the screen
          stagger: 0.3,
          yPercent: 0,      // Ensure no unexpected percentage shift
          top: 0,           // Ensures the final position is top: 0
          duration: 0.5,    
          ease: "power3.out",
          delay: 2.5,
        })
        gsap.to(spanRefs.current, {
          y:0,
          stagger:0.1,
          duration: 2,
          ease: 'power4.inOut',
          delay: 0.75,
        })
      }
    })
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    revealLandingPage(); 
    
  }, [titleRef, currentComponent]);


  // SPLIT TEXT
  // SPLIT TEXT
  // SPLIT TEXT


  const triggerSwap = () => setSwapTick((prev) => prev + 1);

  return (
    <div ref={boardRef} className='ProjectDisplay'>
      
      <Compiler boardRef={boardRef} compilerRef={compilerRef} currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} isHelp={isHelp} setHelp={setHelp} triggerSwap={triggerSwap}/>
      {currentComponent === 'Rilli' && <Rilli PillarsRef={PillarsRef} projectCont={projectCont} overlayRef={overlayRef} heroRef={heroRef} videoRef={videoRef} titleRef={titleRef} spanRefs={spanRefs}/>}
      {currentComponent === 'SkillWeave' && <SkillWeave PillarsRef={PillarsRef} projectCont={projectCont} overlayRef={overlayRef} heroRef={heroRef} videoRef={videoRef} titleRef={titleRef} spanRefs={spanRefs}/>}
      {currentComponent === 'Rentique' && <Rentique PillarsRef={PillarsRef} projectCont={projectCont} overlayRef={overlayRef} heroRef={heroRef} videoRef={videoRef} titleRef={titleRef} spanRefs={spanRefs}/>}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={swapTick + "-in"}
          className="slide-in"
          initial = {{scaleY:0}}
          animate = {{scaleY:0}}
          exit={{scaleY:1}}
          transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
        />

        <motion.div
          key={swapTick + "-out"}
          className="slide-out"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }} 
          exit={{ scaleY: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </div>
  )
}

export default Transition(Project)