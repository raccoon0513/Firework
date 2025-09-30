import React from 'react';
import './App.css'; // 별도의 CSS 파일이 필요합니다.

// 각 칸에 표시될 임의의 이름 목록
const names = [
  'gemini',
  'chatgpt',
  'perplexity',
  'claude',
  'grok',
  'null'
];

function App() {
  return (
    <div className="container">
      {/* 6개의 아이템을 map 함수를 사용해 생성 */}
      {names.map((name, index) => (
        <div key={index} className="item">
          {/* 1. iframe: 실제 컨텐츠를 표시할 공간 (예시 URL 사용) */}
          <iframe 
            src={`https://www.example.com/${index}`} // 예시 URL입니다. 실제 사용 시 변경하세요.
            title={`Content Frame ${index}`}
            className="content-frame"
            frameBorder="0" // 테두리 제거 (선택 사항)
          ></iframe>
          
          {/* 2. 네임태그: 임의로 설정한 이름을 표시 */}
          <p className="name-tag">{name}</p>
        </div>
      ))}
    </div>
  );
}

export default App;