import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import './editors.css';

export default function FooterEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  
  const footer = content.footer || {};
  const socialLinks = footer.socialLinks || [];
  const quickLinks = footer.quickLinks || [];

  const updateField = (field, value) => {
    updateSection('footer', { ...footer, [field]: value });
    setHasUnsavedChanges(true);
  };

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    updateField('socialLinks', updated);
  };

  const addSocialLink = () => {
    const newLink = {
      id: Date.now(),
      platform: 'Website',
      icon: '🔗',
      url: 'https://'
    };
    updateField('socialLinks', [...socialLinks, newLink]);
  };

  const removeSocialLink = (index) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    updateField('socialLinks', updated);
  };

  const updateQuickLink = (index, field, value) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [field]: value };
    updateField('quickLinks', updated);
  };

  const addQuickLink = () => {
    const newLink = {
      id: Date.now(),
      label: 'New Link',
      url: '#'
    };
    updateField('quickLinks', [...quickLinks, newLink]);
  };

  const removeQuickLink = (index) => {
    const updated = quickLinks.filter((_, i) => i !== index);
    updateField('quickLinks', updated);
  };

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Footer</h2>
        <p className="editor-description">
          Customize the footer section including brand info, social links, and quick navigation.
        </p>
      </div>

      <div className="editor-section">
        <h3 className="section-title">Brand Information</h3>
        
        <TextInput
          label="Brand Name"
          value={footer.brandName || ''}
          onChange={(value) => updateField('brandName', value)}
          placeholder="AIoT Society"
        />

        <TextArea
          label="Brand Description"
          value={footer.description || ''}
          onChange={(value) => updateField('description', value)}
          placeholder="Brief description about the society..."
          rows={3}
        />

        <TextInput
          label="Copyright Text"
          value={footer.copyright || ''}
          onChange={(value) => updateField('copyright', value)}
          placeholder="© 2025 AIoT Society. All rights reserved."
        />
      </div>

      <div className="editor-section">
        <h3 className="section-title">Social Links</h3>
        
        <div className="editor-items">
          {socialLinks.map((link, index) => (
            <div key={link.id || index} className="editor-card">
              <div className="editor-card-header">
                <span className="editor-card-title">
                  <span className="card-icon">{link.icon}</span>
                  {link.platform || 'Social Link'}
                </span>
                <div className="editor-card-actions">
                  <button 
                    className="card-action-btn danger"
                    onClick={() => removeSocialLink(index)}
                    title="Remove"
                  >
                    🗑
                  </button>
                </div>
              </div>
              <div className="editor-card-body">
                <div className="input-grid-3">
                  <TextInput
                    label="Icon"
                    value={link.icon || ''}
                    onChange={(value) => updateSocialLink(index, 'icon', value)}
                    placeholder="📱"
                  />
                  <TextInput
                    label="Platform"
                    value={link.platform || ''}
                    onChange={(value) => updateSocialLink(index, 'platform', value)}
                    placeholder="Twitter"
                  />
                  <TextInput
                    label="URL"
                    value={link.url || ''}
                    onChange={(value) => updateSocialLink(index, 'url', value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={addSocialLink}>
          <span>+</span> Add Social Link
        </button>
      </div>

      <div className="editor-section">
        <h3 className="section-title">Quick Links</h3>
        
        <div className="footer-links-grid">
          {quickLinks.map((link, index) => (
            <div key={link.id || index} className="footer-link-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: '#7A8899' }}>Link {index + 1}</span>
                <button 
                  className="card-action-btn danger"
                  onClick={() => removeQuickLink(index)}
                  title="Remove"
                  style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}
                >
                  ×
                </button>
              </div>
              <TextInput
                label="Label"
                value={link.label || ''}
                onChange={(value) => updateQuickLink(index, 'label', value)}
                placeholder="About Us"
              />
              <TextInput
                label="URL"
                value={link.url || ''}
                onChange={(value) => updateQuickLink(index, 'url', value)}
                placeholder="#about"
              />
            </div>
          ))}
        </div>

        <button className="add-btn" onClick={addQuickLink} style={{ marginTop: '16px' }}>
          <span>+</span> Add Quick Link
        </button>
      </div>

      <div className="editor-section">
        <h3 className="section-title">Contact Information</h3>
        
        <TextInput
          label="Email Address"
          value={footer.email || ''}
          onChange={(value) => updateField('email', value)}
          placeholder="contact@aiotsociety.org"
        />

        <TextInput
          label="Location"
          value={footer.location || ''}
          onChange={(value) => updateField('location', value)}
          placeholder="University Campus, City"
        />
      </div>
    </div>
  );
}
