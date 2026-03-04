import './shared.css';

const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  maxLength,
  showCount = false,
  type = 'text',
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
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="text-input"
        />
        {showCount && maxLength && (
          <span className="char-count">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInput;
