import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import SelectInput from '../shared/SelectInput';
import './editors.css';

export default function HeroEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  
  const hero = content.hero || {};
  const floatingIcons = hero.floatingIcons || [];
  const buttons = hero.buttons || [];

  const updateField = (field, value) => {
    updateSection('hero', { ...hero, [field]: value });
    setHasUnsavedChanges(true);
  };

  // Floating Icons handlers
  const updateIcon = (index, field, value) => {
    const updated = [...floatingIcons];
    updated[index] = { ...updated[index], [field]: value };
    updateField('floatingIcons', updated);
  };

  const addIcon = () => {
    const newId = Math.max(0, ...floatingIcons.map(i => i.id)) + 1;
    updateField('floatingIcons', [...floatingIcons, { id: newId, icon: '🆕', enabled: true }]);
  };

  const removeIcon = (index) => {
    const updated = floatingIcons.filter((_, i) => i !== index);
    updateField('floatingIcons', updated);
  };

  // Buttons handlers
  const updateButton = (index, field, value) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value };
    updateField('buttons', updated);
  };

  const addButton = () => {
    const newId = Math.max(0, ...buttons.map(b => b.id)) + 1;
    updateField('buttons', [...buttons, { id: newId, label: 'New Button', href: '#', style: 'ghost' }]);
  };

  const removeButton = (index) => {
    const updated = buttons.filter((_, i) => i !== index);
    updateField('buttons', updated);
  };

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Hero Section</h2>
        <p className="editor-description">
          Customize the main banner section at the top of the landing page.
        </p>
      </div>

      <div className="editor-section">
        <h3 className="section-title">Main Content</h3>
        
        <TextInput
          label="Headline (Typewriter Text)"
          value={hero.headline || ''}
          onChange={(value) => updateField('headline', value)}
          placeholder="Make Things Think!"
          required
        />

        <TextArea
          label="Subheadline"
          value={hero.subheadline || ''}
          onChange={(value) => updateField('subheadline', value)}
          placeholder="Brief description of the society..."
          rows={3}
        />
      </div>

      <div className="editor-section">
        <h3 className="section-title">Call to Action Buttons</h3>
        <p className="editor-description" style={{ marginBottom: '16px' }}>
          Add buttons with links to sections or external URLs.
        </p>

        <div className="editor-items">
          {buttons.map((button, index) => (
            <div key={button.id} className="editor-card">
              <div className="editor-card-header">
                <span className="editor-card-title">{button.label || 'Button'}</span>
                <button className="remove-btn" onClick={() => removeButton(index)}>
                  Remove
                </button>
              </div>
              <div className="editor-card-content">
                <div className="input-grid-2">
                  <TextInput
                    label="Button Label"
                    value={button.label || ''}
                    onChange={(value) => updateButton(index, 'label', value)}
                    placeholder="Join the Network"
                  />
                  <TextInput
                    label="Link / Section"
                    value={button.href || ''}
                    onChange={(value) => updateButton(index, 'href', value)}
                    placeholder="#join or https://..."
                  />
                </div>
                <SelectInput
                  label="Button Style"
                  value={button.style || 'primary'}
                  onChange={(value) => updateButton(index, 'style', value)}
                  options={[
                    { value: 'primary', label: 'Primary (Filled)' },
                    { value: 'ghost', label: 'Ghost (Outline)' }
                  ]}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={addButton} style={{ marginTop: '12px' }}>
          <span>+</span> Add Button
        </button>
      </div>

      <div className="editor-section">
        <h3 className="section-title">Floating Icons</h3>
        <p className="editor-description" style={{ marginBottom: '16px' }}>
          These icons float around the hero section and react to mouse movement.
        </p>

        <div className="floating-icons-editor">
          {floatingIcons.map((iconObj, index) => (
            <div key={iconObj.id || index} className="floating-icon-item">
              <span className="floating-icon-preview">{iconObj.icon}</span>
              <input
                type="text"
                className="text-input floating-icon-input"
                value={iconObj.icon || ''}
                onChange={(e) => updateIcon(index, 'icon', e.target.value)}
                placeholder="Enter emoji"
              />
              <label className="floating-icon-toggle">
                <input
                  type="checkbox"
                  checked={iconObj.enabled !== false}
                  onChange={(e) => updateIcon(index, 'enabled', e.target.checked)}
                />
                Visible
              </label>
              <button
                className="floating-icon-remove"
                onClick={() => removeIcon(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={addIcon} style={{ marginTop: '12px' }}>
          <span>+</span> Add Icon
        </button>
      </div>
    </div>
  );
}
