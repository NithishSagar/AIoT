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
  const [deleteDropdownTarget, setDeleteDropdownTarget] = useState(null);
  
  const navbar = content.navbar || { links: [], joinButton: {} };
  const links = navbar.links || [];
  const joinButton = navbar.joinButton || { 
    label: 'Join Us', 
    href: '#join', 
    dropdownItems: [] 
  };
  const dropdownItems = joinButton.dropdownItems || [];

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

  // Join Button handlers
  const updateJoinButton = (field, value) => {
    const updatedJoinButton = { ...joinButton, [field]: value };
    updateSection('navbar', { ...navbar, joinButton: updatedJoinButton });
    setHasUnsavedChanges(true);
  };

  const updateDropdownItem = (index, field, value) => {
    const updatedItems = [...dropdownItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updateSection('navbar', { 
      ...navbar, 
      joinButton: { ...joinButton, dropdownItems: updatedItems } 
    });
    setHasUnsavedChanges(true);
  };

  const addDropdownItem = () => {
    const newItem = {
      id: Date.now(),
      label: 'New Option',
      href: '#new-option'
    };
    updateSection('navbar', { 
      ...navbar, 
      joinButton: { ...joinButton, dropdownItems: [...dropdownItems, newItem] } 
    });
    setHasUnsavedChanges(true);
  };

  const deleteDropdownItem = (index) => {
    const updatedItems = dropdownItems.filter((_, i) => i !== index);
    updateSection('navbar', { 
      ...navbar, 
      joinButton: { ...joinButton, dropdownItems: updatedItems } 
    });
    setHasUnsavedChanges(true);
    setDeleteDropdownTarget(null);
  };

  const moveDropdownItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= dropdownItems.length) return;
    
    const updatedItems = [...dropdownItems];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    updateSection('navbar', { 
      ...navbar, 
      joinButton: { ...joinButton, dropdownItems: updatedItems } 
    });
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

      {/* Navigation Links Section */}
      <h3 className="editor-section-title">Navigation Links</h3>
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

      {/* Join Button Section */}
      <div className="editor-divider"></div>
      <h3 className="editor-section-title">Join Us Button</h3>
      <p className="editor-description" style={{ marginBottom: '16px' }}>
        Configure the main call-to-action button and its dropdown options.
      </p>
      
      <div className="editor-card">
        <div className="editor-card-header">
          <span className="editor-card-title">Button Settings</span>
        </div>
        <div className="editor-card-body">
          <div className="input-grid-2">
            <TextInput
              label="Button Label"
              value={joinButton.label || ''}
              onChange={(value) => updateJoinButton('label', value)}
              placeholder="Join Us"
              required
            />
            <TextInput
              label="Button Link (href)"
              value={joinButton.href || ''}
              onChange={(value) => updateJoinButton('href', value)}
              placeholder="#join"
            />
          </div>
        </div>
      </div>

      {/* Dropdown Items */}
      <h4 className="editor-subsection-title">Dropdown Options</h4>
      <div className="editor-items">
        {dropdownItems.map((item, index) => (
          <div key={item.id || index} className="editor-card editor-card-small">
            <div className="editor-card-header">
              <span className="editor-card-title">
                {item.label || 'Untitled Option'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveDropdownItem(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveDropdownItem(index, 1)}
                  disabled={index === dropdownItems.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button 
                  className="card-action-btn danger"
                  onClick={() => setDeleteDropdownTarget(index)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="editor-card-body">
              <div className="input-grid-2">
                <TextInput
                  label="Option Label"
                  value={item.label || ''}
                  onChange={(value) => updateDropdownItem(index, 'label', value)}
                  placeholder="Option text"
                  required
                />
                <TextInput
                  label="Option Link (href)"
                  value={item.href || ''}
                  onChange={(value) => updateDropdownItem(index, 'href', value)}
                  placeholder="#section or /page"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {dropdownItems.length === 0 && (
        <div className="empty-state empty-state-small">
          <p className="empty-state-text">No dropdown options. Add options to show in dropdown.</p>
        </div>
      )}

      <button className="add-btn add-btn-secondary" onClick={addDropdownItem}>
        <span>+</span> Add Dropdown Option
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

      {deleteDropdownTarget !== null && (
        <ConfirmModal
          isOpen={true}
          title="Delete Dropdown Option"
          message={`Are you sure you want to delete "${dropdownItems[deleteDropdownTarget]?.label}"?`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteDropdownItem(deleteDropdownTarget)}
          onCancel={() => setDeleteDropdownTarget(null)}
        />
      )}
    </div>
  );
}
