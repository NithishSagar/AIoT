import { useSiteContent } from '../../../context/SiteContentContext';
import { useAdmin } from '../../context/AdminContext';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import SelectInput from '../shared/SelectInput';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import './editors.css';

export default function EventsEditor() {
  const { content, updateSection } = useSiteContent();
  const { setHasUnsavedChanges } = useAdmin();
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const events = content.events || [];

  const updateEvent = (index, field, value) => {
    const updated = [...events];
    if (field === 'day' || field === 'month') {
      updated[index] = { 
        ...updated[index], 
        date: { ...updated[index].date, [field]: value } 
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    updateSection('events', updated);
    setHasUnsavedChanges(true);
  };

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: 'New Event',
      date: { day: '01', month: 'JAN' },
      type: 'Workshop',
      description: 'Event description...',
      link: '#'
    };
    updateSection('events', [...events, newEvent]);
    setHasUnsavedChanges(true);
  };

  const deleteEvent = (index) => {
    const updated = events.filter((_, i) => i !== index);
    updateSection('events', updated);
    setHasUnsavedChanges(true);
    setDeleteTarget(null);
  };

  const moveEvent = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= events.length) return;
    
    const updated = [...events];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateSection('events', updated);
    setHasUnsavedChanges(true);
  };

  const typeOptions = [
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Hackathon', label: 'Hackathon' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Meetup', label: 'Meetup' },
    { value: 'Competition', label: 'Competition' },
    { value: 'Webinar', label: 'Webinar' }
  ];

  const monthOptions = [
    { value: 'JAN', label: 'JAN' },
    { value: 'FEB', label: 'FEB' },
    { value: 'MAR', label: 'MAR' },
    { value: 'APR', label: 'APR' },
    { value: 'MAY', label: 'MAY' },
    { value: 'JUN', label: 'JUN' },
    { value: 'JUL', label: 'JUL' },
    { value: 'AUG', label: 'AUG' },
    { value: 'SEP', label: 'SEP' },
    { value: 'OCT', label: 'OCT' },
    { value: 'NOV', label: 'NOV' },
    { value: 'DEC', label: 'DEC' }
  ];

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <h2 className="editor-title">Events</h2>
        <p className="editor-description">
          Manage workshops, hackathons, and other events organized by the society.
        </p>
      </div>

      <div className="editor-items">
        {events.map((event, index) => (
          <div key={event.id || index} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-title">
                {event.title || 'Untitled Event'}
              </span>
              <div className="editor-card-actions">
                <button 
                  className="card-action-btn"
                  onClick={() => moveEvent(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button 
                  className="card-action-btn"
                  onClick={() => moveEvent(index, 1)}
                  disabled={index === events.length - 1}
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
              <div className="event-date-preview">
                <span className="date-icon">📅</span>
                <span className="date-text">{event.date?.day || '--'} {event.date?.month || '---'}</span>
              </div>

              <TextInput
                label="Event Title"
                value={event.title || ''}
                onChange={(value) => updateEvent(index, 'title', value)}
                placeholder="Event name"
                required
              />

              <div className="input-grid-2">
                <TextInput
                  label="Day"
                  value={event.date?.day || ''}
                  onChange={(value) => updateEvent(index, 'day', value)}
                  placeholder="15"
                  required
                />
                <SelectInput
                  label="Month"
                  value={event.date?.month || 'JAN'}
                  onChange={(value) => updateEvent(index, 'month', value)}
                  options={monthOptions}
                />
              </div>

              <SelectInput
                label="Event Type"
                value={event.type || 'Workshop'}
                onChange={(value) => updateEvent(index, 'type', value)}
                options={typeOptions}
              />

              <TextArea
                label="Description"
                value={event.description || ''}
                onChange={(value) => updateEvent(index, 'description', value)}
                placeholder="Brief description of the event..."
                rows={3}
              />

              <TextInput
                label="Registration Link"
                value={event.link || ''}
                onChange={(value) => updateEvent(index, 'link', value)}
                placeholder="https://forms.google.com/..."
              />
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p className="empty-state-text">No events yet. Add your first event!</p>
        </div>
      )}

      <button className="add-btn" onClick={addEvent}>
        <span>+</span> Add Event
      </button>

      {deleteTarget !== null && (
        <ConfirmModal
          isOpen={true}
          title="Delete Event"
          message={`Are you sure you want to delete "${events[deleteTarget]?.title}"?`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={() => deleteEvent(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
