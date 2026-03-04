import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import './editors.css';

export default function StatsEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  
  const stats = content.stats || [];

  const updateStat = (index, field, value) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('stats', updated);
    setHasUnsavedChanges(true);
  };

  const addStat = () => {
    const newStat = {
      id: Date.now(),
      number: 100,
      suffix: '+',
      label: 'New Stat'
    };
    updateSection('stats', [...stats, newStat]);
    setHasUnsavedChanges(true);
  };

  const deleteStat = (index) => {
    const updated = stats.filter((_, i) => i !== index);
    updateSection('stats', updated);
    setHasUnsavedChanges(true);
  };

  const moveStat = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= stats.length) return;
    
    const updated = [...stats];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSection('stats', updated);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Statistics</h2>
        <p className="editor-description">
          Display impressive numbers that highlight the society's achievements and community size.
        </p>
      </div>

      <div className="editor-items">
        {stats.map((stat, index) => (
          <div key={stat.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                {stat.label || 'Untitled Stat'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveStat(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveStat(index, 1)}
                  disabled={index === stats.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button 
                  className="card-action-btn danger"
                  onClick={() => deleteStat(index)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="editor-card-body">
              <div className="stat-preview">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>

              <div className="input-grid-3">
                <TextInput
                  label="Number"
                  type="number"
                  value={stat.number || 0}
                  onChange={(value) => updateStat(index, 'number', parseInt(value) || 0)}
                  placeholder="100"
                  required
                />
                <TextInput
                  label="Suffix"
                  value={stat.suffix || ''}
                  onChange={(value) => updateStat(index, 'suffix', value)}
                  placeholder="+, %, K, etc."
                />
                <TextInput
                  label="Label"
                  value={stat.label || ''}
                  onChange={(value) => updateStat(index, 'label', value)}
                  placeholder="Active Members"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={addStat}>
        <span>+</span> Add Statistic
      </button>
    </div>
  );
}
