import { useState } from 'react';
import './shared.css';

const TagInput = ({ 
  label, 
  tags = [], 
  onChange, 
  placeholder = 'Type and press Enter',
  maxTags = 10
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (tags.length < maxTags && !tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="tag-input-container">
        <div className="tags-wrapper">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button 
                type="button" 
                className="tag-remove"
                onClick={() => removeTag(index)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="tag-input"
            disabled={tags.length >= maxTags}
          />
        </div>
      </div>
      {tags.length >= maxTags && (
        <span className="input-hint">Maximum {maxTags} tags allowed</span>
      )}
    </div>
  );
};

export default TagInput;
