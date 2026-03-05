import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import './editors.css';

export default function NavbarEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const navbar = content.navbar || { links: [] };
  const links = navbar.links || [];

  const updateLink = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    updateSection('navbar', { ...navbar, links: updatedLinks });
    setHasUnsavedChanges(true);
  };

  const addLink = () => {
    const newLink = {
      id: Date.now(),
      label: 'New Link',
      href: '#section'
    };
    updateSection('navbar', { ...navbar, links: [...links, newLink] });
    setHasUnsavedChanges(true);
  };

  const deleteLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    updateSection('navbar', { ...navbar, links: updatedLinks });
    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  const moveLink = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= links.length) return;
    
    const updatedLinks = [...links];
    [updatedLinks[index], updatedLinks[newIndex]] = [updatedLinks[newIndex], updatedLinks[index]];
    updateSection('navbar', { ...navbar, links: updatedLinks });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Navigation</h2>
        <p className="editor-description">
          Configure the navigation links that appear in the header.
        </p>
      </div>

      <div className="editor-items">
        {links.map((link, index) => (
          <div key={link.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                {link.label || 'Untitled Link'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveLink(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveLink(index, 1)}
                  disabled={index === links.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button 
                  className="card-action-btn danger"
                  onClick={() => setDeleteTarget(index)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="editor-card-body">
              <div className="input-grid-2">
                <TextInput
                  label="Label"
                  value={link.label || ''}
                  onChange={(value) => updateLink(index, 'label', value)}
                  placeholder="Link text"
                  required
                />
                <TextInput
                  label="Target (href)"
                  value={link.href || ''}
                  onChange={(value) => updateLink(index, 'href', value)}
                  placeholder="#section or /page"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <p className="empty-state-text">No navigation links yet. Add your first link!</p>
        </div>
      )}

      <button className="add-btn" onClick={addLink}>
        <span>+</span> Add Link
      </button>

      {deleteTarget !== null && (
        <ConfirmModal
          isOpen={true}
          title="Delete Link"
          message={`Are you sure you want to delete "${links[deleteTarget]?.label}"?`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteLink(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
