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
    updated[index] = { ...updated[index], [field]: value };
    updateSection('events', updated);
    setHasUnsavedChanges(true);
  };

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: 'New Event',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 12:00 PM',
      location: 'Location TBD',
      type: 'workshop',
      description: 'Event description...',
      status: 'upcoming'
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

  const formatDatePreview = (dateStr) => {
    if (!dateStr) return 'No date set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const typeOptions = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'competition', label: 'Competition' },
    { value: 'webinar', label: 'Webinar' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
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
                <span className="date-text">{formatDatePreview(event.date)}</span>
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
                  label="Date"
                  type="date"
                  value={event.date || ''}
                  onChange={(value) => updateEvent(index, 'date', value)}
                  required
                />
                <TextInput
                  label="Time"
                  value={event.time || ''}
                  onChange={(value) => updateEvent(index, 'time', value)}
                  placeholder="10:00 AM - 12:00 PM"
                />
              </div>

              <TextInput
                label="Location"
                value={event.location || ''}
                onChange={(value) => updateEvent(index, 'location', value)}
                placeholder="Venue or Online"
              />

              <div className="input-grid-2">
                <SelectInput
                  label="Event Type"
                  value={event.type || 'workshop'}
                  onChange={(value) => updateEvent(index, 'type', value)}
                  options={typeOptions}
                />
                <SelectInput
                  label="Status"
                  value={event.status || 'upcoming'}
                  onChange={(value) => updateEvent(index, 'status', value)}
                  options={statusOptions}
                />
              </div>

              <TextArea
                label="Description"
                value={event.description || ''}
                onChange={(value) => updateEvent(index, 'description', value)}
                placeholder="Brief description of the event..."
                rows={3}
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
          title="Delete Event"
          message={`Are you sure you want to delete "${events[deleteTarget]?.title}"?`}
          confirmText="Delete"
          variant="danger"
          onConfirm={() => deleteEvent(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
