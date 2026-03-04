import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <div className="not-found-glitch" data-text="PAGE NOT FOUND">
          PAGE NOT FOUND
        </div>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="not-found-btn">
          Return to Home
        </a>
      </div>
      <div className="not-found-grid"></div>
    </div>
  );
};

export default NotFound;
