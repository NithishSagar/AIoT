import { focusAreas } from '../../data/focusAreas';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './FocusAreas.css';

const FocusAreaCard = ({ area, index }) => {
  const { hasBeenVisible, elementRef } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={elementRef}
      className={`focus-card animate-on-scroll stagger-${index + 1} ${hasBeenVisible ? 'visible' : ''}`}
    >
      <span className="focus-icon">{area.icon}</span>
      <h3 className="focus-title">{area.title}</h3>
      <p className="focus-description">{area.description}</p>
    </div>
  );
};

const FocusAreas = () => {
  return (
    <section className="focus-areas section" id="focus-areas">
      <div className="container">
        <h2 className="section-title">
          What is <span>AIoT?</span>
        </h2>
        <div className="focus-grid">
          {focusAreas.map((area, index) => (
            <FocusAreaCard key={area.id} area={area} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
