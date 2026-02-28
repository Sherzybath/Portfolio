import React, { useRef, useState, useEffect } from 'react';
import Compiler from "./Compiler";
import { motion } from 'framer-motion';
import Transition from '../../Transition';
import Skills from './Skills';
import About from './About';
import Contacts from './Contacts';
import Education from './Education';
import AsteroidsMini from './AsteroidsMini';
import gsap from 'gsap';

function Base() {
  const stageRef = useRef(null);
  const boardRef = useRef(null);
  const compilerRef = useRef(null);
  const infoBoxRefs = useRef([]);
  const baseRefs = useRef([]);
  const trackpadRef = useRef(null);
  const popupRef = useRef(null);
  const gameScreenRef = useRef(null);
  const gameModeAnimatedRef = useRef(false);

  const [isPlus, setPlus] = useState(null);
  const [isHelp, setHelp] = useState(false);
  const [isGameMode, setGameMode] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());


  const triggerPopup = () => {
    const tl = gsap.timeline();

    tl.set(popupRef.current, { opacity: 1, borderWidth: '1px' })
      .to(popupRef.current, {
        y: '-15vh',
        duration: 0.6,
        ease: 'power4.out'
      })
      .to(popupRef.current, {
        width: '9vw',
        borderWidth: '3px',
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.2')
      .to('.popup-text', {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to('.popup-text', {
        delay: 0.5,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      })
      .to(popupRef.current, {
        width: '0vw',
        borderWidth: '0.5px',
        duration: 0.4,
        ease: 'power2.in'
      })
      .to(popupRef.current, {
        delay: 0.2,
        y: '0vh',
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in'
      }, '-=0.3');
  };

  useEffect(() => {
    if (isPlus) {
      gsap.fromTo(
        baseRefs.current[0],
        { scale: 0, opacity: 0, transformOrigin: 'bottom right' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      );
      gsap.fromTo(
        baseRefs.current[1],
        { scale: 0, opacity: 0, transformOrigin: 'bottom right' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      );
      gsap.fromTo(
        baseRefs.current[2],
        { scale: 0, opacity: 0, transformOrigin: 'top' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      );
      gsap.from(
        baseRefs.current[3],
        {
          bottom: '20vw',
          ease: 'power4.out',
          duration: 1.7,
        },
      );
      gsap.fromTo(
        trackpadRef.current,
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      );
      gsap.fromTo(
        baseRefs.current[4],
        { scale: 0, opacity: 0, transformOrigin: 'center' },
        { scale: 1, opacity: 1, duration: 2, ease: 'power4.out' }
      );
    }
  }, [isPlus]);

  useEffect(() => {
    if (!isGameMode || gameModeAnimatedRef.current) return;
    gameModeAnimatedRef.current = true;

    const keyWidth = 92;
    const keyHeight = 62;
    const gap = 12;
    const stageRect = stageRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    const cx = stageRect.left + (stageRect.width / 2);
    const rowBottomY = stageRect.top + stageRect.height - 110;
    const rowTopY = rowBottomY - keyHeight - gap;

    const map = [
      { el: infoBoxRefs.current[0], key: 'Q', x: cx - keyWidth - gap, y: rowTopY },
      { el: compilerRef.current, key: '↑', x: cx, y: rowTopY },
      { el: infoBoxRefs.current[1], key: 'E', x: cx + keyWidth + gap, y: rowTopY },
      { el: infoBoxRefs.current[2], key: '←', x: cx - keyWidth - gap, y: rowBottomY },
      { el: infoBoxRefs.current[3], key: '↓', x: cx, y: rowBottomY },
      { el: infoBoxRefs.current[4], key: '→', x: cx + keyWidth + gap, y: rowBottomY },
    ].filter(item => item.el);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (gameScreenRef.current) {
      gsap.set(gameScreenRef.current, {
        display: 'block',
        autoAlpha: 0,
        scale: 0.92,
        y: 20,
        xPercent: -50,
        yPercent: -50,
      });
    }

    tl.to('.infobox > *:not(.game-key-label), .compiler > *:not(.game-key-label)', {
      opacity: 0,
      duration: 0.28,
      pointerEvents: 'none',
      ease: 'power2.out'
    }, 0);

    // Capture all element rects first, before changing any positioning.
    // This prevents layout reflow from causing "teleport" jumps.
    const measuredMap = map.map((item) => ({
      ...item,
      rect: item.el.getBoundingClientRect(),
    }));

    measuredMap.forEach(({ el, key, x, y, rect }, idx) => {
      const variance = 0;
      const tStart = 0.1 + variance;
      const tGlow = tStart + 1.04;
      const tLabel = tGlow + 1.08;

      el.classList.add('game-key');
      el.setAttribute('data-key', key);

      let label = el.querySelector('.game-key-label');
      if (!label) {
        label = document.createElement('span');
        label.className = 'game-key-label';
        label.textContent = key;
        el.appendChild(label);
      } else {
        label.textContent = key;
      }

      let ring = el.querySelector('.game-key-ring');
      if (!ring) {
        ring = document.createElement('span');
        ring.className = 'game-key-ring';
        ring.innerHTML = `
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="game-key-ring-svg">
            <rect class="game-key-ring-path" x="2" y="2" width="96" height="96" rx="14" ry="14"></rect>
          </svg>
        `;
        el.appendChild(ring);
      }

      gsap.set(el, {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        margin: 0,
        zIndex: 40,
        overflow: 'hidden',
        x: 0,
        y: 0,
      });

      gsap.set(label, { opacity: 0 });
      gsap.set(ring, { opacity: 1 });

      const ringPath = ring.querySelector('.game-key-ring-path');
      const ringLength = ringPath?.getTotalLength?.() || 400;
      const startPhase = 0;
      const fromOffset = ringLength + startPhase;
      const toOffset = fromOffset - ringLength; // always one full loop

      gsap.set(ringPath, {
        strokeDasharray: ringLength,
        strokeDashoffset: fromOffset,
        opacity: 0,
      });

      // Phase 1: shrink key at current position
      tl.to(el, {
        width: keyWidth,
        height: keyHeight,
        borderRadius: 16,
        boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
        backgroundColor: '#191919',
        duration: 0.42,
        ease: 'power2.inOut',
        force3D: true
      }, tStart);

      // Phase 2: brief hold after scaling, then move key to target position
      tl.to(el, {
        top: y,
        left: x - (keyWidth / 2),
        duration: 0.44,
        ease: 'power3.inOut',
        force3D: true
      }, tStart + 0.60);

      tl.to(ringPath, {
        opacity: 1,
        duration: 0.12,
        ease: 'power1.out'
      }, tGlow);

      tl.to(ringPath, {
        strokeDashoffset: toOffset,
        duration: 1.0,
        ease: 'power2.inOut'
      }, tGlow + 0.02);

      tl.to(ringPath, {
        opacity: 0,
        duration: 0.14,
        ease: 'power1.out'
      }, tGlow + 1.02);

      tl.to(label, {
        opacity: 1,
        duration: 0.24,
        ease: 'power2.out'
      }, tLabel);
    });

    const maxVariance = (measuredMap.length - 1) * 0.045;
    const screenStart = 0.1 + maxVariance + 1.04 + 1.08 + 0.24 + 0.08;

    if (gameScreenRef.current) {
      tl.to(gameScreenRef.current, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.82,
        ease: 'power2.out',
        force3D: true
      }, screenStart);
    }
  }, [isGameMode]);

  useEffect(() => {
    if (!isGameMode) return;

    const mapKey = (key) => {
      const k = key.toLowerCase();
      if (k === 'arrowup' || k === 'w') return '↑';
      if (k === 'arrowdown' || k === 's') return '↓';
      if (k === 'arrowleft' || k === 'a') return '←';
      if (k === 'arrowright' || k === 'd') return '→';
      if (k === 'q') return 'Q';
      if (k === 'e') return 'E';
      return null;
    };

    const onKeyDown = (e) => {
      const mapped = mapKey(e.key);
      if (!mapped) return;
      setPressedKeys((prev) => new Set(prev).add(mapped));
    };

    const onKeyUp = (e) => {
      const mapped = mapKey(e.key);
      if (!mapped) return;
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(mapped);
        return next;
      });
    };

    const onBlur = () => setPressedKeys(new Set());

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      setPressedKeys(new Set());
    };
  }, [isGameMode]);

  useEffect(() => {
    if (!isGameMode) return;
    const keys = document.querySelectorAll('.game-key');
    keys.forEach((el) => {
      const key = el.getAttribute('data-key');
      if (pressedKeys.has(key)) {
        el.classList.add('game-key-active');
      } else {
        el.classList.remove('game-key-active');
      }
    });
  }, [pressedKeys, isGameMode]);

  useEffect(() => {
    if (!isGameMode) return;

    const keyEls = Array.from(document.querySelectorAll('.game-key'));
    const disposers = [];

    keyEls.forEach((el) => {
      const key = el.getAttribute('data-key');
      if (!key) return;

      const press = () => {
        setPressedKeys((prev) => new Set(prev).add(key));
      };
      const release = () => {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      };

      el.addEventListener('pointerdown', press);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointerleave', release);
      el.addEventListener('pointercancel', release);

      disposers.push(() => {
        el.removeEventListener('pointerdown', press);
        el.removeEventListener('pointerup', release);
        el.removeEventListener('pointerleave', release);
        el.removeEventListener('pointercancel', release);
      });
    });

    return () => disposers.forEach((fn) => fn());
  }, [isGameMode]);

  const enterGameMode = () => {
    if (isGameMode) return;
    setGameMode(true);
  };

  return (
    <div className="board" ref={stageRef}>
      <div className='abouts'>
        <div className='col'>
          <div className="line">
            <motion.div
              drag
              dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
              dragElastic={0.5}
              whileDrag={{ scale: 1.2, zIndex: 10 }}
              ref={(el) => infoBoxRefs.current[0] = el} className='infobox AboutInfo'>
              <h1 ref={(el) => baseRefs.current[0] = el}>Siddharth Vethody</h1>
              <About isPlus={isPlus} />
            </motion.div>
            <div ref={boardRef}>
              <Compiler
                compilerRef={compilerRef}
                infoBoxRefs={infoBoxRefs.current}
                boardRef={boardRef}
                isPlus={isPlus}
                setPlus={setPlus}
                isHelp={isHelp}
                setHelp={setHelp}
              />
            </div>
          </div>

          <div className="line">
            <motion.div
              drag
              dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
              dragElastic={0.5}
              whileDrag={{ scale: 1.2, zIndex: 10 }}
              ref={(el) => infoBoxRefs.current[2] = el} className='infobox EducationInfo'>
              <h1 ref={(el) => baseRefs.current[1] = el}>SkillSet</h1>
              <Education isPlus={isPlus} />
            </motion.div>

            <div
              ref={(el) => infoBoxRefs.current[3] = el}
              className='infobox AdhdInfo'
              onClick={enterGameMode}>
              <h1 ref={(el) => baseRefs.current[2] = el}>ADHD</h1>
              <div ref={trackpadRef} className='trackpad'></div>
            </div>
          </div>
        </div>

        <div className='col'>
          <motion.div
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragElastic={0.5}
            whileDrag={{ scale: 1.2, zIndex: 10 }}
            ref={(el) => infoBoxRefs.current[1] = el} className='infobox SkillsInfo'>
            <h1><span className='hide-text' ref={(el) => baseRefs.current[3] = el}>Skills</span></h1>
            <Skills isPlus={isPlus} />
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
            dragElastic={0.5}
            whileDrag={{ scale: 1.2, zIndex: 10 }}
            ref={(el) => infoBoxRefs.current[4] = el} className='infobox ContactInfo'>
            <h1 ref={(el) => baseRefs.current[4] = el}><span>Contact</span><span>  </span><i>me</i></h1>
            <Contacts Popup={triggerPopup} isPlus={isPlus} />
          </motion.div>
        </div>

        <div ref={popupRef} className='PopUp'><span className='popup-text'>Link Copied</span></div>
      </div>

      <div ref={gameScreenRef} className='game-screen-placeholder'>
        <div className='game-screen-content'>
          <AsteroidsMini isGameMode={isGameMode} pressedKeys={pressedKeys} />
        </div>
      </div>
    </div>
  );
}

export default Transition(Base);
