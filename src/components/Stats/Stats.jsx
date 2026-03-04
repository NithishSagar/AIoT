import useCountUp from '../../hooks/useCountUp';
import './Stats.css';

const statsData = [
  { id: 1, value: 500, suffix: '+', label: 'Members' },
  { id: 2, value: 30, suffix: '+', label: 'Projects' },
  { id: 3, value: 12, suffix: '', label: 'Events' },
  { id: 4, value: 8, suffix: '', label: 'Partners' }
];

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
  return (
    <section className="stats">
      <div className="stats-container">
        {statsData.map((stat, index) => (
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
