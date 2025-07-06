import React, { useState, useEffect } from 'react';
import { BookingService, type BookingDetails } from '../../services/supabase';

const BookingsList: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let data: BookingDetails[];
      
      if (filter === 'all') {
        data = await BookingService.getAllBookings();
      } else {
        data = await BookingService.getBookingsByStatus(filter);
      }
      
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await BookingService.updateBookingStatus(id, status);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {bookings.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No bookings found
            </li>
          ) : (
            bookings.map((booking) => (
              <li key={booking.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.id}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {booking.customer_email && (
                            <>
                              <span className="font-medium">{booking.customer_name || 'Unknown'}</span>
                              <span className="ml-2">({booking.customer_email})</span>
                            </>
                          )}
                          {!booking.customer_email && (
                            <span className="text-gray-400">No customer info</span>
                          )}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {formatDate(booking.timestamp)} • {formatCurrency(booking.total_amount)}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {booking.items.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {item.type === 'studio_session' && `Studio: ${item.data.studio_name}`}
                            {item.type === 'service' && `Service: ${item.data.service_name}`}
                            {item.type === 'beat' && `Beat: ${item.data.beat_title}`}
                            <span className="ml-1 text-gray-600">
                              {formatCurrency(item.price)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Studio session details */}
                    {booking.has_studio_session && (
                      <div className="mt-2 text-sm text-gray-600">
                        {booking.items
                          .filter(item => item.type === 'studio_session')
                          .map((item, index) => (
                            <div key={index}>
                              📅 {item.data.date} at {item.data.time_slot} ({item.data.session_type})
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>

                  {/* Status update buttons */}
                  <div className="ml-4 flex-shrink-0 flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookingsList;