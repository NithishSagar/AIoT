import './shared.css';

const ColorPicker = ({ 
  label, 
  value, 
  onChange 
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="color-picker-wrapper">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-input"
        />
        <span className="color-value">{value}</span>
      </div>
    </div>
  );
};

export default ColorPicker;
