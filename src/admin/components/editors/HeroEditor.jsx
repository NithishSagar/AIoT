import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import './editors.css';

export default function HeroEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  
  const hero = content.hero || {};
  const floatingIcons = hero.floatingIcons || ['🤖', '📡', '🔬', '💡', '🛸', '⚡'];

  const updateField = (field, value) => {
    updateSection('hero', { ...hero, [field]: value });
    setHasUnsavedChanges(true);
  };

  const updateIcon = (index, value) => {
    const updated = [...floatingIcons];
    updated[index] = value;
    updateField('floatingIcons', updated);
  };

  const addIcon = () => {
    updateField('floatingIcons', [...floatingIcons, '🆕']);
  };

  const removeIcon = (index) => {
    const updated = floatingIcons.filter((_, i) => i !== index);
    updateField('floatingIcons', updated);
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
          label="Badge Text"
          value={hero.badge || ''}
          onChange={(value) => updateField('badge', value)}
          placeholder="e.g., AIoT Society"
        />

        <TextInput
          label="Headline"
          value={hero.headline || ''}
          onChange={(value) => updateField('headline', value)}
          placeholder="Main headline text"
          required
        />

        <TextArea
          label="Description"
          value={hero.description || ''}
          onChange={(value) => updateField('description', value)}
          placeholder="Brief description of the society..."
          rows={3}
        />
      </div>

      <div className="editor-section">
        <h3 className="section-title">Call to Action Buttons</h3>
        
        <div className="input-grid-2">
          <TextInput
            label="Primary Button Text"
            value={hero.primaryBtn || ''}
            onChange={(value) => updateField('primaryBtn', value)}
            placeholder="e.g., Start Exploring"
          />
          <TextInput
            label="Primary Button Link"
            value={hero.primaryLink || ''}
            onChange={(value) => updateField('primaryLink', value)}
            placeholder="#focus-areas"
          />
        </div>

        <div className="input-grid-2">
          <TextInput
            label="Secondary Button Text"
            value={hero.secondaryBtn || ''}
            onChange={(value) => updateField('secondaryBtn', value)}
            placeholder="e.g., Join Us"
          />
          <TextInput
            label="Secondary Button Link"
            value={hero.secondaryLink || ''}
            onChange={(value) => updateField('secondaryLink', value)}
            placeholder="#join"
          />
        </div>
      </div>

      <div className="editor-section">
        <h3 className="section-title">Floating Icons</h3>
        <p className="editor-description" style={{ marginBottom: '16px' }}>
          These icons float around the hero section and react to mouse movement.
        </p>

        <div className="floating-icons-editor">
          {floatingIcons.map((icon, index) => (
            <div key={index} className="floating-icon-item">
              <span className="floating-icon-preview">{icon}</span>
              <input
                type="text"
                className="text-input floating-icon-input"
                value={icon}
                onChange={(e) => updateIcon(index, e.target.value)}
                placeholder="Enter emoji"
              />
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
