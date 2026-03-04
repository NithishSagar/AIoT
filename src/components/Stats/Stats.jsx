import { useSiteContent } from '../../context/SiteContentContext';
import useCountUp from '../../hooks/useCountUp';
import './Stats.css';

const StatItem = ({ value, suffix, label }) => {
  const { count, elementRef } = useCountUp(value, 2000);

  return (
    <div className="stat-item" ref={elementRef}>
      <span className="stat-value">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const Stats = () => {
  const { content } = useSiteContent();
  const stats = content.stats || [];

  return (
    <section className="stats">
      <div className="stats-container">
        {stats.map((stat) => (
          <StatItem
            key={stat.id}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
};

export default Stats;
