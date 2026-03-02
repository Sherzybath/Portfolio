import React, { useEffect, useRef } from 'react';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (min, max) => Math.random() * (max - min) + min;

const WAVE_CONFIG = [
  { wave: 1, killsRequired: 15, spawnInterval: [0.6, 1.1], types: ['asteroid'] },
  { wave: 2, killsRequired: 25, spawnInterval: [0.45, 0.85], types: ['asteroid', 'star'] },
];

const STAR_TELEGRAPH_MS = 1500;
const STAR_DASH_SPEED = 1200;
const DODGE_COOLDOWN_MS = 4200;

function rayToScreenEdge(x, y, dirX, dirY, width, height, pad = 18) {
  const tx = dirX > 0 ? (width - pad - x) / dirX : dirX < 0 ? (pad - x) / dirX : Number.POSITIVE_INFINITY;
  const ty = dirY > 0 ? (height - pad - y) / dirY : dirY < 0 ? (pad - y) / dirY : Number.POSITIVE_INFINITY;
  const t = Math.max(0, Math.min(tx > 0 ? tx : Number.POSITIVE_INFINITY, ty > 0 ? ty : Number.POSITIVE_INFINITY));
  return { x: x + dirX * t, y: y + dirY * t };
}

function makeAsteroid(width, height, shipX, shipY) {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (side === 0) {
    x = rand(0, width);
    y = -30;
  } else if (side === 1) {
    x = width + 30;
    y = rand(0, height);
  } else if (side === 2) {
    x = rand(0, width);
    y = height + 30;
  } else {
    x = -30;
    y = rand(0, height);
  }

  const sizeRoll = Math.random();
  const radius = sizeRoll < 0.5 ? rand(12, 18) : sizeRoll < 0.85 ? rand(19, 28) : rand(29, 40);
  const speed = sizeRoll < 0.5 ? rand(75, 105) : sizeRoll < 0.85 ? rand(55, 85) : rand(40, 65);

  const verts = Math.floor(rand(6, 9));
  const points = [];
  for (let i = 0; i < verts; i += 1) {
    const a = (Math.PI * 2 * i) / verts;
    const r = radius * rand(0.82, 1.18);
    points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  }

  const dx = shipX - x;
  const dy = shipY - y;
  const d = Math.hypot(dx, dy) || 1;

  return {
    type: 'asteroid',
    x,
    y,
    vx: (dx / d) * speed,
    vy: (dy / d) * speed,
    speed,
    radius,
    points,
    spin: rand(-0.7, 0.7),
    rot: rand(0, Math.PI * 2),
  };
}

function makeStarShooter(width, height) {
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  if (side === 0) {
    x = rand(40, width - 40);
    y = -26;
  } else if (side === 1) {
    x = width + 26;
    y = rand(40, height - 40);
  } else if (side === 2) {
    x = rand(40, width - 40);
    y = height + 26;
  } else {
    x = -26;
    y = rand(40, height - 40);
  }

  return {
    type: 'star',
    x,
    y,
    vx: rand(-38, 38),
    vy: rand(-38, 38),
    radius: 16,
    state: 'drift',
    attackTimer: rand(1.2, 2.4),
    telegraphTimer: 0,
    beepTimer: 0,
    lineDir: { x: 1, y: 0 },
    dashTarget: { x, y },
    fireCooldown: 0,
  };
}

