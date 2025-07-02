import React, { useState, useEffect } from 'react';
import GoogleCalendarService from '../services/googleCalendar';

interface SyncStatus {
  last_sync_time: string | null;
  last_sync_status: string;
  records_in_db: number;
  latest_date: string | null;
}

const CalendarSync: React.FC = () => {
  const [calendarService] = useState(() => new GoogleCalendarService());
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/sync-status`);
      const status = await response.json();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      // Sync calendar for the next 30 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const result = await calendarService.syncCalendarToBackend(startDate, endDate);

      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        await fetchSyncStatus(); // Refresh status
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sync failed');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'never': return 'text-gray-500';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="calendar-sync-container p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Google Calendar Sync</h2>
      
      {/* Sync Status */}
      <div className="sync-status mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Sync Status</h3>
        {syncStatus ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Last Sync:</span>
              <p className={getStatusColor(syncStatus.last_sync_status)}>
                {formatDate(syncStatus.last_sync_time)}
              </p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <p className={getStatusColor(syncStatus.last_sync_status)}>
                {syncStatus.last_sync_status}
              </p>
            </div>
            <div>
              <span className="font-medium">Records in Database:</span>
              <p>{syncStatus.records_in_db}</p>
            </div>
            <div>
              <span className="font-medium">Latest Date:</span>
              <p>{syncStatus.latest_date || 'None'}</p>
            </div>
          </div>
        ) : (
          <p>Loading status...</p>
        )}
      </div>

      {/* Sync Controls */}
      <div className="sync-controls mb-4">
        <button
          onClick={handleSync}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Syncing...' : 'Sync Calendar Now'}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`message p-4 rounded-lg ${
          messageType === 'success' ? 'bg-green-100 text-green-800' :
          messageType === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="instructions mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Create events in the separate Google Calendars for each studio:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Studio C Calendar:</strong> Add events for Studio C availability</li>
              <li><strong>Studio D Calendar:</strong> Add events for Studio D availability</li>
            </ul>
          </li>
          <li>Set event times to match your time slots:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Morning: 10:30 AM - 2:30 PM</li>
              <li>Afternoon: 3:00 PM - 7:00 PM</li>
              <li>Evening: 7:30 PM - 11:30 PM</li>
            </ul>
          </li>
          <li>Event titles can be anything (e.g., "Available", "Open", "Recording Session")</li>
          <li>Click "Sync Calendar Now" to update availability from both calendars</li>
          <li>The system will automatically apply default rules (closed Mondays) for dates without calendar events</li>
        </ol>
      </div>

      {/* Default Rules */}
      <div className="default-rules mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Default Availability Rules</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Closed on Mondays</li>
          <li>Open Tuesday - Sunday (all time slots available)</li>
          <li>Calendar events override default rules</li>
          <li>Manual overrides take precedence over calendar events</li>
        </ul>
      </div>
    </div>
  );
};

export default CalendarSync;
