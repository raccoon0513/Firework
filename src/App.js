import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// ====================================================================
// [1] AI 코드 통합 섹션
// AI들이 작성한 코드는 여기에 함수 형태로 통합됩니다.
// 각 함수는 다음 인수를 받습니다: 
// (canvasElement, ctx, width, height, eventData, canvasIndex)
// ====================================================================

// 애니메이션 관리를 위한 Map (공유)
const fireworksSystems = new Map(); // 각 캔버스의 폭죽 입자 및 로켓 상태를 저장
const animationFrames = new Map(); // 각 캔버스의 애니메이션 프레임 ID를 저장

// Firework Particle / Rocket Class (로직 재사용을 위해 필수)
class FireworkElement {
  constructor(type, x, y, options) {
    this.type = type; // 'rocket' 또는 'particle'
    this.x = x;
    this.y = y;
    this.alpha = options.alpha !== undefined ? options.alpha : 1;

    if (type === 'rocket') {
        this.targetY = options.targetY;
        this.speed = options.speed || 8;
        this.color = options.color || '#ffffff';
        this.trail = [];
        this.finished = false;
    } else { // type === 'particle'
        this.vx = options.vx;
        this.vy = options.vy;
        this.color = options.color;
        this.size = options.size || 3;
        this.gravity = options.gravity || 0.015;
        this.friction = options.friction || 0.98;
    }
  }

  update(width, height) {
    if (this.type === 'rocket') {
        this.y -= this.speed;
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();

        // 목표 지점 도달 시 폭발 준비
        if (this.y <= this.targetY) {
            this.finished = true;
        }
    } else { // type === 'particle'
        this.vx *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.005;
        this.size *= 0.99;
    }
  }

