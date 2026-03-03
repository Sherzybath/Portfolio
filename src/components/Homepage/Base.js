import React, { useRef, useState, useEffect, useCallback } from 'react';
import Compiler from "./Compiler";
import { motion } from 'framer-motion';
import Transition from '../../Transition';
import Skills from './Skills';
import About from './About';
import Contacts from './Contacts';
import Education from './Education';
import AsteroidsMini from './AsteroidsMini';
import gsap from 'gsap';
import escRedscreenSfx from '../../Assets/Audio/esc-redscreen.wav';
import waveStartSfx from '../../Assets/Audio/wave-start.wav';

function Base() {
  const stageRef = useRef(null);
  const boardRef = useRef(null);
  const compilerRef = useRef(null);
  const infoBoxRefs = useRef([]);
  const baseRefs = useRef([]);
  const trackpadRef = useRef(null);
  const popupRef = useRef(null);
  const gameScreenRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const exitOverlayRef = useRef(null);
  const glitchBarRefs = useRef([]);
  const glitchSliceRefs = useRef([]);
  const glitchTimersRef = useRef([]);
  const gameModeAnimatedRef = useRef(false);
  const isExitingGameRef = useRef(false);
  const hasSeenGameMenuRef = useRef(false);

  const [isPlus, setPlus] = useState(null);
  const [isHelp, setHelp] = useState(false);
  const [isGameMode, setGameMode] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [gameHud, setGameHud] = useState({ score: 0, points: 0, lives: 3, gameOver: false });
  const [flashRed, setFlashRed] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [showNameTray, setShowNameTray] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitWarningText, setExitWarningText] = useState('youll regret this later');
  const [highScore, setHighScore] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [continueSignal, setContinueSignal] = useState(0);
  const [runState, setRunState] = useState({ wave: 1, kills: 0, requiredKills: 15, shopOpen: true, skillCooldownMs: 0 });
  const [shopTab, setShopTab] = useState('skills');
  const [skillState, setSkillState] = useState({
    ownedSkills: ['dodge'],
    equippedSkillId: 'dodge',
  });
  const [passiveState, setPassiveState] = useState({
    heart_up: 0,
    extra_blaster: 0,
    speed_control: 0,
  });
  const [charmState, setCharmState] = useState({
    owned: [],
    equipped: [],
  });
  const [menuIntroVariant, setMenuIntroVariant] = useState('initial');
  const [logoPose, setLogoPose] = useState({ x: 0, y: 0, rx: 0, ry: 0 });
  const runPointsSeenRef = useRef(0);
  const alarmAudioCtxRef = useRef(null);
  const exitAudioRef = useRef(null);
  const waveStartAudioRef = useRef(null);


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
    const savedName = localStorage.getItem('homepageGamePlayerName') || '';
    const savedHighScore = Number(localStorage.getItem('homepageGameHighScore') || 0);
    const savedRedeemPoints = Number(localStorage.getItem('homepageGameRedeemPoints') || 0);
    setPlayerName(savedName);
    setNameDraft(savedName);
    setHighScore(Number.isFinite(savedHighScore) ? savedHighScore : 0);
    setRedeemPoints(Number.isFinite(savedRedeemPoints) ? savedRedeemPoints : 0);
  }, []);

  useEffect(() => {
    const audio = new Audio(escRedscreenSfx);
    audio.preload = 'auto';
    audio.volume = 0.9;
    exitAudioRef.current = audio;

    const waveAudio = new Audio(waveStartSfx);
    waveAudio.preload = 'auto';
    waveAudio.volume = 0.9;
    waveStartAudioRef.current = waveAudio;

    return () => {
      if (exitAudioRef.current) {
        exitAudioRef.current.pause();
        exitAudioRef.current.currentTime = 0;
      }
      if (waveStartAudioRef.current) {
        waveStartAudioRef.current.pause();
        waveStartAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!isGameMode || gameStarted) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      setLogoPose({
        x: current.x * 10,
        y: current.y * 8,
        rx: current.y * -4,
        ry: current.x * 5,
      });
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      target.x = ((e.clientX / window.innerWidth) * 2) - 1;
      target.y = ((e.clientY / window.innerHeight) * 2) - 1;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      setLogoPose({ x: 0, y: 0, rx: 0, ry: 0 });
    };
  }, [isGameMode, gameStarted]);

  const handleHudUpdate = useCallback((nextHud) => {
    setGameHud(nextHud);

    const runPointsNow = nextHud.points || 0;
    const gainedPoints = Math.max(0, runPointsNow - runPointsSeenRef.current);
    runPointsSeenRef.current = runPointsNow;

    if (gainedPoints > 0) {
      setRedeemPoints((prev) => {
        const next = prev + gainedPoints;
        localStorage.setItem('homepageGameRedeemPoints', String(next));
        return next;
      });
    }

    setHighScore((prevHigh) => {
      if (nextHud.score > prevHigh) {
        localStorage.setItem('homepageGameHighScore', String(nextHud.score));
        return nextHud.score;
      }
      return prevHigh;
    });
  }, []);

  const shopSkills = [{ id: 'dodge', name: 'Dodge', cost: 0, desc: 'Dash forward + 1s i-frames' }];
  const shopPassives = [
    { id: 'heart_up', name: 'Heart Upgrade', cost: 60, cap: 2, desc: '+1 max heart' },
    { id: 'extra_blaster', name: 'Extra Blaster', cost: 90, cap: 2, desc: '+1 pellet per shot' },
    { id: 'speed_control', name: 'Speed Control', cost: 70, cap: 3, desc: '+movement acceleration/speed' },
  ];
  const shopCharms = [
    { id: 'charm_focus', name: 'Focus Sigil', cost: 110, desc: 'Placeholder charm (future effect)' },
    { id: 'charm_flux', name: 'Flux Core', cost: 110, desc: 'Placeholder charm (future effect)' },
  ];

  const handleRunStateUpdate = useCallback((nextState) => {
    setRunState(nextState);
  }, []);

  const buyPassive = (id, cost, cap) => {
    if (!runState.shopOpen || redeemPoints < cost) return;
    const cur = passiveState[id] || 0;
    if (cur >= cap) return;
    setRedeemPoints((prev) => {
      const next = prev - cost;
      localStorage.setItem('homepageGameRedeemPoints', String(next));
      return next;
    });
    setPassiveState((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const buyCharm = (id, cost) => {
    if (!runState.shopOpen || redeemPoints < cost) return;
    if (charmState.owned.includes(id)) return;
    setRedeemPoints((prev) => {
      const next = prev - cost;
      localStorage.setItem('homepageGameRedeemPoints', String(next));
      return next;
    });
    setCharmState((prev) => ({ ...prev, owned: [...prev.owned, id] }));
  };

  const toggleCharmEquip = (id) => {
    if (!charmState.owned.includes(id)) return;
    setCharmState((prev) => {
      const equipped = prev.equipped.includes(id)
        ? prev.equipped.filter((c) => c !== id)
        : prev.equipped.length >= 2
          ? prev.equipped
          : [...prev.equipped, id];
      return { ...prev, equipped };
    });
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
      gsap.from(
        baseRefs.current[3],
        {
          bottom: '20vw',
          ease: 'power4.out',
          duration: 1.7,
        },
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
      { el: infoBoxRefs.current[1], key: '␣', x: cx + keyWidth + gap, y: rowTopY },
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

    if (leftPanelRef.current) {
      gsap.set(leftPanelRef.current, { x: '36vw', scale: 0.62, autoAlpha: 0, transformOrigin: 'right center' });
    }

    if (rightPanelRef.current) {
      gsap.set(rightPanelRef.current, { x: '-36vw', scale: 0.62, autoAlpha: 0, transformOrigin: 'left center' });
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
    if (!isGameMode || gameStarted) return;

    if (!hasSeenGameMenuRef.current) {
      setMenuIntroVariant('initial');
      hasSeenGameMenuRef.current = true;
    } else {
      setMenuIntroVariant('quick');
    }

    const onMenuKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'q' || k === 'escape') {
        e.preventDefault();
        exitGameModeToHome();
        return;
      }

      if (k === ' ' || k === 'spacebar' || k === 'space') {
        e.preventDefault();
        requestStartGame();
      }
    };

    window.addEventListener('keydown', onMenuKeyDown);
    return () => window.removeEventListener('keydown', onMenuKeyDown);
  }, [isGameMode, gameStarted, playerName]);

  useEffect(() => {
    if (!isGameMode || !gameStarted) return;

    const mapKey = (key) => {
      const k = key.toLowerCase();
      if (k === 'arrowup' || k === 'w') return '↑';
      if (k === 'arrowdown' || k === 's') return '↓';
      if (k === 'arrowleft' || k === 'a') return '←';
      if (k === 'arrowright' || k === 'd') return '→';
      if (k === 'q') return 'Q';
      if (k === ' ' || k === 'spacebar' || k === 'space') return '␣';
      return null;
    };

    const onKeyDown = (e) => {
      const lowered = e.key.toLowerCase();

      if (e.key === 'Escape') {
        e.preventDefault();
        if (gameHud.gameOver) {
          exitGameModeToHome();
          return;
        }
        if (isPaused) {
          setIsPaused(false);
          return;
        }
        setIsPaused(true);
        setPressedKeys(new Set());
        return;
      }

      if (gameHud.gameOver && lowered === 'r') {
        e.preventDefault();
        exitGameModeToHome('Again');
        return;
      }

      if (runState.shopOpen && lowered === 'f') {
        e.preventDefault();
        if (waveStartAudioRef.current) {
          waveStartAudioRef.current.currentTime = 0;
          waveStartAudioRef.current.play().catch(() => {});
        }
        setContinueSignal((v) => v + 1);
        return;
      }

      if (isPaused) {
        if (lowered === 'q' && !gameHud.gameOver) {
          e.preventDefault();
          exitGameModeToHome();
        }
        if (lowered === 'r') {
          e.preventDefault();
          exitGameModeToHome('Again');
        }
        return;
      }

      const mapped = mapKey(e.key);
      if (!mapped) return;
      e.preventDefault();
      setPressedKeys((prev) => new Set(prev).add(mapped));
    };

    const onKeyUp = (e) => {
      if (isPaused) return;

      const mapped = mapKey(e.key);
      if (!mapped) return;
      e.preventDefault();
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
  }, [isGameMode, gameStarted, isPaused, gameHud.gameOver, runState.shopOpen]);

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
    if (!isGameMode || !gameStarted || isPaused) return;

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
  }, [isGameMode, gameStarted, isPaused]);

  useEffect(() => {
    if (!isGameMode || isExitingGameRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    if (gameStarted) {
      if (leftPanelRef.current) {
        gsap.set(leftPanelRef.current, { autoAlpha: 1, x: '36vw', scale: 0.62, transformOrigin: 'right center' });
        tl.to(leftPanelRef.current, {
          x: '0vw',
          duration: 1.05,
          ease: 'power2.out',
        }, 0)
        .to(leftPanelRef.current, {
          scale: 1,
          duration: 0.42,
          ease: 'power2.out',
        }, 1.05);
      }

      if (rightPanelRef.current) {
        gsap.set(rightPanelRef.current, { autoAlpha: 1, x: '-36vw', scale: 0.62, transformOrigin: 'left center' });
        tl.to(rightPanelRef.current, {
          x: '0vw',
          duration: 1.05,
          ease: 'power2.out',
        }, 0)
        .to(rightPanelRef.current, {
          scale: 1,
          duration: 0.42,
          ease: 'power2.out',
        }, 1.05);
      }
    } else {
      if (leftPanelRef.current) {
        tl.to(leftPanelRef.current, {
          scale: 0.62,
          duration: 0.34,
          ease: 'power2.inOut',
        }, 0)
        .to(leftPanelRef.current, {
          x: '36vw',
          autoAlpha: 0,
          duration: 0.74,
          ease: 'power2.inOut',
        }, 0.34);
      }

      if (rightPanelRef.current) {
        tl.to(rightPanelRef.current, {
          scale: 0.62,
          duration: 0.34,
          ease: 'power2.inOut',
        }, 0)
        .to(rightPanelRef.current, {
          x: '-36vw',
          autoAlpha: 0,
          duration: 0.74,
          ease: 'power2.inOut',
        }, 0.34);
      }
    }
  }, [isGameMode, gameStarted]);

  useEffect(() => {
    const bars = glitchBarRefs.current.filter(Boolean);
    const slices = glitchSliceRefs.current.filter(Boolean);
    const allGlitchEls = [...bars, ...slices];
    if (!allGlitchEls.length) return;

    glitchTimersRef.current.forEach((t) => clearTimeout(t));
    glitchTimersRef.current = [];

    allGlitchEls.forEach((el) => {
      gsap.set(el, { autoAlpha: 0, x: 0, y: 0 });

      const pulse = () => {
        const waitMs = 900 + Math.random() * 5200;
        const timer = setTimeout(() => {
          const flashes = 1 + Math.floor(Math.random() * 3);
          const tl = gsap.timeline({
            onComplete: pulse,
          });

          for (let i = 0; i < flashes; i += 1) {
            const hold = 0.04 + Math.random() * 0.16;
            const drift = (Math.random() - 0.5) * 12;
            const settle = (Math.random() - 0.5) * 4;
            const jitterY = (Math.random() - 0.5) * 1.5;

            tl.to(el, {
              autoAlpha: 0.16 + Math.random() * 0.22,
              x: drift,
              y: jitterY,
              duration: 0.012,
              ease: 'none',
            })
            .to(el, {
              x: settle,
              y: 0,
              duration: hold,
              ease: 'none',
            })
            .to(el, {
              autoAlpha: 0,
              duration: 0.018,
              ease: 'none',
            }, '+=0.008');
          }
        }, waitMs);

        glitchTimersRef.current.push(timer);
      };

      pulse();
    });

    return () => {
      glitchTimersRef.current.forEach((t) => clearTimeout(t));
      glitchTimersRef.current = [];
      allGlitchEls.forEach((el) => gsap.set(el, { autoAlpha: 0, x: 0, y: 0 }));
    };
  }, [isGameMode]);

  const playAlarmSound = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;

    if (!alarmAudioCtxRef.current) alarmAudioCtxRef.current = new Ctx();
    const ctx = alarmAudioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    for (let i = 0; i < 6; i += 1) {
      const t = now + i * 0.32;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(690, t);
      osc.frequency.exponentialRampToValueAtTime(510, t + 0.24);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    }
  };

  function requestStartGame() {
    if (playerName?.trim()) {
      setShowNameTray(false);
      setIsPaused(false);
      runPointsSeenRef.current = 0;
      setContinueSignal((v) => v + 1);
      setRunState({ wave: 1, kills: 0, requiredKills: 15, shopOpen: true, skillCooldownMs: 0 });
      setGameHud({ score: 0, points: 0, lives: 3, gameOver: false });
      setGameStarted(true);
      return;
    }
    setShowNameTray(true);
  }

  const handleSaveNameAndStart = () => {
    const finalName = nameDraft.trim();
    if (!finalName) return;

    setPlayerName(finalName);
    localStorage.setItem('homepageGamePlayerName', finalName);
    setShowNameTray(false);
    setIsPaused(false);
    runPointsSeenRef.current = 0;
    setContinueSignal((v) => v + 1);
    setRunState({ wave: 1, kills: 0, requiredKills: 15, shopOpen: true, skillCooldownMs: 0 });
    setGameHud({ score: 0, points: 0, lives: 3, gameOver: false });
    setGameStarted(true);
  };

  const restoreBentoFromGameMode = () => {
    const keyBoxes = [
      infoBoxRefs.current[0],
      compilerRef.current,
      infoBoxRefs.current[1],
      infoBoxRefs.current[2],
      infoBoxRefs.current[3],
      infoBoxRefs.current[4],
    ].filter(Boolean);

    keyBoxes.forEach((el) => {
      el.classList.remove('game-key', 'game-key-active');
      el.removeAttribute('data-key');
      el.querySelectorAll('.game-key-label, .game-key-ring').forEach((node) => node.remove());
      gsap.set(el, { clearProps: 'all' });
    });

    gsap.set('.infobox > *:not(.game-key-label), .compiler > *:not(.game-key-label)', {
      clearProps: 'opacity,pointerEvents',
    });

    if (leftPanelRef.current) gsap.set(leftPanelRef.current, { clearProps: 'all' });
    if (rightPanelRef.current) gsap.set(rightPanelRef.current, { clearProps: 'all' });

    if (gameScreenRef.current) {
      gsap.set(gameScreenRef.current, {
        autoAlpha: 0,
        display: 'none',
        scale: 1,
        scaleX: 1,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        clearProps: 'transformOrigin',
      });
    }

    gameModeAnimatedRef.current = false;
    setPressedKeys(new Set());
    setShowNameTray(false);
    setGameStarted(false);
    setIsPaused(false);
    runPointsSeenRef.current = 0;
    setGameHud({ score: 0, points: 0, lives: 3, gameOver: false });
    setGameMode(false);
  };

  function exitGameModeToHome(overrideText = 'youll regret this later') {
    if (isExitingGameRef.current) return;
    isExitingGameRef.current = true;

    const isAgainPath = overrideText === 'Again';

    setPressedKeys(new Set());
    setShowNameTray(false);
    setExitWarningText(overrideText);
    setShowExitWarning(true);

    if (exitAudioRef.current) {
      exitAudioRef.current.pause();
      exitAudioRef.current.currentTime = 0;
      exitAudioRef.current.play().catch(() => {});
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        isExitingGameRef.current = false;
      },
    });

    if (exitOverlayRef.current) {
      gsap.set(exitOverlayRef.current, { autoAlpha: 0, backgroundColor: '#3a0001' });
      tl.to(exitOverlayRef.current, {
        autoAlpha: 1,
        duration: 0.34,
        ease: 'power2.out',
      }, 0)
      .to(exitOverlayRef.current, {
        backgroundColor: '#8d0205',
        duration: 0.52,
        ease: 'power2.out',
      }, 0.08)
      .to(exitOverlayRef.current, {
        backgroundColor: '#8d0205',
        duration: 0.95,
        ease: 'none',
      }, 0.64);
    }

    if (!isAgainPath) {
      if (leftPanelRef.current) {
        tl.to(leftPanelRef.current, {
          scale: 0.62,
          duration: 0.28,
          ease: 'power2.inOut',
        }, 0.22)
        .to(leftPanelRef.current, {
          x: '36vw',
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        }, 0.5);
      }

      if (rightPanelRef.current) {
        tl.to(rightPanelRef.current, {
          scale: 0.62,
          duration: 0.28,
          ease: 'power2.inOut',
        }, 0.22)
        .to(rightPanelRef.current, {
          x: '-36vw',
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        }, 0.5);
      }

      if (gameScreenRef.current) {
        tl.to(gameScreenRef.current, {
          transformOrigin: 'center center',
          scaleX: 0,
          duration: 0.42,
          ease: 'power2.in',
        }, 1.84);
      }

      if (exitOverlayRef.current) {
        tl.to(exitOverlayRef.current, {
          backgroundColor: '#1a0001',
          duration: 0.45,
          ease: 'power2.inOut',
        }, 1.72)
        .to(exitOverlayRef.current, {
          autoAlpha: 0,
          duration: 0.42,
          ease: 'power2.inOut',
        }, 2.04)
        .call(() => {
          window.location.reload();
        }, [], 2.5);
      }
      return;
    }

    // Again path: no refresh, return to game-start prompt.
    tl.to(exitOverlayRef.current, {
      autoAlpha: 0,
      duration: 0.34,
      ease: 'power2.inOut',
    }, 1.42)
    .call(() => {
      setShowExitWarning(false);
      setGameStarted(false);
      setIsPaused(false);
      runPointsSeenRef.current = 0;
      setGameHud({ score: 0, points: 0, lives: 3, gameOver: false });
      setRunState({ wave: 1, kills: 0, requiredKills: 15, shopOpen: true, skillCooldownMs: 0 });
      setContinueSignal((v) => v + 1);
    });
  }

  const enterGameMode = () => {
    if (isGameMode) return;

    setButtonPressed(true);
    playAlarmSound();
    setFlashRed(true);
    setShowNameTray(false);
    setGameStarted(false);
    setIsPaused(false);
    setShowExitWarning(false);
    runPointsSeenRef.current = 0;
    setGameHud({ score: 0, points: 0, lives: 3, gameOver: false });

    setTimeout(() => {
      setFlashRed(false);
      setButtonPressed(false);
      setGameMode(true);
    }, 2200);
  };

  return (
    <div className={`board ${flashRed ? 'flash-red' : ''}`} ref={stageRef}>
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
              ref={(el) => {
                infoBoxRefs.current[3] = el;
                trackpadRef.current = el;
              }}
              className={`infobox AdhdInfo danger-button ${buttonPressed ? 'is-pressed' : ''}`}
              onClick={enterGameMode}
            >
              <span className='button-label'>
                <span className='do-word'>DO</span>
                <span className='not-word'>NOT</span>
                <span className='touch-word'>TOUCH</span>
              </span>
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
        <div className={`game-screen-content game-layout ${gameStarted ? 'game-live' : 'game-idle'}`}>
          <div ref={leftPanelRef} className='game-side-panel left-blank-panel'>
            <div className='shop-tabs'>
              <button type='button' className={`shop-tab ${shopTab === 'skills' ? 'active' : ''}`} onClick={() => setShopTab('skills')}>Skills</button>
              <button type='button' className={`shop-tab ${shopTab === 'charms' ? 'active' : ''}`} onClick={() => setShopTab('charms')}>Charms</button>
              <button type='button' className={`shop-tab ${shopTab === 'passives' ? 'active' : ''}`} onClick={() => setShopTab('passives')}>Passives</button>
            </div>

            <div className='shop-body'>
              {shopTab === 'skills' && (
                <>
                  {shopSkills.map((skill) => (
                    <div key={skill.id} className='shop-item'>
                      <div className='shop-item-title'>{skill.name} · {skill.cost === 0 ? 'FREE' : `${skill.cost} pts`}</div>
                      <div className='shop-item-desc'>{skill.desc}</div>
                      <button
                        type='button'
                        className='shop-btn'
                        disabled={!skillState.ownedSkills.includes(skill.id)}
                        onClick={() => setSkillState((prev) => ({ ...prev, equippedSkillId: skill.id }))}
                      >
                        {skillState.equippedSkillId === skill.id ? 'EQUIPPED' : 'EQUIP'}
                      </button>
                    </div>
                  ))}
                </>
              )}

              {shopTab === 'passives' && (
                <>
                  {shopPassives.map((p) => (
                    <div key={p.id} className='shop-item'>
                      <div className='shop-item-title'>{p.name} · {p.cost} pts</div>
                      <div className='shop-item-desc'>{p.desc} ({passiveState[p.id] || 0}/{p.cap})</div>
                      <button
                        type='button'
                        className='shop-btn'
                        disabled={!runState.shopOpen || redeemPoints < p.cost || (passiveState[p.id] || 0) >= p.cap}
                        onClick={() => buyPassive(p.id, p.cost, p.cap)}
                      >
                        BUY
                      </button>
                    </div>
                  ))}
                </>
              )}

              {shopTab === 'charms' && (
                <>
                  {shopCharms.map((c) => {
                    const owned = charmState.owned.includes(c.id);
                    const equipped = charmState.equipped.includes(c.id);
                    const equipLocked = !equipped && charmState.equipped.length >= 2;
                    return (
                      <div key={c.id} className='shop-item'>
                        <div className='shop-item-title'>{c.name} · {c.cost} pts</div>
                        <div className='shop-item-desc'>{c.desc}</div>
                        {!owned ? (
                          <button
                            type='button'
                            className='shop-btn'
                            disabled={!runState.shopOpen || redeemPoints < c.cost}
                            onClick={() => buyCharm(c.id, c.cost)}
                          >
                            BUY
                          </button>
                        ) : (
                          <button
                            type='button'
                            className='shop-btn'
                            disabled={equipLocked}
                            onClick={() => toggleCharmEquip(c.id)}
                          >
                            {equipped ? 'UNEQUIP' : 'EQUIP'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          <div className='game-main-panel crt-display'>
            <div className='crt-overlay'></div>
            <div className='crt-grain'></div>
            <div className='crt-wave-lines'></div>
            <div className='crt-glitch-bars'>
              <span ref={(el) => { glitchBarRefs.current[0] = el; }} className='crt-glitch-bar bar-a'></span>
              <span ref={(el) => { glitchBarRefs.current[1] = el; }} className='crt-glitch-bar bar-b'></span>
              <span ref={(el) => { glitchBarRefs.current[2] = el; }} className='crt-glitch-bar bar-c'></span>
            </div>
            <div className='crt-glitch-slices'>
              <span ref={(el) => { glitchSliceRefs.current[0] = el; }} className='crt-glitch-slice slice-a'></span>
              <span ref={(el) => { glitchSliceRefs.current[1] = el; }} className='crt-glitch-slice slice-b'></span>
              <span ref={(el) => { glitchSliceRefs.current[2] = el; }} className='crt-glitch-slice slice-c'></span>
            </div>
            <div ref={exitOverlayRef} className={`exit-warning-overlay ${showExitWarning ? 'show' : ''}`}>
              <div className='exit-warning-text'>{exitWarningText}</div>
            </div>
            {gameStarted ? (
              <>
                <AsteroidsMini
                  isGameMode={isGameMode && gameStarted}
                  isPaused={isPaused}
                  pressedKeys={pressedKeys}
                  onHudUpdate={handleHudUpdate}
                  onRunStateUpdate={handleRunStateUpdate}
                  continueSignal={continueSignal}
                  loadout={{
                    equippedSkillId: skillState.equippedSkillId,
                    passives: passiveState,
                    charms: charmState.equipped,
                  }}
                />
                {isPaused && (
                  <div className='pause-overlay'>
                    <div className='pause-title'>PAUSED</div>
                    <div className='pause-sub'>Press ESC to resume · Q to exit · R to restart</div>
                  </div>
                )}
              </>
            ) : (
              <div className={`game-main-menu ${menuIntroVariant === 'quick' ? 'quick-intro' : ''}`}>
                <div
                  className='game-loading-logo-wrap'
                  style={{ transform: `translate3d(${logoPose.x}px, ${logoPose.y}px, 0) rotateX(${logoPose.rx}deg) rotateY(${logoPose.ry}deg)` }}
                >
                  <div
                    className='game-loading-logo'
                    style={{ '--core-x': `${logoPose.x * 0.7}px`, '--core-y': `${logoPose.y * 0.7}px` }}
                  >
                    <span className='ring ring-a'></span>
                    <span className='ring ring-b'></span>
                    <span className='ring ring-c'></span>
                    <span className='core'></span>
                  </div>
                </div>
                <div className='game-main-menu-title image-style'>RELOADED</div>
                <div className='game-main-menu-sub image-style'>PRESS SPACE</div>
                <div className='game-main-menu-meta'>PROFILE: SHERZYBATH // SYSTEM: READY</div>
              </div>
            )}
          </div>

          <div ref={rightPanelRef} className='game-side-panel right-hud-panel'>
            <div className='hud-row'>PLAYER</div>
            <div className='hud-value player-name-value'>{playerName || 'Unknown'}</div>
            <div className='hud-row'>SCORE</div>
            <div className='hud-value'>{gameHud.score}</div>
            <div className='hud-row'>POINTS</div>
            <div className='hud-value points-value'>{redeemPoints}</div>
            <div className='hud-row'>HIGH SCORE</div>
            <div className='hud-value'>{highScore}</div>
            <div className='hud-row'>WAVE</div>
            <div className='hud-value'>{runState.wave} · {runState.kills}/{runState.requiredKills}</div>
            {runState.shopOpen && <div className='hud-row small'>Press F to continue</div>}
            <div className='hud-row'>HEALTH</div>
            <div className='hud-hearts'>
              {Array.from({ length: 3 + (passiveState.heart_up || 0) }).map((_, i) => (
                <span key={`heart-${i}`} className={gameHud.lives >= i + 1 ? 'heart full' : 'heart empty'}>♥</span>
              ))}
            </div>

            <div className='hud-title keys-title'>KEYBINDS</div>
            <div className='hud-row small'>MOVE: WASD / ARROWS</div>
            <div className='hud-row small'>SHOOT: SPACE</div>
            <div className='hud-row small'>DODGE: Q</div>
            <div className='hud-row small'>EXIT: ESC → pause, then Q</div>
            {gameHud.gameOver && <div className='hud-gameover'>GAME OVER</div>}
          </div>
        </div>

        <div className={`name-tray ${showNameTray ? 'open' : ''}`}>
          <div className='name-tray-body'>
            <div className='name-tray-title'>Enter pilot name</div>
            <input
              className='name-tray-input'
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder='Type your name'
              maxLength={24}
            />
            <div className='name-tray-actions'>
              <button
                type='button'
                className='name-tray-btn secondary'
                onClick={() => setShowNameTray(false)}
              >
                Cancel
              </button>
              <button
                type='button'
                className='name-tray-btn primary'
                onClick={handleSaveNameAndStart}
                disabled={!nameDraft.trim()}
              >
                Save & Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transition(Base);
