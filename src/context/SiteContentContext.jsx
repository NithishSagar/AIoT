import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

// Default content matching the data/ files
const defaultContent = {
  hero: {
    headline: 'Make Things Think!',
    subheadline: 'Where Artificial Intelligence meets the Internet of Things. Building the bridge between intelligent systems and connected devices to shape tomorrow\'s world.',
    buttons: [
      { id: 1, label: 'Join the Network', href: '#join', style: 'primary' },
      { id: 2, label: 'Explore Projects', href: '#projects', style: 'ghost' }
    ],
    floatingIcons: [
      { id: 1, icon: '🧠', enabled: true },
      { id: 2, icon: '📡', enabled: true },
      { id: 3, icon: '💻', enabled: true },
      { id: 4, icon: '⚡', enabled: true },
      { id: 5, icon: '🔗', enabled: true },
      { id: 6, icon: '🌐', enabled: true },
      { id: 7, icon: '🤖', enabled: true },
      { id: 8, icon: '📊', enabled: true }
    ]
  },
  stats: [
    { id: 1, value: 500, suffix: '+', label: 'Members' },
    { id: 2, value: 30, suffix: '+', label: 'Projects' },
    { id: 3, value: 12, suffix: '', label: 'Events' },
    { id: 4, value: 8, suffix: '', label: 'Partners' }
  ],
  focusAreas: [
    { id: 1, icon: '🤖', title: 'Artificial Intelligence', description: 'Exploring machine learning, deep learning, and neural networks for intelligent systems.' },
    { id: 2, icon: '📡', title: 'Internet of Things', description: 'Connecting devices and sensors to create smart, interconnected ecosystems.' },
    { id: 3, icon: '⚡', title: 'Edge Computing', description: 'Processing data closer to the source for faster, more efficient operations.' },
    { id: 4, icon: '🏙️', title: 'Smart Cities', description: 'Building intelligent urban infrastructure for sustainable living.' },
    { id: 5, icon: '🏭', title: 'Industry 4.0', description: 'Revolutionizing manufacturing with automation and data exchange.' },
    { id: 6, icon: '🏥', title: 'Healthcare Tech', description: 'Advancing medical technology with AI-powered diagnostics and monitoring.' }
  ],
  events: [
    { id: 1, date: { day: '15', month: 'MAR' }, title: 'AI & IoT Integration Workshop', type: 'Workshop', description: 'Hands-on session exploring how to integrate AI models with IoT devices for real-world applications.', link: '#' },
    { id: 2, date: { day: '22', month: 'MAR' }, title: 'Future of Smart Cities Seminar', type: 'Seminar', description: 'Industry experts discuss the latest trends and innovations shaping tomorrow\'s urban landscapes.', link: '#' },
    { id: 3, date: { day: '05', month: 'APR' }, title: 'AIoT Innovation Hackathon', type: 'Hackathon', description: '48-hour hackathon to build innovative AIoT solutions. Prizes worth $5,000 for winners!', link: '#' }
  ],
  projects: [
    { id: 1, category: 'AIoT', title: 'Smart Campus Monitoring System', description: 'An integrated system using AI-powered sensors to monitor energy usage, air quality, and occupancy across campus buildings.', techStack: ['Python', 'TensorFlow', 'Raspberry Pi', 'MQTT'], link: '#', status: 'live' },
    { id: 2, category: 'AI', title: 'Predictive Maintenance Engine', description: 'Machine learning model that predicts equipment failures before they occur, reducing downtime by 40%.', techStack: ['PyTorch', 'FastAPI', 'Docker', 'PostgreSQL'], link: '#', status: 'completed' },
    { id: 3, category: 'IoT', title: 'Connected Greenhouse Network', description: 'Automated greenhouse management system with real-time monitoring and climate control optimization.', techStack: ['Arduino', 'Node.js', 'InfluxDB', 'Grafana'], link: '#', status: 'live' }
  ],
  navbar: {
    links: [
      { id: 1, label: 'About', href: '#about' },
      { id: 2, label: 'AIoT?', href: '#focus-areas' },
      { id: 3, label: 'Events', href: '#events' },
      { id: 4, label: 'Projects', href: '#projects' },
      { id: 5, label: 'Blog', href: '#blog' },
      { id: 6, label: 'Join Us', href: '#join' }
    ]
  },
  audienceTabs: {
    students: {
      id: 'students',
      title: 'Students',
      features: [
        { icon: '📚', title: 'Learn by Doing', description: 'Hands-on workshops and projects to build real-world skills in AI and IoT technologies.' },
        { icon: '🤝', title: 'Mentorship Network', description: 'Connect with industry professionals and researchers who guide your learning journey.' },
        { icon: '🏆', title: 'Competitions & Hackathons', description: 'Participate in challenges to test your skills and win exciting prizes.' }
      ]
    },
    researchers: {
      id: 'researchers',
      title: 'Researchers',
      features: [
        { icon: '🔬', title: 'Collaborative Research', description: 'Join interdisciplinary research groups working on cutting-edge AIoT problems.' },
        { icon: '📄', title: 'Publication Support', description: 'Resources and peer review to help you publish in top conferences and journals.' },
        { icon: '💡', title: 'Funding Opportunities', description: 'Access to grants, sponsorships, and resources to fuel your research projects.' }
      ]
    },
    professionals: {
      id: 'professionals',
      title: 'Professionals',
      features: [
        { icon: '🌐', title: 'Industry Networking', description: 'Connect with peers and potential collaborators from leading tech companies.' },
        { icon: '📈', title: 'Skill Advancement', description: 'Stay ahead with workshops on the latest tools, frameworks, and methodologies.' },
        { icon: '🎤', title: 'Speaking Opportunities', description: 'Share your expertise at our events and build your professional brand.' }
      ]
    }
  },
  blog: [
    { id: 1, category: 'AI', title: 'The Rise of Edge AI: Processing Intelligence at the Source', excerpt: 'Explore how edge computing is revolutionizing AI deployment by bringing machine learning models closer to where data is generated.', author: 'Dr. Sarah Chen', date: 'Feb 28, 2026', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop', link: '#' },
    { id: 2, category: 'IoT', title: 'Building Secure IoT Networks: Best Practices for 2026', excerpt: 'Security remains the top concern for IoT deployments. Learn the latest strategies to protect your connected devices and data.', author: 'Michael Torres', date: 'Feb 22, 2026', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop', link: '#' },
    { id: 3, category: 'AIoT', title: 'Smart Agriculture: How AIoT is Transforming Farming', excerpt: 'From precision irrigation to crop health monitoring, discover how the fusion of AI and IoT is creating sustainable farming solutions.', author: 'Emily Watson', date: 'Feb 15, 2026', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop', link: '#' }
  ],
  footer: {
    tagline: 'Connecting intelligence to the world through AI and IoT innovation.',
    quickLinks: [
      { label: 'About Us', href: '#about' },
      { label: 'Events', href: '#events' },
      { label: 'Projects', href: '#projects' },
      { label: 'Join Us', href: '#join' }
    ],
    focusAreaLinks: [
      { label: 'Artificial Intelligence', href: '#focus-areas' },
      { label: 'Internet of Things', href: '#focus-areas' },
      { label: 'Edge Computing', href: '#focus-areas' },
      { label: 'Smart Cities', href: '#focus-areas' }
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com' },
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Discord', url: 'https://discord.com' }
    ],
    copyright: '© 2026 YORK AIoT. All rights reserved.',
    credit: 'Built with ❤️ by YORK AIoT'
  }
};

const STORAGE_KEY = 'aiot_site_content';
const FIRESTORE_DOC = doc(db, 'site', 'content');

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  // Loading and connection states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Saved content (from Firestore)
  const [savedContent, setSavedContent] = useState(() => {
    // Load cached content from localStorage for instant display
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultContent, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load cached content:', e);
    }
    return defaultContent;
  });

  // Working content (for admin editing)
  const [content, setContent] = useState(savedContent);

  // Subscribe to Firestore real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      FIRESTORE_DOC,
      (snapshot) => {
        setIsConnected(true);
        setLoading(false);
        setError(null);

        if (snapshot.exists()) {
          const data = snapshot.data();
          const merged = { ...defaultContent, ...data };
          setSavedContent(merged);
          setContent(merged);
          // Cache in localStorage
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.error('Failed to cache content:', e);
          }
        } else {
          // Document doesn't exist - create with defaults (first-time setup)
          setDoc(FIRESTORE_DOC, defaultContent)
            .then(() => {
              setSavedContent(defaultContent);
              setContent(defaultContent);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent));
            })
            .catch((err) => {
              console.error('Failed to initialize Firestore document:', err);
              setError('Failed to initialize content');
            });
        }
      },
      (err) => {
        console.error('Firestore connection error:', err);
        setIsConnected(false);
        setError('Connection lost — changes will sync when reconnected');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Alias for backward compatibility
  const siteContent = content;

  // Save working content to Firestore
  const saveContent = useCallback(async () => {
    try {
      await setDoc(FIRESTORE_DOC, content);
      setSavedContent(content);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      return { success: true };
    } catch (e) {
      console.error('Failed to save content to Firestore:', e);
      return { success: false, error: e.message };
    }
  }, [content]);

  // Discard working changes and revert to last saved
  const discardChanges = useCallback(() => {
    setContent(savedContent);
  }, [savedContent]);

  // Update a single section locally (call saveContent to persist)
  const updateSection = useCallback((section, newData) => {
    setContent((prev) => ({
      ...prev,
      [section]: newData
    }));
  }, []);

  // Reset a section to defaults and save to Firestore
  const resetSection = useCallback(async (section) => {
    try {
      await updateDoc(FIRESTORE_DOC, { [section]: defaultContent[section] });
      return { success: true };
    } catch (e) {
      console.error('Failed to reset section:', e);
      return { success: false, error: e.message };
    }
  }, []);

  // Reset all content to defaults and save to Firestore
  const resetAll = useCallback(async () => {
    try {
      await setDoc(FIRESTORE_DOC, defaultContent);
      return { success: true };
    } catch (e) {
      console.error('Failed to reset all content:', e);
      return { success: false, error: e.message };
    }
  }, []);

  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(content, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aiot-content-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content]);

  const importJSON = useCallback(async (json) => {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      const merged = { ...defaultContent, ...parsed };
      await setDoc(FIRESTORE_DOC, merged);
      return { success: true };
    } catch (e) {
      console.error('Failed to import JSON:', e);
      return { success: false, error: e.message };
    }
  }, []);

  const getDefaults = useCallback(() => defaultContent, []);

  return (
    <SiteContentContext.Provider
      value={{
        content,
        siteContent,
        updateSection,
        resetSection,
        resetAll,
        exportJSON,
        importJSON,
        saveContent,
        discardChanges,
        getDefaults,
        loading,
        error,
        isConnected
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};

export default SiteContentContext;
