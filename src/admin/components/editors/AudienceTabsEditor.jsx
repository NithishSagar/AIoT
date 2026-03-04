import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import './editors.css';

export default function AudienceTabsEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const audiences = content.audiences || [];

  const updateAudience = (index, field, value) => {
    const updated = [...audiences];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('audiences', updated);
    setHasUnsavedChanges(true);
  };

  const addAudience = () => {
    const newAudience = {
      id: Date.now(),
      icon: '👤',
      label: 'New Audience',
      title: 'New Audience Group',
      description: 'Description of this audience group...',
      benefits: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
      cta: 'Learn More',
      ctaLink: '#'
    };
    updateSection('audiences', [...audiences, newAudience]);
    setHasUnsavedChanges(true);
  };

  const deleteAudience = (index) => {
    const updated = audiences.filter((_, i) => i !== index);
    updateSection('audiences', updated);
    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  const moveAudience = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= audiences.length) return;
    
    const updated = [...audiences];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSection('audiences', updated);
    setHasUnsavedChanges(true);
  };

  const updateBenefits = (index, benefitsString) => {
    const benefits = benefitsString.split('\n').filter(b => b.trim());
    updateAudience(index, 'benefits', benefits);
  };

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Audience Tabs</h2>
        <p className="editor-description">
          Define different audience groups and tailor messaging for each (students, researchers, professionals, etc.).
        </p>
      </div>

      <div className="editor-items">
        {audiences.map((audience, index) => (
          <div key={audience.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                <span className="card-icon">{audience.icon}</span>
                {audience.label || 'Untitled'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveAudience(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveAudience(index, 1)}
                  disabled={index === audiences.length - 1}
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
              <div className="tab-preview">
                <span className="tab-icon">{audience.icon}</span>
                <span className="tab-label">{audience.label}</span>
              </div>

              <div className="input-grid-2">
                <TextInput
                  label="Tab Icon"
                  value={audience.icon || ''}
                  onChange={(value) => updateAudience(index, 'icon', value)}
                  placeholder="👤"
                />
                <TextInput
                  label="Tab Label"
                  value={audience.label || ''}
                  onChange={(value) => updateAudience(index, 'label', value)}
                  placeholder="Students"
                  required
                />
              </div>

              <TextInput
                label="Content Title"
                value={audience.title || ''}
                onChange={(value) => updateAudience(index, 'title', value)}
                placeholder="For Students"
                required
              />

              <TextArea
                label="Description"
                value={audience.description || ''}
                onChange={(value) => updateAudience(index, 'description', value)}
                placeholder="Why this audience should join..."
                rows={3}
              />

              <TextArea
                label="Benefits (one per line)"
                value={(audience.benefits || []).join('\n')}
                onChange={(value) => updateBenefits(index, value)}
                placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                rows={4}
              />

              <div className="input-grid-2">
                <TextInput
                  label="CTA Button Text"
                  value={audience.cta || ''}
                  onChange={(value) => updateAudience(index, 'cta', value)}
                  placeholder="Get Started"
                />
                <TextInput
                  label="CTA Button Link"
                  value={audience.ctaLink || ''}
                  onChange={(value) => updateAudience(index, 'ctaLink', value)}
                  placeholder="#join"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {audiences.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">No audience tabs defined. Add your first audience group!</p>
        </div>
      )}

      <button className="add-btn" onClick={addAudience}>
        <span>+</span> Add Audience Tab
      </button>

      {deleteTarget !== null && (
        <ConfirmModal
          isOpen={true}
          title="Delete Audience Tab"
          message={`Are you sure you want to delete "${audiences[deleteTarget]?.label}"?`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteAudience(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
