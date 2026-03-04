import { useState } from 'react';
import './AudienceTabs.css';

const audienceData = {
  students: {
    id: 'students',
    title: 'Students',
    features: [
      {
        icon: '📚',
        title: 'Learn by Doing',
        description: 'Hands-on workshops and projects to build real-world skills in AI and IoT technologies.'
      },
      {
        icon: '🤝',
        title: 'Mentorship Network',
        description: 'Connect with industry professionals and researchers who guide your learning journey.'
      },
      {
        icon: '🏆',
        title: 'Competitions & Hackathons',
        description: 'Participate in challenges to test your skills and win exciting prizes.'
      }
    ]
  },
  researchers: {
    id: 'researchers',
    title: 'Researchers',
    features: [
      {
        icon: '🔬',
        title: 'Collaborative Research',
        description: 'Join interdisciplinary research groups working on cutting-edge AIoT problems.'
      },
      {
        icon: '📄',
        title: 'Publication Support',
        description: 'Resources and peer review to help you publish in top conferences and journals.'
      },
      {
        icon: '💡',
        title: 'Funding Opportunities',
        description: 'Access to grants, sponsorships, and resources to fuel your research projects.'
      }
    ]
  },
  professionals: {
    id: 'professionals',
    title: 'Professionals',
    features: [
      {
        icon: '🌐',
        title: 'Industry Networking',
        description: 'Connect with peers and potential collaborators from leading tech companies.'
      },
      {
        icon: '📈',
        title: 'Skill Advancement',
        description: 'Stay ahead with workshops on the latest tools, frameworks, and methodologies.'
      },
      {
        icon: '🎤',
        title: 'Speaking Opportunities',
        description: 'Share your expertise at our events and build your professional brand.'
      }
    ]
  }
};

const tabs = [
  { id: 'students', label: 'Students' },
  { id: 'researchers', label: 'Researchers' },
  { id: 'professionals', label: 'Professionals' }
];

const AudienceTabs = () => {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <section className="audience-tabs section">
      <div className="container">
        <h2 className="section-title">
          Built For <span>Everyone</span>
        </h2>

        <div className="tabs-header">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <div
              className="tab-indicator"
              style={{
                transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * 100}%)`
              }}
            />
          </div>
        </div>

        <div className="tab-content">
          {Object.values(audienceData).map((audience) => (
            <div
              key={audience.id}
              className={`tab-panel ${activeTab === audience.id ? 'active' : ''}`}
            >
              <div className="features-grid">
                {audience.features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <span className="feature-icon">{feature.icon}</span>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceTabs;
