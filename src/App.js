// src/App.js

import './App.css';

function App() {
  const canvasCount = 5;
  const totalSlots = 6;
  
  const gridItems = Array.from({ length: totalSlots }, (_, index) => {
    // 0부터 4까지 (총 5개)는 캔버스 슬롯
    const isCanvasSlot = index < canvasCount; 
    
    const canvas = isCanvasSlot ? (
      // 캔버스 요소. CSS에서 크기를 조정할 수 있으나, 명시적으로 width/height 설정
      <canvas id={`canvas-${index}`} width="300" height="200" className="Canvas-element"></canvas>
    ) : (
      // 6번째 (오른쪽 아래) 빈 슬롯
      <div className="Empty-slot">빈 공간</div>
    );

    // 이름표 텍스트 설정
    const nameTagText = isCanvasSlot ? `캔버스 ${index + 1}` : `빈 공간 이름표`;

    return (
      <div key={index} className="Grid-item">
        <div className="Canvas-wrapper">
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
      <div className="Grid-container">
        {gridItems}
      </div>
    </div>
  );
}

export default App;