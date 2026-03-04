import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import './editors.css';

export default function FocusAreasEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const focusAreas = content.focusAreas || [];

  const updateItem = (index, field, value) => {
    const updated = [...focusAreas];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('focusAreas', updated);
    setHasUnsavedChanges(true);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      icon: '⚡',
      title: 'New Focus Area',
      description: 'Description of this focus area...',
      benefits: ['Benefit 1', 'Benefit 2']
    };
    updateSection('focusAreas', [...focusAreas, newItem]);
    setHasUnsavedChanges(true);
  };

  const deleteItem = (index) => {
    const updated = focusAreas.filter((_, i) => i !== index);
    updateSection('focusAreas', updated);
    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= focusAreas.length) return;
    
    const updated = [...focusAreas];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSection('focusAreas', updated);
    setHasUnsavedChanges(true);
  };

  const updateBenefits = (index, benefitsString) => {
    const benefits = benefitsString.split('\n').filter(b => b.trim());
    updateItem(index, 'benefits', benefits);
  };

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">AIoT? Section</h2>
        <p className="editor-description">
          Manage the focus areas displayed on the landing page. Each card represents a key area of AIoT.
        </p>
      </div>

      <div className="editor-items">
        {focusAreas.map((item, index) => (
          <div key={item.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                <span className="card-icon">{item.icon}</span>
                {item.title || 'Untitled'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === focusAreas.length - 1}
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
                  label="Icon"
                  value={item.icon || ''}
                  onChange={(value) => updateItem(index, 'icon', value)}
                  placeholder="Enter emoji or icon"
                />
                <TextInput
                  label="Title"
                  value={item.title || ''}
                  onChange={(value) => updateItem(index, 'title', value)}
                  placeholder="Focus area title"
                  required
                />
              </div>

              <TextArea
                label="Description"
                value={item.description || ''}
                onChange={(value) => updateItem(index, 'description', value)}
                placeholder="Describe this focus area..."
                rows={3}
              />

              <TextArea
                label="Benefits (one per line)"
                value={(item.benefits || []).join('\n')}
                onChange={(value) => updateBenefits(index, value)}
                placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                rows={4}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={addItem}>
        <span>+</span> Add Focus Area
      </button>

      {deleteTarget !== null && (
        <ConfirmModal
          title="Delete Focus Area"
          message={`Are you sure you want to delete "${focusAreas[deleteTarget]?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
          onConfirm={() => deleteItem(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
