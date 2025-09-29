import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// ====================================================================
// [1] AI 코드 통합 섹션
// AI들이 작성한 코드는 여기에 함수 형태로 통합됩니다.
// 각 함수는 다음 인수를 받습니다: 
// (canvasElement, ctx, width, height, eventData, canvasIndex)
// ====================================================================

// AI 1: Gemini - 로직 통합 대기 중 (인덱스 0)
const aiCanvasLogic1 = (canvas, ctx, width, height, eventData) => {
  // 캔버스 초기 상태 설정 (예: 클릭 시 초기화)
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

// AI 2: Claude - 로직 통합 대기 중 (인덱스 1)
const aiCanvasLogic2 = (canvas, ctx, width, height, eventData) => {
  if (eventData.type === 'mousedown') {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.fillText('로직 대기 중 (Claude)', width / 2, height / 2);
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

// 애니메이션 관리를 위한 Map은 비워둡니다.
const particleSystems = new Map();
const animationFrames = new Map();

// Firework Particle Class (로직 재사용을 위해 남겨둠)
class Particle {
  constructor(x, y, color, size, velocity, gravity, friction, drag = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.velocity = velocity;
    this.alpha = 1;
    this.gravity = gravity !== undefined ? gravity : 0.05;
    this.friction = friction !== undefined ? friction : 0.99;
    this.drag = drag;
    this.isDragging = false;
  }

  update() {
    if (!this.drag) {
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
      this.velocity.y += this.gravity; 
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
    this.alpha -= 0.01;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// 애니메이션 루프 (로직 재사용을 위해 남겨둠)
const animateFirework = (canvas, ctx, width, height, canvasIndex) => {
    // 캔버스 크기 업데이트
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    width = canvas.width;
    height = canvas.height;

    // 배경 지우기
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
    ctx.fillRect(0, 0, width, height);
    
    let particles = particleSystems.get(canvasIndex) || [];

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        if (!particle.drag) {
            particle.update();
        }
        
        particle.draw(ctx);

        if (particle.alpha <= 0 || particle.y > height || particle.y < 0) {
            particles.splice(i, 1);
        }
    }

    if (particles.length > 0) {
        const frameId = requestAnimationFrame(() => animateFirework(canvas, ctx, width, height, canvasIndex));
        animationFrames.set(canvasIndex, frameId);
    } else {
        animationFrames.delete(canvasIndex);
    }
};


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
          setCanvasDims({
              width: firstCanvasWrapper.offsetWidth,
              height: singleRowHeight - 10 - (firstCanvasWrapper.nextElementSibling ? firstCanvasWrapper.nextElementSibling.offsetHeight : 0)
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
      animationFrames.forEach(frameId => cancelAnimationFrame(frameId));
    };
  }, [calculateRowHeight]);


  // [핵심] 모든 캔버스에 이벤트를 동기화하여 전달하는 함수
  const handleInteraction = useCallback((e, index) => {
    const isMouseDown = e.type === 'mousedown';
    const isMouseUp = e.type === 'mouseup';
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
          // index 0~4에 해당하는 로직 함수를 호출
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