function AsteroidsMini({
  isGameMode,
  isPaused = false,
  pressedKeys,
  onHudUpdate,
  onRunStateUpdate,
  continueSignal = 0,
  loadout,
}) {
  const canvasRef = useRef(null);

  const shipRef = useRef({ x: 0, y: 0, angle: -Math.PI / 2, radius: 13 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const bulletsRef = useRef([]);
  const enemiesRef = useRef([]);
  const particlesRef = useRef([]);

  const pressedKeysRef = useRef(new Set());
  const isPausedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);

  const spawnTimerRef = useRef(0);
  const shootCooldownRef = useRef(0);
  const scoreRef = useRef(0);
  const pointsRef = useRef(0);
  const livesRef = useRef(3);
  const maxLivesRef = useRef(3);
  const invulnRef = useRef(0);
  const gameOverRef = useRef(false);
  const waveRef = useRef(1);
  const waveKillsRef = useRef(0);
  const shopOpenRef = useRef(true);
  const skillCooldownRef = useRef(0);
  const continueSignalRef = useRef(continueSignal);
  const continueHandledRef = useRef(continueSignal);
  const loadoutRef = useRef(loadout || {});

  const hudLastRef = useRef({ score: -1, points: -1, lives: -1, gameOver: false });
  const runStateLastRef = useRef({ wave: -1, kills: -1, requiredKills: -1, shopOpen: null, skillCooldownMs: -1 });
  const laserAudioCtxRef = useRef(null);
  const impactAudioCtxRef = useRef(null);
  const targetBeepAudioCtxRef = useRef(null);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    continueSignalRef.current = continueSignal;
  }, [continueSignal]);

  useEffect(() => {
    loadoutRef.current = loadout || {};
    const hearts = loadoutRef.current?.passives?.heart_up || 0;
    const nextMaxLives = 3 + hearts;
    const prevMaxLives = maxLivesRef.current;
    maxLivesRef.current = nextMaxLives;

    // When buying heart upgrades, grant the added heart immediately.
    if (nextMaxLives > prevMaxLives) {
      livesRef.current = Math.min(nextMaxLives, livesRef.current + (nextMaxLives - prevMaxLives));
    } else {
      livesRef.current = Math.min(livesRef.current, nextMaxLives);
    }
  }, [loadout]);

  const playLaserSound = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!laserAudioCtxRef.current) laserAudioCtxRef.current = new Ctx();
    const ctx = laserAudioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1320, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  };

  const playImpactSound = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!impactAudioCtxRef.current) impactAudioCtxRef.current = new Ctx();
    const ctx = impactAudioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * 0.6;
    noise.buffer = buffer;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1100, now);
    bp.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    noise.connect(bp);
    bp.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.095);
  };

  const playTargetBeep = (urgency = 0) => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!targetBeepAudioCtxRef.current) targetBeepAudioCtxRef.current = new Ctx();
    const ctx = targetBeepAudioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const f = 520 + urgency * 320;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isGameMode) return;

    const ctx = canvas.getContext('2d');

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
    };

    fit();

    shipRef.current.x = canvas.width / 2;
    shipRef.current.y = canvas.height / 2;
    shipRef.current.angle = -Math.PI / 2;
    velocityRef.current = { x: 0, y: 0 };

    bulletsRef.current = [];
    enemiesRef.current = [];
    particlesRef.current = [];
    spawnTimerRef.current = 0;
    shootCooldownRef.current = 0;
    scoreRef.current = 0;
    pointsRef.current = 0;
    waveRef.current = 1;
    waveKillsRef.current = 0;
    shopOpenRef.current = true;
    skillCooldownRef.current = 0;
    invulnRef.current = 0;
    gameOverRef.current = false;
    livesRef.current = maxLivesRef.current;
    hudLastRef.current = { score: -1, points: -1, lives: -1, gameOver: false };
    runStateLastRef.current = { wave: -1, kills: -1, requiredKills: -1, shopOpen: null, skillCooldownMs: -1 };
    continueHandledRef.current = continueSignalRef.current;

    window.addEventListener('resize', fit);

    const emitHud = () => {
      const hudNow = {
        score: scoreRef.current,
        points: pointsRef.current,
        lives: livesRef.current,
        gameOver: gameOverRef.current,
      };
      if (
        onHudUpdate &&
        (hudNow.score !== hudLastRef.current.score ||
          hudNow.points !== hudLastRef.current.points ||
          hudNow.lives !== hudLastRef.current.lives ||
          hudNow.gameOver !== hudLastRef.current.gameOver)
      ) {
        hudLastRef.current = hudNow;
        onHudUpdate(hudNow);
      }
    };

    const emitRunState = () => {
      const waveCfg = WAVE_CONFIG[Math.min(waveRef.current - 1, WAVE_CONFIG.length - 1)];
      const next = {
        wave: waveRef.current,
        kills: waveKillsRef.current,
        requiredKills: waveCfg.killsRequired,
        shopOpen: shopOpenRef.current,
        skillCooldownMs: Math.max(0, Math.round(skillCooldownRef.current * 1000)),
      };
      if (
        onRunStateUpdate &&
        (next.wave !== runStateLastRef.current.wave ||
          next.kills !== runStateLastRef.current.kills ||
          next.requiredKills !== runStateLastRef.current.requiredKills ||
          next.shopOpen !== runStateLastRef.current.shopOpen ||
          Math.abs(next.skillCooldownMs - runStateLastRef.current.skillCooldownMs) > 80)
      ) {
        runStateLastRef.current = next;
        onRunStateUpdate(next);
      }
    };

    const registerKill = () => {
      waveKillsRef.current += 1;
      const waveCfg = WAVE_CONFIG[Math.min(waveRef.current - 1, WAVE_CONFIG.length - 1)];
      if (waveKillsRef.current >= waveCfg.killsRequired && !shopOpenRef.current) {
        shopOpenRef.current = true;
        enemiesRef.current = [];
        bulletsRef.current = [];
        if (waveRef.current < WAVE_CONFIG.length) waveRef.current += 1;
      }
    };

    const step = (ts) => {
      const cw = Math.max(1, Math.floor(canvas.clientWidth));
      const ch = Math.max(1, Math.floor(canvas.clientHeight));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      const prev = lastTimeRef.current || ts;
      const dt = Math.min(0.033, (ts - prev) / 1000);
      lastTimeRef.current = ts;

      const keys = pressedKeysRef.current;
      const ship = shipRef.current;
      const vel = velocityRef.current;

      if (!isPausedRef.current) {
        skillCooldownRef.current = Math.max(0, skillCooldownRef.current - dt);
        invulnRef.current = Math.max(0, invulnRef.current - dt);

        const shouldContinue = continueSignalRef.current !== continueHandledRef.current;
        if (shopOpenRef.current && shouldContinue && !gameOverRef.current) {
          continueHandledRef.current = continueSignalRef.current;
          shopOpenRef.current = false;
          waveKillsRef.current = 0;
          if (waveRef.current > WAVE_CONFIG.length) waveRef.current = WAVE_CONFIG.length;
        }

        if (!shopOpenRef.current && !gameOverRef.current) {
          let ix = 0;
          let iy = 0;
          if (keys.has('←')) ix -= 1;
          if (keys.has('→')) ix += 1;
          if (keys.has('↑')) iy -= 1;
          if (keys.has('↓')) iy += 1;

          const speedMult = 1 + ((loadoutRef.current?.passives?.speed_control || 0) * 0.14);
          const maxSpeed = 560 * speedMult;
          const accel = 640 * speedMult;
          const drag = 0.991;

          if (ix || iy) {
            const len = Math.hypot(ix, iy) || 1;
            ix /= len;
            iy /= len;
            vel.x += ix * accel * dt;
            vel.y += iy * accel * dt;
            const vLen = Math.hypot(vel.x, vel.y);
            if (vLen > maxSpeed) {
              vel.x = (vel.x / vLen) * maxSpeed;
              vel.y = (vel.y / vLen) * maxSpeed;
            }
            const targetAngle = Math.atan2(iy, ix) + Math.PI / 2;
            let diff = targetAngle - ship.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            ship.angle += clamp(diff, -4.1 * dt, 4.1 * dt);
          }

          if (keys.has('Q') && skillCooldownRef.current <= 0 && loadoutRef.current?.equippedSkillId === 'dodge') {
            const dirX = Math.cos(ship.angle - Math.PI / 2);
            const dirY = Math.sin(ship.angle - Math.PI / 2);
            ship.x += dirX * 78;
            ship.y += dirY * 78;
            ship.x = clamp(ship.x, ship.radius, canvas.width - ship.radius);
            ship.y = clamp(ship.y, ship.radius, canvas.height - ship.radius);
            invulnRef.current = 1;
            skillCooldownRef.current = DODGE_COOLDOWN_MS / 1000;
          }

          vel.x *= drag;
          vel.y *= drag;
          ship.x = clamp(ship.x + vel.x * dt, ship.radius, canvas.width - ship.radius);
          ship.y = clamp(ship.y + vel.y * dt, ship.radius, canvas.height - ship.radius);

          shootCooldownRef.current -= dt;
          if (keys.has('␣') && shootCooldownRef.current <= 0) {
            const dirX = Math.cos(ship.angle - Math.PI / 2);
            const dirY = Math.sin(ship.angle - Math.PI / 2);
            const shots = 1 + (loadoutRef.current?.passives?.extra_blaster || 0);
            const spread = 0.18;
            for (let s = 0; s < shots; s += 1) {
              const offset = shots === 1 ? 0 : (s - (shots - 1) / 2) * spread;
              const c = Math.cos(offset);
              const sn = Math.sin(offset);
              const sx = dirX * c - dirY * sn;
              const sy = dirX * sn + dirY * c;
              bulletsRef.current.push({ x: ship.x + sx * 14, y: ship.y + sy * 14, vx: sx * 720, vy: sy * 720, radius: 2 });
            }
            playLaserSound();
            shootCooldownRef.current = 0.16;
          }

          const waveCfg = WAVE_CONFIG[Math.min(waveRef.current - 1, WAVE_CONFIG.length - 1)];
          spawnTimerRef.current -= dt;
          if (spawnTimerRef.current <= 0) {
            const canSpawnStar = waveCfg.types.includes('star') && !enemiesRef.current.some((e) => e.type === 'star');
            const spawnStar = canSpawnStar && Math.random() < 0.26;
            enemiesRef.current.push(
              spawnStar ? makeStarShooter(canvas.width, canvas.height) : makeAsteroid(canvas.width, canvas.height, ship.x, ship.y)
            );
            spawnTimerRef.current = rand(waveCfg.spawnInterval[0], waveCfg.spawnInterval[1]);
          }
        }

        for (let i = bulletsRef.current.length - 1; i >= 0; i -= 1) {
          const b = bulletsRef.current[i];
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (b.x < -10 || b.x > canvas.width + 10 || b.y < -10 || b.y > canvas.height + 10) bulletsRef.current.splice(i, 1);
        }

        for (let i = enemiesRef.current.length - 1; i >= 0; i -= 1) {
          const e = enemiesRef.current[i];
          if (e.type === 'asteroid') {
            const dx = ship.x - e.x;
            const dy = ship.y - e.y;
            const d = Math.hypot(dx, dy) || 1;
            const nx = dx / d;
            const ny = dy / d;
            e.vx += (nx * e.speed - e.vx) * (0.9 * dt);
            e.vy += (ny * e.speed - e.vy) * (0.9 * dt);
            e.x += e.vx * dt;
            e.y += e.vy * dt;
            e.rot += e.spin * dt;
          } else {
            if (e.state !== 'dashing') {
              e.x += e.vx * dt;
              e.y += e.vy * dt;
              if (e.x < 20 || e.x > canvas.width - 20) e.vx *= -1;
              if (e.y < 20 || e.y > canvas.height - 20) e.vy *= -1;
            }

            e.attackTimer -= dt;
            e.fireCooldown = Math.max(0, e.fireCooldown - dt);

            if (e.state === 'drift' && e.attackTimer <= 0 && e.fireCooldown <= 0) {
              const dx = ship.x - e.x;
              const dy = ship.y - e.y;
              const d = Math.hypot(dx, dy);
              if (d < 0.0001) {
                const a = rand(0, Math.PI * 2);
                e.lineDir = { x: Math.cos(a), y: Math.sin(a) };
              } else {
                e.lineDir = { x: dx / d, y: dy / d };
              }
              e.dashTarget = rayToScreenEdge(e.x, e.y, e.lineDir.x, e.lineDir.y, canvas.width, canvas.height, 18);
              e.state = 'telegraph';
              e.telegraphTimer = STAR_TELEGRAPH_MS / 1000;
              e.beepTimer = 0.28;
            } else if (e.state === 'telegraph') {
              e.telegraphTimer -= dt;
              e.beepTimer -= dt;

              const progress = 1 - clamp(e.telegraphTimer / (STAR_TELEGRAPH_MS / 1000), 0, 1);
              const nextGap = 0.28 - (0.21 * progress);
              if (e.beepTimer <= 0) {
                playTargetBeep(progress);
                e.beepTimer = Math.max(0.06, nextGap);
              }

              if (e.telegraphTimer <= 0) {
                e.state = 'dashing';
              }
            } else if (e.state === 'dashing') {
              const prevX = e.x;
              const prevY = e.y;
              const dx = e.dashTarget.x - e.x;
              const dy = e.dashTarget.y - e.y;
              const dist = Math.hypot(dx, dy);
              const stepLen = STAR_DASH_SPEED * dt;

              if (dist <= stepLen) {
                e.x = e.dashTarget.x;
                e.y = e.dashTarget.y;
                e.state = 'drift';
                e.attackTimer = rand(1.4, 2.2);
                e.fireCooldown = 1.2;
              } else {
                e.x += (dx / dist) * stepLen;
                e.y += (dy / dist) * stepLen;
              }

              // Break enemies in swept dash segment.
              for (let k = enemiesRef.current.length - 1; k >= 0; k -= 1) {
                const target = enemiesRef.current[k];
                if (!target || target === e) continue;
                const svx = e.x - prevX;
                const svy = e.y - prevY;
                const len2 = (svx * svx) + (svy * svy) || 1;
                const t = clamp((((target.x - prevX) * svx) + ((target.y - prevY) * svy)) / len2, 0, 1);
                const px = prevX + svx * t;
                const py = prevY + svy * t;
                const hitDist = Math.hypot(target.x - px, target.y - py);
                if (hitDist <= target.radius + e.radius * 0.55) {
                  enemiesRef.current.splice(k, 1);
                  scoreRef.current += target.type === 'star' ? 260 : 100;
                  pointsRef.current += target.type === 'star' ? 20 : 10;
                  playImpactSound();
                  registerKill();
                }
              }

              if (!gameOverRef.current && invulnRef.current <= 0) {
                const svx = e.x - prevX;
                const svy = e.y - prevY;
                const len2 = (svx * svx) + (svy * svy) || 1;
                const t = clamp((((ship.x - prevX) * svx) + ((ship.y - prevY) * svy)) / len2, 0, 1);
                const px = prevX + svx * t;
                const py = prevY + svy * t;
                const shipDist = Math.hypot(ship.x - px, ship.y - py);
                if (shipDist <= ship.radius + 4) {
                  livesRef.current = Math.max(0, livesRef.current - 1);
                  invulnRef.current = 1;
                  if (livesRef.current <= 0) gameOverRef.current = true;
                }
              }
            }
          }
        }

        // enemy body collisions (asteroids + shooter asteroid)
        const collideBodies = enemiesRef.current;
        for (let i = 0; i < collideBodies.length; i += 1) {
          for (let j = i + 1; j < collideBodies.length; j += 1) {
            const a = collideBodies[i];
            const b = collideBodies[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.0001;
            const minDist = a.radius + b.radius;
            if (dist < minDist) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = (minDist - dist) * 0.5;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;

              const rvx = b.vx - a.vx;
              const rvy = b.vy - a.vy;
              const velAlongNormal = rvx * nx + rvy * ny;
              if (velAlongNormal > 0) continue;

              const ma = Math.max(1, a.radius * a.radius);
              const mb = Math.max(1, b.radius * b.radius);
              const invMa = 1 / ma;
              const invMb = 1 / mb;
              const restitution = 0.86;
              const impulse = (-(1 + restitution) * velAlongNormal) / (invMa + invMb);
              const ix = impulse * nx;
              const iy = impulse * ny;
              a.vx -= ix * invMa;
              a.vy -= iy * invMa;
              b.vx += ix * invMb;
              b.vy += iy * invMb;
            }
          }
        }

        for (let bi = bulletsRef.current.length - 1; bi >= 0; bi -= 1) {
          const b = bulletsRef.current[bi];
          if (!b) continue;

          let hit = false;
          for (let ei = enemiesRef.current.length - 1; ei >= 0; ei -= 1) {
            const e = enemiesRef.current[ei];
            const d = Math.hypot(b.x - e.x, b.y - e.y);
            if (d <= b.radius + e.radius) {
              enemiesRef.current.splice(ei, 1);
              hit = true;
              scoreRef.current += e.type === 'star' ? 260 : 100;
              pointsRef.current += e.type === 'star' ? 20 : 10;
              playImpactSound();
              registerKill();
              break;
            }
          }
          if (hit) bulletsRef.current.splice(bi, 1);
        }

        if (!gameOverRef.current && !shopOpenRef.current) {
          for (let ei = enemiesRef.current.length - 1; ei >= 0; ei -= 1) {
            const e = enemiesRef.current[ei];
            const dx = e.x - ship.x;
            const dy = e.y - ship.y;
            const d = Math.hypot(dx, dy) || 0.0001;
            const minDist = ship.radius + e.radius + 2;

            if (d <= minDist) {
              const nx = dx / d;
              const ny = dy / d;
              const push = (minDist - d);

              // Always resolve overlap so enemies can't sit inside the ship.
              e.x += nx * push;
              e.y += ny * push;
              e.vx += nx * 40;
              e.vy += ny * 40;

              // Damage only when not invulnerable.
              if (invulnRef.current <= 0) {
                enemiesRef.current.splice(ei, 1);
                livesRef.current = Math.max(0, livesRef.current - 1);
                invulnRef.current = 1;
                if (livesRef.current <= 0) gameOverRef.current = true;
                break;
              }
            }
          }
        }

        emitHud();
        emitRunState();
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const blinkVisible = invulnRef.current <= 0 || Math.floor(ts / 120) % 2 === 0;
      if (blinkVisible) {
        ctx.save();
        ctx.translate(Math.round(ship.x), Math.round(ship.y));
        ctx.rotate(ship.angle);
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(0, -13);
        ctx.lineTo(9, 9);
        ctx.lineTo(0, 5);
        ctx.lineTo(-9, 9);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = '#fff';
      bulletsRef.current.forEach((b) => {
        ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, 3, 3);
      });

      enemiesRef.current.forEach((e) => {
        ctx.save();
        ctx.translate(Math.round(e.x), Math.round(e.y));
        if (e.type === 'asteroid') {
          ctx.rotate(e.rot);
          ctx.strokeStyle = '#fff';
          ctx.beginPath();
          for (let i = 0; i < e.points.length; i += 1) {
            const p = e.points[i];
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          ctx.stroke();
        } else {
          const t = e.state === 'telegraph' ? 0.55 + (1 - (e.telegraphTimer / (STAR_TELEGRAPH_MS / 1000))) * 0.45 : 0.35;
          ctx.fillStyle = `rgba(255,255,255,${t})`;
          ctx.beginPath();
          ctx.arc(0, 0, e.radius, 0, Math.PI * 2);
          ctx.fill();
          if (e.state === 'telegraph') {
            ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(e.dashTarget.x - e.x, e.dashTarget.y - e.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          if (e.state === 'dashing') {
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-e.lineDir.x * 24, -e.lineDir.y * 24);
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      if (shopOpenRef.current && !gameOverRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.72)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(canvas.width / 2 - 180, canvas.height / 2 - 52, 360, 104);
        ctx.fillStyle = '#fff';
        ctx.font = '15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SHOP OPEN', canvas.width / 2, canvas.height / 2 - 14);
        ctx.font = '12px monospace';
        ctx.fillText('Press F to start next wave', canvas.width / 2, canvas.height / 2 + 14);
        ctx.textAlign = 'left';
      }

      if (gameOverRef.current) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillRect((canvas.width / 2) - 150, (canvas.height / 2) - 44, 300, 88);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect((canvas.width / 2) - 150, (canvas.height / 2) - 44, 300, 88);
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 8);
        ctx.font = '11px monospace';
        ctx.fillText('R TO RESTART · ESC TO EXIT', canvas.width / 2, canvas.height / 2 + 16);
        ctx.textAlign = 'left';
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', fit);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [isGameMode, onHudUpdate, onRunStateUpdate]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', background: '#000' }} />;
}

export default AsteroidsMini;