  draw(ctx) {
    if (this.type === 'rocket') {
      // 로켓 궤적 그리기
      ctx.fillStyle = this.color;
      this.trail.forEach((pos, i) => {
        ctx.globalAlpha = i / this.trail.length;
        ctx.fillRect(pos.x - 1, pos.y - 1, 2, 2);
      });
      ctx.globalAlpha = 1;
    } else {
      // 입자 그리기
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

// 애니메이션 루프 함수 (Gemini/Claude 통합 로직에서 사용)
const animateCanvas = (canvas, ctx, canvasIndex, options = {}) => {
    // 캔버스 크기 업데이트
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const width = canvas.width;
    const height = canvas.height;

    const { backgroundColor = 'black', friction = 0.98, gravity = 0.015, particleCount = 100, colors = ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0099ff', '#9900ff', '#ff00ff', '#ffffff'] } = options;

    // 반투명 배경으로 페이드 효과
    ctx.fillStyle = `${backgroundColor}1a`; 
    ctx.fillRect(0, 0, width, height);

    let elements = fireworksSystems.get(canvasIndex) || [];

    elements = elements.filter(el => {
        el.update(width, height);

        if (el.type === 'rocket' && el.finished) {
            // 폭발 로직 (Claude의 createExplosion 로직)
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
                const speed = Math.random() * 3 + 2;
                elements.push(new FireworkElement('particle', el.x, el.y, {
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    gravity: gravity,
                    friction: friction,
                }));
            }
            return false; // 로켓 제거
        }
        
        el.draw(ctx);
        
        // 입자가 너무 작거나 투명해지면 제거
        if (el.type === 'particle' && (el.alpha <= 0 || el.size <= 0.5)) return false;

        return true;
    });

    fireworksSystems.set(canvasIndex, elements);

    if (elements.length > 0) {
        const frameId = requestAnimationFrame(() => animateCanvas(canvas, ctx, canvasIndex, options));
        animationFrames.set(canvasIndex, frameId);
    } else {
        animationFrames.delete(canvasIndex);
    }
};


// 캔버스에 로켓을 추가하고 애니메이션을 시작하는 헬퍼 함수
const startRocketAnimation = (x, y, height, canvasIndex, options) => {
  let elements = fireworksSystems.get(canvasIndex) || [];
  
  // 로켓 추가 (항상 캔버스 맨 아래에서 시작)
  elements.push(new FireworkElement('rocket', x, height, {
    targetY: y,
    speed: 8,
    color: options.colors[Math.floor(Math.random() * options.colors.length)],
  }));

  fireworksSystems.set(canvasIndex, elements);

  // 애니메이션 루프가 실행 중이 아니라면 시작
  if (!animationFrames.has(canvasIndex)) {
    const canvas = document.getElementById(`canvas-${canvasIndex}`);
    const ctx = canvas.getContext('2d');
    animateCanvas(canvas, ctx, canvasIndex, options);
  }
};


// AI 1: Gemini - 로직 통합 대기 중 (인덱스 0)
const aiCanvasLogic1 = (canvas, ctx, width, height, eventData, canvasIndex) => {
  if (eventData.type === 'mousedown') {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.fillText('로직 대기 중 (Gemini)', width / 2, height / 2);
  }
};

// AI 2: Claude - Firework Logic (통합된 로직)
const aiCanvasLogic2 = (canvas, ctx, width, height, eventData, canvasIndex) => {
  // Claude AI에게 할당된 파라미터 (FireworksCanvas의 기본값을 재현)
  const options = {
    backgroundColor: 'black',
    particleCount: 100,
    gravity: 0.015,
    friction: 0.98,
    colors: ['#ff0000', '#ff6600', '#ffff00', '#00ff00', '#0099ff', '#9900ff', '#ff00ff', '#ffffff'],
  };

  // 마우스 클릭 이벤트가 발생했을 때 로켓 발사
  if (eventData.type === 'mousedown' && eventData.coords) {
    const { x, y } = eventData.coords;
    startRocketAnimation(x, y, height, canvasIndex, options);
  }

  // 캔버스 초기 상태 설정 또는 애니메이션 유지
  if (!animationFrames.has(canvasIndex)) {
     ctx.fillStyle = options.backgroundColor;
     ctx.fillRect(0, 0, width, height);
     ctx.font = '24px Arial';
     ctx.fillStyle = 'white';
     ctx.textAlign = 'center';
     ctx.fillText('Claude: 클릭하여 폭죽 발사', width / 2, height / 2);
  } else {
     // 애니메이션 루프가 이미 실행 중이라면 배경만 업데이트
     animateCanvas(canvas, ctx, canvasIndex, options);
  }
};

// AI 3: ChatGPT - 로직 통합 대기 중 (인덱스 2)
const aiCanvasLogic3 = (canvas, ctx, width, height, eventData) => {
  if (eventData.type === 'mousedown') {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.fillText('로직 대기 중 (ChatGPT)', width / 2, height / 2);
  }
};

// AI 4: Perplexity - 로직 통합 대기 중 (인덱스 3)
const aiCanvasLogic4 = (canvas, ctx, width, height, eventData) => {
  if (eventData.type === 'mousedown') {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.fillText('로직 대기 중 (Perplexity)', width / 2, height / 2);
  }
};

// AI 5: Grok - 로직 통합 대기 중 (인덱스 4)
const aiCanvasLogic5 = (canvas, ctx, width, height, eventData) => {
  if (eventData.type === 'mousedown') {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.fillText('로직 대기 중 (Grok)', width / 2, height / 2);
  }
};


// ====================================================================
// [2] 캔버스 및 애니메이션 관리 (빈 틀 유지)
// ====================================================================

// Firework Particle Class는 [1] 섹션으로 이동했습니다.


// AI 이름과 로직 매핑
const aiConfig = [
  { name: "Gemini", logic: aiCanvasLogic1 },
  { name: "Claude", logic: aiCanvasLogic2 },
  { name: "ChatGPT", logic: aiCanvasLogic3 },
  { name: "Perplexity", logic: aiCanvasLogic4 },
  { name: "Grok", logic: aiCanvasLogic5 },
];

const App = () => {
  const canvasCount = aiConfig.length;
  const totalSlots = 6;
  const gridContainerRef = useRef(null);
  const [gridRowHeight, setGridRowHeight] = useState('1fr');
  
  const canvasRefs = useRef([]); 
  const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0 });

  // 캔버스 크기 계산 및 동적 적용 로직 (레이아웃 유지)
  const calculateRowHeight = useCallback(() => {
    if (gridContainerRef.current) {
      const containerHeight = gridContainerRef.current.offsetHeight;
      const totalGap = 16; 
      const spaceForRows = containerHeight - totalGap;
      const singleRowHeight = spaceForRows / 3;
      
      setGridRowHeight(`${singleRowHeight}px`);
      
      const firstCanvasWrapper = document.getElementById('canvas-wrapper-0');
      if (firstCanvasWrapper) {
          // 이름표 높이 계산은 복잡하므로 간단화 (레이아웃 템플릿 유지)
          setCanvasDims({
              width: firstCanvasWrapper.offsetWidth,
              height: singleRowHeight // 근사치 사용
          });
      }
    } else {
      setGridRowHeight('1fr');
    }
  }, []);

  useEffect(() => {
    calculateRowHeight();
    window.addEventListener('resize', calculateRowHeight);
    return () => {
      window.removeEventListener('resize', calculateRowHeight);
      // 컴포넌트 언마운트 시 모든 애니메이션 프레임 정리
      animationFrames.forEach(frameId => cancelAnimationFrame(frameId));
    };
  }, [calculateRowHeight]);


  // [핵심] 모든 캔버스에 이벤트를 동기화하여 전달하는 함수
  const handleInteraction = useCallback((e, index) => {
    const isMouseDown = e.type === 'mousedown';
    const isMouseUp = e.type === 'mouseup';
    // Claude 로직은 로켓 발사 로직만 필요하므로, onMouseMove는 임시로 주석 처리
    const isMouseMove = e.type === 'mousemove'; 

    if (isMouseDown || isMouseUp || isMouseMove) {
      // 1. 클릭 좌표 계산 (모든 캔버스에 동일하게 전달될 좌표)
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const eventData = {
        type: e.type,
        coords: { x: clickX, y: clickY },
      };

      // 2. 모든 캔버스 순회 및 로직 실행
      canvasRefs.current.forEach((canvas, canvasIndex) => {
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const { width, height } = canvas.getBoundingClientRect();

          // 캔버스 해상도 조정
          canvas.width = width;
          canvas.height = height;
          
          // 해당 AI의 로직 실행 (로직 함수는 eventData를 사용하여 동기화된 작업을 수행)
          // aiCanvasLogic2는 Claude의 통합 로직을 사용합니다.
          aiConfig[canvasIndex].logic(canvas, ctx, width, height, eventData, canvasIndex);
        }
      });
    }
  }, []);

