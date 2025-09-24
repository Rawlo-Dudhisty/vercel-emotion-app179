// Filename: frontend/src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [emotions, setEmotions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    setIsLoading(true);
    setError(null);
    setEmotions(null);

    try {
      // ✅ IMPORTANT: The URL is now relative.
      // This works because Vercel will host the API and the frontend on the same domain.
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'The server returned an error.');
      }

      const data = await response.json();
      setEmotions(data.emotions);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... The rest of the component code is the same ...
  // (renderEmotionBars, getEmotionColor, JSX return, etc.)

  // Fun little helper to give colors to emotions
  const getEmotionColor = (emotion) => {
    const colors = { joy: '#fde047', sadness: '#60a5fa', anger: '#f87171', fear: '#a78bfa', surprise: '#7dd3fc', disgust: '#84cc16', love: '#f472b6' };
    return colors[emotion.toLowerCase()] || '#d1d5db';
  }

  // Helper to render the emotion bars
  const renderEmotionBars = () => {
    if (!emotions) return null;
    const sortedEmotions = Object.entries(emotions).sort(([,a],[,b]) => b-a);
    return sortedEmotions.map(([emotion, score]) => (
      <div className="emotion-bar-container" key={emotion}>
        <span className="emotion-label">{emotion}</span>
        <div className="emotion-bar">
          <div 
            className="emotion-score" 
            style={{ width: `${score * 100}%`, backgroundColor: getEmotionColor(emotion) }}
          >
            {(score * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      <header><h1>Emotion Analysis 🧠</h1><p>Enter a passage of text and see the emotional breakdown.</p></header>
      <main>
        <div className="input-section">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or write your passage here..." rows="8" />
          <div className="button-group">
            <button onClick={analyzeText} disabled={isLoading || !text}>{isLoading ? 'Analyzing...' : 'Analyze Text'}</button>
            <button className="clear-btn" onClick={() => {setText(''); setEmotions(null); setError(null);}}>Clear</button>
          </div>
        </div>
        <div className="results-section">
          {error && <p className="error-message">Error: {error}</p>}
          {emotions && <div className="chart"><h3>Results</h3>{renderEmotionBars()}</div>}
        </div>
      </main>
    </div>
  );
}

export default App;