import React from 'react';
import CalendarSync from '../components/CalendarSync';

const Admin: React.FC = () => {
  return (
    <div className="admin-page min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          {/* Calendar Sync Section */}
          <div className="mb-8">
            <CalendarSync />
          </div>
          
          {/* Additional Admin Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Availability Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Availability Overview</h2>
              <p className="text-gray-600 mb-4">
                Quick overview of studio availability for the next 7 days.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday (Closed)</span>
                  <span className="text-red-600">❌</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday - Sunday</span>
                  <span className="text-green-600">✅</span>
                </div>
              </div>
            </div>
            
            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
              <p className="text-gray-600 mb-4">
                Latest studio session bookings and their status.
              </p>
              <div className="text-sm text-gray-500">
                Check the bookings directory for detailed booking information.
              </div>
            </div>
            
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">System Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Backend Server</span>
                  <span className="text-green-600">✅ Running</span>
                </div>
                <div className="flex justify-between">
                  <span>Database</span>
                  <span className="text-green-600">✅ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Calendar API</span>
                  <span className="text-green-600">✅ Ready</span>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View All Bookings
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Manual Availability Override
                </button>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Export Booking Data
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
