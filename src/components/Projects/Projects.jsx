import { useSiteContent } from '../../context/SiteContentContext';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './Projects.css';

const getCategoryClass = (category) => {
  switch (category.toLowerCase()) {
    case 'ai':
      return 'category-ai';
    case 'iot':
      return 'category-iot';
    case 'aiot':
      return 'category-aiot';
    default:
      return 'category-ai';
  }
};

const ProjectCard = ({ project, index }) => {
  const { hasBeenVisible, elementRef } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={elementRef}
      className={`project-card animate-on-scroll stagger-${index + 1} ${hasBeenVisible ? 'visible' : ''}`}
    >
      <div className="project-header">
        <span className={`project-category ${getCategoryClass(project.category)}`}>
          {project.category}
        </span>
        {project.status && (
          <span className={`project-status status-${project.status}`}>
            {project.status === 'live' ? '🟢 Live' : '✅ Completed'}
          </span>
        )}
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tech">
        {project.techStack.map((tech, i) => (
          <span key={i} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>
      <a href={project.link} className="project-link">
        View Project <span className="arrow">→</span>
      </a>
    </div>
  );
};

const Projects = () => {
  const { content } = useSiteContent();
  const projects = content.projects || [];
  
  return (
    <section className="projects section" id="projects">
      <div className="container">
        <h2 className="section-title">
          Featured <span>Projects</span>
        </h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
