import React, { useEffect, useRef } from 'react';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function AsteroidsMini({ isGameMode, pressedKeys }) {
  const canvasRef = useRef(null);
  const shipRef = useRef({ x: 0, y: 0, angle: -Math.PI / 2 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const rafRef = useRef(null);
  const pressedKeysRef = useRef(new Set());

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

    // Always reset ship to exact center when entering game mode.
    shipRef.current.x = canvas.width / 2;
    shipRef.current.y = canvas.height / 2;
    shipRef.current.angle = -Math.PI / 2;
    velocityRef.current.x = 0;
    velocityRef.current.y = 0;
    window.addEventListener('resize', fit);

    const step = (ts) => {
      const prev = lastTimeRef.current || ts;
      const dt = Math.min(0.033, (ts - prev) / 1000);
      lastTimeRef.current = ts;

      const ship = shipRef.current;
      const vel = velocityRef.current;

      // Heavier momentum tuning: slower directional response,
      // stronger inertia, and longer time to reverse direction.
      const speed = 560;
      const accel = 780;
      const drag = 0.985;

      let ix = 0;
      let iy = 0;
      const keys = pressedKeysRef.current;

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
        if (vLen > speed) {
          vel.x = (vel.x / vLen) * speed;
          vel.y = (vel.y / vLen) * speed;
        }

        ship.angle = Math.atan2(iy, ix) + Math.PI / 2;
      }

      vel.x *= drag;
      vel.y *= drag;

      ship.x += vel.x * dt;
      ship.y += vel.y * dt;

      const pad = 16;
      ship.x = clamp(ship.x, pad, canvas.width - pad);
      ship.y = clamp(ship.y, pad, canvas.height - pad);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#fff';
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

      // Phase 1 hint
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.fillText('PHASE 1: MOVE SHIP (WASD / ARROWS)', 14, 22);
      ctx.fillText('Q = DODGE (next)  •  E = SHOOT (next)', 14, 40);

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
