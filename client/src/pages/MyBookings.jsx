import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingAPI } from '../services/api';
import { FaCalendarCheck, FaTimesCircle } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      if (data.success) setBookings(data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const { data } = await bookingAPI.updateStatus(id, 'cancelled');
      toast.success(data.message);
      setBookings(bookings.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return <div className="loading-container" style={{ minHeight: '60vh' }}><div className="spinner-custom"></div><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="dashboard-title"><FaCalendarCheck className="me-2 text-primary" /> My Bookings</h1>

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((s) => (
            <button key={s} className={`btn ${filter === s ? 'btn-submit' : 'btn-action'} btn-sm`}
              onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length})
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="dashboard-section">
            <div className="table-responsive">
              <table className="table hh-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>City</th>
                    <th>Rent</th>
                    <th>Move-in Date</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Requested On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <Link to={`/properties/${booking.property?._id}`} className="fw-semibold">
                          {booking.property?.title || 'N/A'}
                        </Link>
                      </td>
                      <td>{booking.property?.city || '-'}</td>
                      <td>₹{booking.property?.rent?.toLocaleString('en-IN')}</td>
                      <td>{new Date(booking.moveInDate).toLocaleDateString('en-IN')}</td>
                      <td><span className={`status-badge status-${booking.status}`}>{booking.status}</span></td>
                      <td>
                        {booking.property?.owner?.name || '-'}
                        {booking.status === 'approved' && (
                          <><br /><small>{booking.property?.owner?.email}</small><br /><small>{booking.property?.owner?.phone}</small></>
                        )}
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        {(booking.status === 'pending' || booking.status === 'approved') && (
                          <button className="btn btn-danger-outline btn-sm" onClick={() => handleCancel(booking._id)}>
                            <FaTimesCircle className="me-1" /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <FaCalendarCheck /><h5>No bookings found</h5>
            <p>{filter !== 'all' ? `No ${filter} bookings.` : 'Browse properties and submit booking requests.'}</p>
            <Link to="/properties" className="btn btn-submit mt-2">Browse Properties</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
