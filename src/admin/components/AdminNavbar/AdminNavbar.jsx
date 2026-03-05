import { useSiteContent } from '../../../context/SiteContentContext';
import './AdminNavbar.css';

const AdminNavbar = ({ sectionTitle, sectionIcon, hasUnsavedChanges, onSave, onDiscard }) => {
  const { isConnected, error } = useSiteContent();

  const handleViewLive = () => {
    window.open('/', '_blank');
  };

  return (
    <>
      {error && !isConnected && (
        <div className="offline-banner">
          <span className="offline-icon">⚠️</span>
          {error}
        </div>
      )}
      <header className="admin-navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">
            <span className="navbar-icon">{sectionIcon}</span>
            <span>{sectionTitle}</span>
          </h1>
          {isConnected && (
            <span className="live-indicator">
              <span className="live-dot"></span>
              Live
            </span>
          )}
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">
              <span className="unsaved-dot"></span>
              Unsaved changes
            </span>
          )}
        </div>

        <div className="navbar-actions">
          <button className="navbar-btn ghost" onClick={handleViewLive}>
            🌐 View Live
          </button>
          <button 
            className="navbar-btn ghost" 
            onClick={onDiscard}
            disabled={!hasUnsavedChanges}
          >
            Discard
          </button>
          <button 
            className="navbar-btn primary" 
            onClick={onSave}
            disabled={!hasUnsavedChanges}
          >
            Save Changes
          </button>
        </div>
      </header>
    </>
  );
};

export default AdminNavbar;
