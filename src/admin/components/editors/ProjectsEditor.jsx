import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import TagInput from '../shared/TagInput';
import SelectInput from '../shared/SelectInput';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import './editors.css';

export default function ProjectsEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const projects = content.projects || [];

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    updateSection('projects', updated);
    setHasUnsavedChanges(true);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: 'New Project',
      description: 'Project description...',
      tech: ['React', 'Node.js'],
      category: 'iot',
      status: 'live',
      team: 3,
      githubUrl: '',
      demoUrl: ''
    };
    updateSection('projects', [...projects, newProject]);
    setHasUnsavedChanges(true);
  };

  const deleteProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    updateSection('projects', updated);
    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  const moveProject = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;
    
    const updated = [...projects];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSection('projects', updated);
    setHasUnsavedChanges(true);
  };

  const categoryOptions = [
    { value: 'iot', label: 'IoT' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'automation', label: 'Automation' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Projects</h2>
        <p className="editor-description">
          Showcase the innovative projects built by society members.
        </p>
      </div>

      <div className="editor-items">
        {projects.map((project, index) => (
          <div key={project.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                {project.title || 'Untitled Project'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveProject(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveProject(index, 1)}
                  disabled={index === projects.length - 1}
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
              {project.tech && project.tech.length > 0 && (
                <div className="project-tech-preview">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              )}

              <TextInput
                label="Project Title"
                value={project.title || ''}
                onChange={(value) => updateProject(index, 'title', value)}
                placeholder="Project name"
                required
              />

              <TextArea
                label="Description"
                value={project.description || ''}
                onChange={(value) => updateProject(index, 'description', value)}
                placeholder="Brief description of the project..."
                rows={3}
              />

              <TagInput
                label="Technologies"
                tags={project.tech || []}
                onChange={(tags) => updateProject(index, 'tech', tags)}
                placeholder="Add technology..."
              />

              <div className="input-grid-3">
                <SelectInput
                  label="Category"
                  value={project.category || 'iot'}
                  onChange={(value) => updateProject(index, 'category', value)}
                  options={categoryOptions}
                />
                <SelectInput
                  label="Status"
                  value={project.status || 'live'}
                  onChange={(value) => updateProject(index, 'status', value)}
                  options={statusOptions}
                />
                <TextInput
                  label="Team Size"
                  type="number"
                  value={project.team || 1}
                  onChange={(value) => updateProject(index, 'team', parseInt(value) || 1)}
                  placeholder="3"
                />
              </div>

              <div className="input-grid-2">
                <TextInput
                  label="GitHub URL"
                  value={project.githubUrl || ''}
                  onChange={(value) => updateProject(index, 'githubUrl', value)}
                  placeholder="https://github.com/..."
                />
                <TextInput
                  label="Demo URL"
                  value={project.demoUrl || ''}
                  onChange={(value) => updateProject(index, 'demoUrl', value)}
                  placeholder="https://demo..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <p className="empty-state-text">No projects yet. Showcase your first project!</p>
        </div>
      )}

      <button className="add-btn" onClick={addProject}>
        <span>+</span> Add Project
      </button>

      {deleteTarget !== null && (
        <ConfirmModal
          isOpen={true}
          title="Delete Project"
          message={`Are you sure you want to delete "${projects[deleteTarget]?.title}"?`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteProject(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
