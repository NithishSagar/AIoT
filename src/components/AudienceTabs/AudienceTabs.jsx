import { useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import './AudienceTabs.css';

const AudienceTabs = () => {
  const { content } = useSiteContent();
  const audienceData = content.audienceTabs || {};
  const [activeTab, setActiveTab] = useState('students');

  const tabs = Object.keys(audienceData).map((key) => ({
    id: key,
    label: audienceData[key]?.title || key
  }));

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
                {audience.features?.map((feature, index) => (
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
