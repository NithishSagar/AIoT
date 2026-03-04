import { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Sidebar from './components/Sidebar/Sidebar';
import AdminNavbar from './components/AdminNavbar/AdminNavbar';
import PreviewPanel from './components/PreviewPanel/PreviewPanel';
import HeroEditor from './components/editors/HeroEditor';
import StatsEditor from './components/editors/StatsEditor';
import FocusAreasEditor from './components/editors/FocusAreasEditor';
import AudienceTabsEditor from './components/editors/AudienceTabsEditor';
import EventsEditor from './components/editors/EventsEditor';
import ProjectsEditor from './components/editors/ProjectsEditor';
import BlogEditor from './components/editors/BlogEditor';
import FooterEditor from './components/editors/FooterEditor';
import { useSiteContent } from '../context/SiteContentContext';
import './AdminApp.css';

const sections = [
  { id: 'hero', label: 'Hero', icon: '🏠', component: HeroEditor },
  { id: 'stats', label: 'Statistics', icon: '📊', component: StatsEditor },
  { id: 'focusAreas', label: 'AIoT?', icon: '🎯', component: FocusAreasEditor },
  { id: 'audiences', label: 'Audiences', icon: '👥', component: AudienceTabsEditor },
  { id: 'events', label: 'Events', icon: '📅', component: EventsEditor },
  { id: 'projects', label: 'Projects', icon: '🚀', component: ProjectsEditor },
  { id: 'blog', label: 'Blog', icon: '📝', component: BlogEditor },
  { id: 'footer', label: 'Footer', icon: '📌', component: FooterEditor },
];

function AdminContent() {
  const [activeSection, setActiveSection] = useState('hero');
  const [previewOpen, setPreviewOpen] = useState(false);
  const { hasUnsavedChanges, setHasUnsavedChanges } = useAdmin();
  const { saveContent, discardChanges } = useSiteContent();

  const currentSection = sections.find(s => s.id === activeSection);
  const EditorComponent = currentSection?.component;

  const handleSave = () => {
    saveContent();
    setHasUnsavedChanges(false);
  };

  const handleDiscard = () => {
    discardChanges();
    setHasUnsavedChanges(false);
  };

  return (
    <div className={`admin-layout ${previewOpen ? 'preview-open' : ''}`}>
      <Sidebar 
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="admin-main">
        <AdminNavbar 
          sectionTitle={currentSection?.label || 'Dashboard'}
          sectionIcon={currentSection?.icon || '📋'}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
        
        <div className="admin-content">
          {EditorComponent && <EditorComponent />}
        </div>
      </main>

      <PreviewPanel 
        isOpen={previewOpen}
        onToggle={() => setPreviewOpen(!previewOpen)}
      />
    </div>
  );
}

export default function AdminApp() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
