import React, { useRef, useEffect, useState } from 'react';

function App() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const fireworksRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireworksRef.current = fireworksRef.current.filter(firework => {
        if (firework.type === 'rocket') {
          firework.y -= firework.speed;
          firework.trail.push({ x: firework.x, y: firework.y });
          if (firework.trail.length > 10) firework.trail.shift();

          ctx.fillStyle = firework.color;
          firework.trail.forEach((pos, i) => {
            ctx.globalAlpha = i / firework.trail.length;
            ctx.fillRect(pos.x - 2, pos.y - 2, 4, 4);
          });
          ctx.globalAlpha = 1;

          if (firework.y <= firework.targetY) {
            createExplosion(firework.x, firework.y);
            return false;
          }
          return true;
        } else {
          firework.vx *= 0.98;
          firework.vy += 0.015;
          firework.x += firework.vx;
          firework.y += firework.vy;
          firework.alpha -= 0.005;
          firework.size *= 0.99;

          if (firework.alpha <= 0 || firework.size <= 0.5) return false;

          ctx.save();
          ctx.globalAlpha = firework.alpha;
          ctx.fillStyle = firework.color;
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          return true;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const createExplosion = (x, y) => {
      const particleCount = 100;
      const colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0099ff', '#9900ff', '#ff00ff', '#ffffff'];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 3 + 2;
        
        fireworksRef.current.push({
          type: 'particle',
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          size: Math.random() * 3 + 2
        });
      }
    };

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    fireworksRef.current.push({
      type: 'rocket',
      x: x,
      y: canvas.height,
      targetY: y,
      speed: 8,
      color: '#ffffff',
      trail: []
    });
  };

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleClick}
      />
    </div>
  );
}

export default App;