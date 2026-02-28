import React, { useEffect, useRef } from 'react';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (min, max) => Math.random() * (max - min) + min;

function makeAsteroid(width, height, shipX, shipY) {
  const side = Math.floor(Math.random() * 4); // 0 top, 1 right, 2 bottom, 3 left
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

  // initial heading toward ship (with a little variation)
  const dx = shipX - x;
  const dy = shipY - y;
  const d = Math.hypot(dx, dy) || 1;
  const nx = dx / d;
  const ny = dy / d;

  return {
    x,
    y,
    vx: nx * speed,
    vy: ny * speed,
    speed,
    radius,
    points,
    spin: rand(-0.7, 0.7),
    rot: rand(0, Math.PI * 2),
  };
}

function AsteroidsMini({ isGameMode, pressedKeys }) {
  const canvasRef = useRef(null);

  const shipRef = useRef({ x: 0, y: 0, angle: -Math.PI / 2, radius: 13 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const bulletsRef = useRef([]);
  const asteroidsRef = useRef([]);
  const particlesRef = useRef([]);

  const pressedKeysRef = useRef(new Set());
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);

  const spawnTimerRef = useRef(0);
  const shootCooldownRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    pressedKeysRef.current = pressedKeys;
  }, [pressedKeys]);

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

    // hard reset per entry
    shipRef.current.x = canvas.width / 2;
    shipRef.current.y = canvas.height / 2;
    shipRef.current.angle = -Math.PI / 2;
    velocityRef.current.x = 0;
    velocityRef.current.y = 0;

    bulletsRef.current = [];
    asteroidsRef.current = [];
    particlesRef.current = [];
    spawnTimerRef.current = 0;
    shootCooldownRef.current = 0;
    scoreRef.current = 0;

    window.addEventListener('resize', fit);

    const step = (ts) => {
      // Keep canvas synced with visible size (prevents 1x1 hidden-size bug while animating in).
      const cw = Math.max(1, Math.floor(canvas.clientWidth));
      const ch = Math.max(1, Math.floor(canvas.clientHeight));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        shipRef.current.x = clamp(shipRef.current.x || cw / 2, shipRef.current.radius, cw - shipRef.current.radius);
        shipRef.current.y = clamp(shipRef.current.y || ch / 2, shipRef.current.radius, ch - shipRef.current.radius);
      }

      const prev = lastTimeRef.current || ts;
      const dt = Math.min(0.033, (ts - prev) / 1000);
      lastTimeRef.current = ts;

      const keys = pressedKeysRef.current;
      const ship = shipRef.current;
      const vel = velocityRef.current;

      // Heavier momentum tuning.
      const maxSpeed = 560;
      const accel = 640;
      const drag = 0.991;

      let ix = 0;
      let iy = 0;

      if (keys.has('←')) ix -= 1;
      if (keys.has('→')) ix += 1;
      if (keys.has('↑')) iy -= 1;
      if (keys.has('↓')) iy += 1;

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

        // Weighted turning: rotate toward target direction instead of snapping instantly.
        const targetAngle = Math.atan2(iy, ix) + Math.PI / 2;
        let diff = targetAngle - ship.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        const turnRate = 4.1; // radians/sec
        const maxStep = turnRate * dt;
        ship.angle += clamp(diff, -maxStep, maxStep);
      }

      vel.x *= drag;
      vel.y *= drag;

      ship.x += vel.x * dt;
      ship.y += vel.y * dt;

      ship.x = clamp(ship.x, ship.radius, canvas.width - ship.radius);
      ship.y = clamp(ship.y, ship.radius, canvas.height - ship.radius);

      // Shoot (E)
      shootCooldownRef.current -= dt;
      if (keys.has('␣') && shootCooldownRef.current <= 0) {
        const shotSpeed = 720;
        const dirX = Math.cos(ship.angle - Math.PI / 2);
        const dirY = Math.sin(ship.angle - Math.PI / 2);

        if (bulletsRef.current.length < 36) {
          bulletsRef.current.push({
            x: ship.x + dirX * 14,
            y: ship.y + dirY * 14,
            vx: dirX * shotSpeed,
            vy: dirY * shotSpeed,
            radius: 2,
          });
        }

        shootCooldownRef.current = 0.16;
      }

      // Spawn asteroids
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        if (asteroidsRef.current.length < 18) {
          asteroidsRef.current.push(makeAsteroid(canvas.width, canvas.height, ship.x, ship.y));
        }
        spawnTimerRef.current = rand(0.6, 1.2);
      }

      // Update bullets
      for (let i = bulletsRef.current.length - 1; i >= 0; i -= 1) {
        const b = bulletsRef.current[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (
          b.x < 0 || b.x > canvas.width ||
          b.y < 0 || b.y > canvas.height
        ) {
          bulletsRef.current.splice(i, 1);
        }
      }

      // Update asteroids (home toward ship)
      for (let i = asteroidsRef.current.length - 1; i >= 0; i -= 1) {
        const a = asteroidsRef.current[i];

        const dx = ship.x - a.x;
        const dy = ship.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const nx = dx / d;
        const ny = dy / d;

        const targetVx = nx * a.speed;
        const targetVy = ny * a.speed;
        const steer = 0.9 * dt;

        a.vx += (targetVx - a.vx) * steer;
        a.vy += (targetVy - a.vy) * steer;

        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.rot += a.spin * dt;

        if (a.x < -80 || a.x > canvas.width + 80 || a.y < -80 || a.y > canvas.height + 80) {
          asteroidsRef.current.splice(i, 1);
        }
      }

      // Asteroid vs asteroid collisions (elastic-ish bounce + overlap separation)
      const ast = asteroidsRef.current;
      for (let i = 0; i < ast.length; i += 1) {
        for (let j = i + 1; j < ast.length; j += 1) {
          const a = ast[i];
          const b = ast[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const minDist = a.radius + b.radius;

          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate overlap to avoid sticking/merging
            const overlap = (minDist - dist) * 0.5;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            // Relative velocity along normal
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            // If moving apart after separation, skip impulse
            if (velAlongNormal > 0) continue;

            // Mass by area-ish (radius^2), restitution slightly inelastic
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

            // Tiny spin kick for visual feedback
            a.spin += rand(-0.12, 0.12);
            b.spin += rand(-0.12, 0.12);
          }
        }
      }

      // Bullet vs asteroid collisions
      for (let bi = bulletsRef.current.length - 1; bi >= 0; bi -= 1) {
        const b = bulletsRef.current[bi];
        let hit = false;

        for (let ai = asteroidsRef.current.length - 1; ai >= 0; ai -= 1) {
          const a = asteroidsRef.current[ai];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy);

          if (d <= b.radius + a.radius) {
            asteroidsRef.current.splice(ai, 1);
            hit = true;
            scoreRef.current += Math.round(1000 / Math.max(10, a.radius));

            // Impact particles (white pixel burst)
            const burst = Math.floor(rand(8, 14));
            for (let p = 0; p < burst; p += 1) {
              const ang = rand(0, Math.PI * 2);
              const spd = rand(90, 260);
              particlesRef.current.push({
                x: b.x,
                y: b.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                life: rand(0.16, 0.34),
                maxLife: 0.34,
                size: Math.random() < 0.5 ? 1 : 2,
              });
            }
            if (particlesRef.current.length > 120) {
              particlesRef.current.splice(0, particlesRef.current.length - 120);
            }
            break;
          }
        }

        if (hit) bulletsRef.current.splice(bi, 1);
      }

      // Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i -= 1) {
        const p = particlesRef.current[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= dt;
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      }

      // Draw
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#fff';
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 1.4;

      // Ship (triangle-ish)
      ctx.save();
      ctx.translate(Math.round(ship.x), Math.round(ship.y));
      ctx.rotate(ship.angle);
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(9, 9);
      ctx.lineTo(0, 5);
      ctx.lineTo(-9, 9);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Bullets
      bulletsRef.current.forEach((b) => {
        ctx.fillRect(Math.round(b.x) - 1, Math.round(b.y) - 1, 3, 3);
      });

      // Asteroids
      asteroidsRef.current.forEach((a) => {
        ctx.save();
        ctx.translate(Math.round(a.x), Math.round(a.y));
        ctx.rotate(a.rot);

        ctx.beginPath();
        for (let i = 0; i < a.points.length; i += 1) {
          const p = a.points[i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });

      // Particles
      particlesRef.current.forEach((p) => {
        const alpha = clamp(p.life / p.maxLife, 0, 1);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      });

      // HUD
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.fillText(`SCORE: ${scoreRef.current}`, 14, 22);
      ctx.fillText('MOVE: WASD/ARROWS  •  SPACE: SHOOT  •  Q: DODGE (next)', 14, 40);

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', fit);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [isGameMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
    />
  );
}

export default AsteroidsMini;
