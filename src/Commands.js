
import gsap from 'gsap';


export const handleTransitionProjects = (navigate) => {
  
  navigate("/project")
}
export const onShakeAnimation = (compilerRef) => {
  gsap.to(compilerRef.current, {
    x: '+=20',
    duration: 0.1, 
    ease: 'power1.inOut',
    repeat: 5, 
    yoyo: true,

  });
};

// COMPILER LOAD
// COMPILER LOAD
// COMPILER LOAD

export const onLoadAnimation = (compilerRef, setOpen) => {
  
  gsap.to(compilerRef.current, {
    width: '25vw',
    duration: 0.9,
    ease: 'power4.out'
  });
  setOpen(true)
}
export const undoLoad = (compilerRef, setOpen, setHelp, listRef) => {
  gsap.to(compilerRef.current, {
    width: '3.5vw',
    duration: 0.9,
    ease: 'power4.out'
  });
  gsap.to(compilerRef.current, {
    height: '4vw',
    duration: 0.9,
    ease: 'power4.out'
  });

  gsap.to(listRef.current, {
    opacity: 0,
    duration: 0.1,
    ease: 'power5.in'
  });
  setHelp(false)
  setOpen(false)
}

// HELP COMPILER
// HELP COMPILER
// HELP COMPILER

export const handleHelpCommand = (compilerRef, listRef,setHelp) => {
  gsap.to(compilerRef.current, {
    height: 'auto',
    duration: 0.6,
    ease: 'power4.out'
  });

  gsap.to(listRef.current, {
    opacity: 1,
    duration: 0.7,
    ease: 'power4.in'
  });
  setHelp(true)
};
export const unhandleHelpCommand = (compilerRef, listRef, setHelp) => {
  gsap.to(compilerRef.current, {
    height: '4vw',
    duration: 0.3,
    ease: 'power1.inOut'
  });

  gsap.to(listRef.current, {
    opacity: 0,
    duration: 0.2,
    ease: 'power1.inOut'
  });
  setHelp(false)
};

// HELP PROJECT
// HELP PROJECT
// HELP PROJECT

export const helpProject = (compilerRef,listRef, setHelp) => {
  gsap.to(compilerRef.current, {
    height: 'auto',
    duration: 0.6,
    ease: 'power4.out'
  });

  gsap.to(listRef.current, {
    opacity: 1,
    duration: 0.7,
    ease: 'power4.in'
  });
  setHelp(true)
}

// ABOUTME
// ABOUTME
// ABOUTME
export const aboutMeCommand = (infoBoxRefs, setPlus, setAbout) => {
  const timeline = gsap.timeline();

  // Adding animations to the timeline
  timeline
    .fromTo(
      infoBoxRefs[0],
      { scale: 0, opacity: 0, transformOrigin: 'bottom right' },
      { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    .fromTo(
      infoBoxRefs[2],
      { scale: 0, opacity: 0, transformOrigin: 'top right' },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power4.out' },
      0 // Start at the same time as the first animation
    )
    .fromTo(
      infoBoxRefs[4],
      { scale: 0, opacity: 0, transformOrigin: 'top left' },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'power4.out' },
      0 // Start at the same time as the first animation
    )
    .fromTo(
      infoBoxRefs[1],
      { scale: 0, opacity: 0, transformOrigin: 'left' },
      { scale: 1, opacity: 1, duration: 0.7, ease: 'power4.out' },
      0 // Start at the same time as the first animation
    )
    .fromTo(
      infoBoxRefs[3],
      { scale: 0, opacity: 0, transformOrigin: 'top' },
      { scale: 1, opacity: 1, duration: 1.1, ease: 'power4.out' },
      0 // Start at the same time as the first animation
    )
        setPlus(true)
};

export const closeAboutMe = (infoBoxRefs, setPlus) => {
  gsap.fromTo(
    infoBoxRefs[0],
    {
      scale: 1,
      opacity: 1,
      transformOrigin: 'bottom right',
    },
    {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: 'power4.in',
    }
  );
  
  gsap.fromTo(
    infoBoxRefs[2],
    {
      scale: 1,
      opacity: 1,
      transformOrigin: 'top right',
    },
    {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.in',
    }
  );
  
  gsap.fromTo(
    infoBoxRefs[4],
    {
      scale: 1,
      opacity: 1,
      transformOrigin: 'top left',
    },
    {
      scale: 0,
      opacity: 0,
      duration: 0.9,
      ease: 'power4.in',
    }
  );
  
  gsap.fromTo(
    infoBoxRefs[1],
    {
      scale: 1,
      opacity: 1,
      transformOrigin: 'left',
    },
    {
      scale: 0,
      opacity: 0,
      duration: 0.7,
      ease: 'power4.in',
    }
  );
  
  gsap.fromTo(
    infoBoxRefs[3],
    {
      scale: 1,
      opacity: 1,
      transformOrigin: 'top',
    },
    {
      scale: 0,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.in',
    }
  );
  
      setPlus(false)
}