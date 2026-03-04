import { useAdmin } from '../../context/AdminContext';
import { useSiteContent } from '../../../context/SiteContentContext';
import './Sidebar.css';

const Sidebar = ({ sections, activeSection, onSectionChange }) => {
  const { logout, setHasUnsavedChanges } = useAdmin();
  const { exportJSON, importJSON, resetAll } = useSiteContent();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = importJSON(event.target.result);
          if (result.success) {
            alert('Content imported successfully!');
          } else {
            alert('Failed to import: ' + result.error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset ALL content to defaults? This cannot be undone.')) {
      resetAll();
      setHasUnsavedChanges(false);
      alert('All content has been reset to defaults.');
    }
  };

  const handleViewLive = () => {
    window.open('/', '_blank');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-text">AIoT</span>
          <span className="logo-accent">Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Sections</span>
          {sections.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-actions">
        <button className="action-btn" onClick={exportJSON}>
          <span className="action-icon">📤</span>
          <span className="action-label">Export JSON</span>
        </button>
        <button className="action-btn" onClick={handleImport}>
          <span className="action-icon">📥</span>
          <span className="action-label">Import JSON</span>
        </button>
        <button className="action-btn warning" onClick={handleReset}>
          <span className="action-icon">🔄</span>
          <span className="action-label">Reset All</span>
        </button>
        <button className="action-btn" onClick={handleViewLive}>
          <span className="action-icon">🌐</span>
          <span className="action-label">View Live Site</span>
        </button>
        <button className="action-btn danger" onClick={logout}>
          <span className="action-icon">🚪</span>
          <span className="action-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
