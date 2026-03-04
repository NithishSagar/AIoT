import { useRef, useState } from 'react';
import './shared.css';

const ImageUpload = ({ 
  label, 
  value, 
  onChange,
  accept = 'image/*'
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div
        className={`image-upload ${isDragging ? 'dragging' : ''} ${value ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="image-input-hidden"
        />
        {value ? (
          <div className="image-preview">
            <img src={value} alt="Preview" />
            <button 
              type="button" 
              className="image-remove"
              onClick={handleRemove}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <span className="upload-icon">📷</span>
            <span className="upload-text">Drop image or click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
