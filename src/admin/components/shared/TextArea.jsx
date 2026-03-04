import './shared.css';

const TextArea = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  maxLength,
  showCount = false,
  rows = 4,
  required = false
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className="text-area"
        />
        {showCount && maxLength && (
          <span className="char-count textarea-count">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextArea;
