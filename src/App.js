import React from 'react';
import './App.css';

// 각 칸에 표시될 임의의 이름 목록 (네임태그)
const names = [
  'gemini',
  'chatgpt',
  'perplexity',
  'claude',
  'grok',
  'null'
];

// HTML 파일이 public/Ai_create_fireworks/ 폴더에 있다고 가정합니다.
const getIframeSrc = (name) => {
  if (name === 'null') {
    return ''; // 'null' 네임태그에는 빈 iframe을 연결
  }
  // 앱의 루트 경로를 기준으로 HTML 파일의 경로를 설정합니다.
  return `/Ai_create_fireworks/${name}.html`;
};

function App() {
  return (
    <div className="container">
      {/* 6개의 아이템을 map 함수를 사용해 생성 */}
      {names.map((name, index) => (
        <div key={index} className="item">
          {/* 1. iframe: 네임태그에 맞는 HTML 파일 연결 */}
          <iframe 
            src={getIframeSrc(name)} 
            title={`Content Frame ${name}`}
            className="content-frame"
            // frameBorder="0" // 테두리 제거 (선택 사항)
            // scrolling="no" // 스크롤 제거
          ></iframe>
          
          {/* 2. 네임태그: 임의로 설정한 이름을 표시 */}
          <p className="name-tag">{name}</p>
        </div>
      ))}
    </div>
  );
}

export default App;