import { useState } from 'react';
import './PreviewPanel.css';

export default function PreviewPanel({ isOpen, onToggle }) {
  const [viewMode, setViewMode] = useState('desktop');
  
  const viewModes = [
    { id: 'desktop', icon: '🖥️', width: '100%' },
    { id: 'tablet', icon: '📱', width: '768px' },
    { id: 'mobile', icon: '📲', width: '375px' }
  ];

  const currentMode = viewModes.find(m => m.id === viewMode);

  const handleRefresh = () => {
    const iframe = document.querySelector('.preview-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <>
      <button 
        className={`preview-toggle ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        title={isOpen ? 'Close Preview' : 'Open Preview'}
      >
        <span className="preview-toggle-icon">{isOpen ? '✕' : '👁️'}</span>
        <span className="preview-toggle-text">{isOpen ? 'Close' : 'Preview'}</span>
      </button>

      <div className={`preview-panel ${isOpen ? 'open' : ''}`}>
        <div className="preview-header">
          <div className="preview-title">
            <span className="preview-icon">👁️</span>
            Live Preview
          </div>
          <div className="preview-controls">
            <div className="view-mode-switcher">
              {viewModes.map(mode => (
                <button
                  key={mode.id}
                  className={`view-mode-btn ${viewMode === mode.id ? 'active' : ''}`}
                  onClick={() => setViewMode(mode.id)}
                  title={mode.id}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
            <button className="preview-refresh-btn" onClick={handleRefresh} title="Refresh">
              🔄
            </button>
          </div>
        </div>

        <div className="preview-container">
          <div 
            className="preview-frame-wrapper"
            style={{ maxWidth: currentMode.width }}
          >
            <iframe
              className="preview-iframe"
              src="/"
              title="Site Preview"
            />
          </div>
        </div>
      </div>
    </>
  );
}