  const gridItems = Array.from({ length: totalSlots }, (_, index) => {
    const isCanvasSlot = index < canvasCount; 
    
    // 캔버스 렌더링
    const canvas = isCanvasSlot ? (
      <canvas 
        id={`canvas-${index}`} 
        className="Canvas-element"
        ref={el => canvasRefs.current[index] = el}
        // 모든 마우스 이벤트를 중앙 집중식 핸들러에 연결
        onMouseDown={e => handleInteraction(e, index)}
        onMouseUp={e => handleInteraction(e, index)}
        onMouseMove={e => handleInteraction(e, index)}
      ></canvas>
    ) : (
      // 빈 공간
      <div className="Empty-slot">
        캔버스 {canvasCount + 1}
        <br/>
        (여기는 빈 공간입니다)
      </div>
    );

    // 이름표 텍스트 설정
    const nameTagText = isCanvasSlot ? `${aiConfig[index].name} (AI ${index + 1})` : `빈 공간 이름표`;

    return (
      <div key={index} className="Grid-item">
        <div id={`canvas-wrapper-${index}`} className="Canvas-wrapper">
          {canvas}
        </div>
        <div className="Name-tag">
          {nameTagText}
        </div>
      </div>
    );
  });

  return (
    <div className="App">
      <div 
        ref={gridContainerRef} 
        className="Grid-container" 
        style={{ '--row-height': gridRowHeight }} 
      >
        {gridItems}
      </div>
    </div>
  );
};

export default App;
