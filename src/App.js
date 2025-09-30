import React from 'react';
import './App.css'; 

function App() {
  // HTML 파일이 public/Ai_create_fireworks/ 폴더에 있으므로, 
  // 웹 서버 루트(/)를 기준으로 경로를 설정합니다.
  const BASE_PATH = '/Ai_create_fireworks/';
  
  return (
    <div className="container">
      
      {/* 1. gemini */}
      <div className="item">
        <iframe 
          src={`${BASE_PATH}gemini.html`} 
          title="Content Frame gemini"
          className="content-frame"
          frameBorder="0"
          scrolling="no" // 스크롤 제거
        ></iframe>
        <p className="name-tag">gemini</p>
      </div>

      {/* 2. chatgpt */}
      <div className="item">
        <iframe 
          src={`${BASE_PATH}chatgpt.html`} 
          title="Content Frame chatgpt"
          className="content-frame"
          frameBorder="0"
          scrolling="no" // 스크롤 제거
        ></iframe>
        <p className="name-tag">chatgpt</p>
      </div>

      {/* 3. perplexity */}
      <div className="item">
        <iframe 
          src={`${BASE_PATH}perplexity.html`} 
          title="Content Frame perplexity"
          className="content-frame"
          frameBorder="0"
          scrolling="no" // 스크롤 제거
        ></iframe>
        <p className="name-tag">perplexity</p>
      </div>

      {/* 4. claude */}
      <div className="item">
        <iframe 
          src={`${BASE_PATH}claude.html`} 
          title="Content Frame claude"
          className="content-frame"
          frameBorder="0"
          scrolling="no" // 스크롤 제거
        ></iframe>
        <p className="name-tag">claude</p>
      </div>

      {/* 5. grok */}
      <div className="item">
        <iframe 
          src={`${BASE_PATH}grok.html`} 
          title="Content Frame grok"
          className="content-frame"
          frameBorder="0"
          scrolling="no" // 스크롤 제거
        ></iframe>
        <p className="name-tag">grok</p>
      </div>

      {/* 6. null (빈 iframe) */}
      <div className="item">
        {/* 'null' 네임태그에는 빈 iframe을 연결 */}
        <iframe 
          src="" 
          title="Content Frame null"
          className="content-frame"
          frameBorder="0"
          scrolling="no" // 스크롤 제거
        ></iframe>
        <p className="name-tag">null</p>
      </div>

    </div>
  );
}

export default App;