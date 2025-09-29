import React, { useRef, useEffect, useState, useCallback } from 'react';

// Tailwind CSS is assumed to be available. We'll use a dark theme.

// --- 상수 및 유틸리티 함수 설정 ---

// 캔버스 초기화 및 애니메이션에 필요한 기본 설정 값
const GRAVITY = 0.05; // 중력 가속도 (입자가 천천히 떨어지도록 낮은 값 설정)
const FRICTION = 0.98; // 공기 저항/감쇠율 (입자가 빠르게 감속하도록 높은 값 설정)
const ROCKET_SPEED = 5; // 로켓의 수직 속도
const PARTICLE_COUNT = 80; // 폭발 시 생성되는 입자 수

/**
 * 무작위 색상 문자열 생성 (HSL 형식)
 * @returns {string} HSL 색상 문자열
 */
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 100%, 70%)`;
};

// --- 폭죽 구성 요소 클래스 정의 ---

/**
 * Particle: 폭발 후 흩어지는 불꽃 입자 클래스
 */
class Particle {
  constructor(x, y, color, angle, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    // 극좌표를 직교좌표로 변환하여 속도 설정
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1; // 불투명도 (점점 페이드 아웃)
    this.life = Math.random() * 50 + 50; // 입자의 생명력
  }

  update() {
    // 공기 저항/감쇠 적용
    this.vx *= FRICTION;
    this.vy *= FRICTION;
    // 중력 적용 (매우 느린 낙하)
    this.vy += GRAVITY;

    this.x += this.vx;
    this.y += this.vy;

    // 생명력 감소 및 알파값 업데이트 (점점 투명해짐)
    this.life--;
    this.alpha = this.life / 100; // 생명력에 비례하여 불투명도 감소
    
    // 입자가 소멸했는지 확인
    return this.life <= 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Rocket: 발사되어 목표 지점으로 날아가는 로켓 클래스
 */
class Rocket {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = getRandomColor();
    this.exploded = false;
    // 로켓의 수직 속도는 일정하게 유지
    this.vy = -ROCKET_SPEED;
    // 목표 지점을 향한 수평 속도 계산 (단순화: 전체 이동 시간에 걸쳐 목표 X에 도달)
    const travelTime = (startY - targetY) / ROCKET_SPEED;
    this.vx = (targetX - startX) / travelTime;
    
    // 로켓 꼬리 효과를 위한 과거 위치 기록
    this.trail = [];
    this.trailLength = 15;
  }

  update() {
    if (this.exploded) return [];

    // 꼬리 위치 기록
    this.trail.unshift({x: this.x, y: this.y});
    if (this.trail.length > this.trailLength) {
        this.trail.pop();
    }

    this.x += this.vx;
    this.y += this.vy;

    // 목표 지점에 도달했는지 확인 (Y축이 위로 이동하므로 y <= targetY)
    if (this.y <= this.targetY || this.vy > 0) { // vy > 0은 로켓이 하강하기 시작했음을 의미
      this.exploded = true;
      return this.explode();
    }

    return [];
  }

  explode() {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // 360도 전체 방향으로 입자 발사
      const angle = (Math.PI * 2 / PARTICLE_COUNT) * i;
      // 랜덤 속도 (2에서 6 사이)
      const speed = Math.random() * 4 + 2; 
      particles.push(new Particle(this.x, this.y, getRandomColor(), angle, speed));
    }
    return particles;
  }

  draw(ctx) {
    // 로켓 꼬리 그리기
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    
    for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i];
        const alpha = (this.trailLength - i) / this.trailLength;
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1 + alpha * 2; // 꼬리 두께 조절
        ctx.globalAlpha = alpha * 0.5; // 꼬리 투명도 조절
        ctx.stroke();
    }

    // 로켓 본체 그리기
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1; // 초기화
  }
}


// --- React App 컴포넌트 ---

export default function App() {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // 활성 로켓과 입자들을 담는 배열 (useRef를 사용하여 리렌더링 없이 상태를 업데이트)
  const fireworksRef = useRef({
    rockets: [],
    particles: []
  });

  // 1. 캔버스 크기 조정 핸들러
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // 캔버스 크기를 윈도우 크기에 맞춤
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setSize({ width: canvas.width, height: canvas.height });
    }
  }, []);

  // 2. 초기 캔버스 설정 및 리사이즈 이벤트 리스너 등록
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  // 3. 애니메이션 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;

    const animate = () => {
      // A. 전체 화면 지우기 (블랙 배경으로 부드러운 잔상 효과를 위해 낮은 투명도로 지움)
      // 이전 폭죽의 잔상이 남아있지 않도록 전체를 지우되, 부드러움을 위해 약간의 투명도 사용
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fw = fireworksRef.current;

      // B. 로켓 업데이트 및 폭발 처리
      fw.rockets = fw.rockets.filter(rocket => {
        const newParticles = rocket.update();
        if (newParticles.length > 0) {
          fw.particles.push(...newParticles);
        }
        return !rocket.exploded; // 폭발하지 않은 로켓만 남김
      });

      // C. 입자 업데이트 및 소멸 처리
      fw.particles = fw.particles.filter(particle => {
        return !particle.update(); // 생명력이 남아있는 입자만 남김
      });

      // D. 그리기
      [...fw.rockets, ...fw.particles].forEach(item => item.draw(ctx));
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size.width, size.height]); // 캔버스 크기가 변경될 때 애니메이션 재시작

  // 4. 클릭 이벤트 핸들러
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetX = e.clientX;
    const targetY = e.clientY;
    
    // 캔버스 하단 중앙에서 발사 시작
    const startX = canvas.width / 2;
    const startY = canvas.height;

    const newRocket = new Rocket(startX, startY, targetX, targetY);
    
    // useRef에 새 로켓 추가
    fireworksRef.current.rockets.push(newRocket);
  };
  
  return (
    <div 
      className="w-screen h-screen bg-black overflow-hidden" 
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        // 캔버스는 크기가 CSS가 아닌 속성으로 설정되어야 애니메이션 품질이 좋음
        width={size.width}
        height={size.height}
      >
        캔버스를 지원하지 않는 브라우저입니다.
      </canvas>
    </div>
  );
}
