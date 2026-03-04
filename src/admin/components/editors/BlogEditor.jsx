import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import TagInput from '../shared/TagInput';
import SelectInput from '../shared/SelectInput';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import './editors.css';

export default function BlogEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const posts = content.blog || [];

  const updatePost = (index, field, value) => {
    const updated = [...posts];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('blog', updated);
    setHasUnsavedChanges(true);
  };

  const addPost = () => {
    const newPost = {
      id: Date.now(),
      title: 'New Blog Post',
      excerpt: 'Brief excerpt of the blog post...',
      author: 'Author Name',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      category: 'technology',
      tags: ['AIoT', 'Tech'],
      featured: false
    };
    updateSection('blog', [...posts, newPost]);
    setHasUnsavedChanges(true);
  };

  const deletePost = (index) => {
    const updated = posts.filter((_, i) => i !== index);
    updateSection('blog', updated);
    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  const movePost = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= posts.length) return;
    
    const updated = [...posts];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSection('blog', updated);
    setHasUnsavedChanges(true);
  };

  const formatDatePreview = (dateStr) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'news', label: 'News' },
    { value: 'research', label: 'Research' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' }
  ];

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Blog Posts</h2>
        <p className="editor-description">
          Manage blog posts, articles, and news updates for the society.
        </p>
      </div>

      <div className="editor-items">
        {posts.map((post, index) => (
          <div key={post.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                {post.featured && <span style={{ color: '#ffa502' }}>⭐</span>}
                {post.title || 'Untitled Post'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => movePost(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => movePost(index, 1)}
                  disabled={index === posts.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button 
                  className="card-action-btn danger"
                  onClick={() => setDeleteTarget(index)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="editor-card-body">
              <div className="blog-meta-preview">
                <span>📅 {formatDatePreview(post.date)}</span>
                <span>👤 {post.author}</span>
                <span>⏱ {post.readTime}</span>
              </div>

              <TextInput
                label="Post Title"
                value={post.title || ''}
                onChange={(value) => updatePost(index, 'title', value)}
                placeholder="Blog post title"
                required
              />

              <TextArea
                label="Excerpt"
                value={post.excerpt || ''}
                onChange={(value) => updatePost(index, 'excerpt', value)}
                placeholder="Brief summary of the post..."
                rows={3}
              />

              <div className="input-grid-2">
                <TextInput
                  label="Author"
                  value={post.author || ''}
                  onChange={(value) => updatePost(index, 'author', value)}
                  placeholder="Author name"
                  required
                />
                <TextInput
                  label="Date"
                  type="date"
                  value={post.date || ''}
                  onChange={(value) => updatePost(index, 'date', value)}
                  required
                />
              </div>

              <div className="input-grid-2">
                <TextInput
                  label="Read Time"
                  value={post.readTime || ''}
                  onChange={(value) => updatePost(index, 'readTime', value)}
                  placeholder="5 min read"
                />
                <SelectInput
                  label="Category"
                  value={post.category || 'technology'}
                  onChange={(value) => updatePost(index, 'category', value)}
                  options={categoryOptions}
                />
              </div>

              <TagInput
                label="Tags"
                tags={post.tags || []}
                onChange={(tags) => updatePost(index, 'tags', tags)}
                placeholder="Add tag..."
              />

              <div className="toggle-group">
                <span className="toggle-label">Featured Post</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={post.featured || false}
                    onChange={(e) => updatePost(index, 'featured', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p className="empty-state-text">No blog posts yet. Write your first post!</p>
        </div>
      )}

      <button className="add-btn" onClick={addPost}>
        <span>+</span> Add Blog Post
      </button>

      {deleteTarget !== null && (
        <ConfirmModal
          title="Delete Blog Post"
          message={`Are you sure you want to delete "${posts[deleteTarget]?.title}"?`}
          confirmText="Delete"
          variant="danger"
          onConfirm={() => deletePost(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
