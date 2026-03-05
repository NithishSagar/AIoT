import { useSiteContent } from '../../context/SiteContentContext';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './Blog.css';

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

const BlogCard = ({ post, index }) => {
  const { hasBeenVisible, elementRef } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <article
      ref={elementRef}
      className={`blog-card animate-on-scroll stagger-${index + 1} ${hasBeenVisible ? 'visible' : ''}`}
    >
      <div className="blog-image-wrapper">
        <img src={post.image} alt={post.title} className="blog-image" />
        <span className={`blog-category ${getCategoryClass(post.category)}`}>
          {post.category}
        </span>
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-author">{post.author}</span>
          <span className="blog-divider">•</span>
          <span className="blog-date">{post.date}</span>
          <span className="blog-divider">•</span>
          <span className="blog-read-time">{post.readTime}</span>
        </div>
        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-excerpt">{post.excerpt}</p>
        <a href={post.link} className="blog-link">
          Read More <span className="arrow">→</span>
        </a>
      </div>
    </article>
  );
};

const Blog = () => {
  const { content } = useSiteContent();
  const blogPosts = content.blog || [];

  return (
    <section className="blog section" id="blog">
      <div className="container">
        <h2 className="section-title">
          Latest <span>Insights</span>
        </h2>
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
        <div className="blog-cta">
          <a href="#" className="btn btn-ghost">View All Articles</a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
