import { useSiteContent } from '../../context/SiteContentContext';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './Events.css';

const getTypeColor = (type) => {
  switch (type.toLowerCase()) {
    case 'workshop':
      return 'cyan';
    case 'seminar':
      return 'violet';
    case 'hackathon':
      return 'gradient';
    default:
      return 'cyan';
  }
};

const EventCard = ({ event, index }) => {
  const { hasBeenVisible, elementRef } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={elementRef}
      className={`event-card animate-on-scroll stagger-${index + 1} ${hasBeenVisible ? 'visible' : ''}`}
    >
      <div className="event-date">
        <span className="event-day">{event.date.day}</span>
        <span className="event-month">{event.date.month}</span>
      </div>
      <div className="event-content">
        <span className={`event-type type-${getTypeColor(event.type)}`}>
          {event.type}
        </span>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <a href={event.link} className="event-link">
          Register <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
};

const Events = () => {
  const { content } = useSiteContent();
  const events = content.events || [];

  return (
    <section className="events section" id="events">
      <div className="container">
        <h2 className="section-title">
          Upcoming <span>Events</span>
        </h2>
        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
