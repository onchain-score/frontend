"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

function createStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 2 + 0.3,
    opacity: Math.random() * 0.7 + 0.1,
    speed: Math.random() * 0.15 + 0.02,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      starsRef.current = createStars(180, window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      time += 1;

      for (const star of starsRef.current) {
        // Gentle upward drift
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = h + 5;
          star.x = Math.random() * w;
        }

        // Twinkle
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.opacity * (0.5 + twinkle * 0.5);

        // Glow for bigger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 160, 255, ${alpha * 0.08})`;
          ctx.fill();
        }

        // Star dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #0a0a20 0%, #050510 60%, #020208 100%)",
        }}
      />

      {/* Star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Nebula glow - cyan top */}
      <div
        className="absolute -top-[200px] left-1/3 w-[700px] h-[700px] rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 60%)",
        }}
      />

      {/* Nebula glow - purple right */}
      <div
        className="absolute top-1/3 -right-[150px] w-[500px] h-[500px] rounded-full animate-glow-pulse [animation-delay:1.5s]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Nebula glow - warm bottom left */}
      <div
        className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full animate-glow-pulse [animation-delay:3s]"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
