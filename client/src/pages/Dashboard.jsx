import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { propertyAPI, bookingAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import {
  FaTachometerAlt, FaBuilding, FaClock, FaCheckCircle, FaCalendarCheck,
  FaTrash, FaEdit, FaEye, FaPlus, FaTimesCircle, FaCheck, FaTimes, FaInbox
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propRes, bookRes, recvRes] = await Promise.all([
        propertyAPI.getMyProperties(),
        bookingAPI.getMyBookings(),
        bookingAPI.getReceived(),
      ]);
      setMyProperties(propRes.data.properties || []);
      setMyBookings(bookRes.data.bookings || []);
      setReceivedBookings(recvRes.data.bookings || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    try {
      const { data } = await propertyAPI.delete(id);
      toast.success(data.message);
      setMyProperties(myProperties.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const handleBookingAction = async (bookingId, status) => {
    const action = status === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this booking request?`)) return;
    try {
      const { data } = await bookingAPI.updateStatus(bookingId, status);
      toast.success(data.message);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.message || `Failed to ${action} booking`);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      const { data } = await bookingAPI.updateStatus(bookingId, 'cancelled');
      toast.success(data.message);
      setMyBookings(myBookings.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const pendingProps = myProperties.filter((p) => p.approvalStatus === 'pending').length;
  const approvedProps = myProperties.filter((p) => p.approvalStatus === 'approved').length;

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner-custom"></div><p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 className="dashboard-title mb-0">
            <FaTachometerAlt className="me-2 text-primary" />
            Welcome, {user?.name?.split(' ')[0]}!
          </h1>
          <Link to="/add-property" className="btn btn-submit">
            <FaPlus className="me-2" /> Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon bg-gradient-blue"><FaBuilding /></div>
              <div className="stat-value">{myProperties.length}</div>
              <div className="stat-label">My Properties</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon bg-gradient-orange"><FaClock /></div>
              <div className="stat-value">{pendingProps}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon bg-gradient-green"><FaCheckCircle /></div>
              <div className="stat-value">{approvedProps}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="stat-icon bg-gradient-purple"><FaCalendarCheck /></div>
              <div className="stat-value">{myBookings.length}</div>
              <div className="stat-label">My Bookings</div>
            </div>
          </div>
        </div>

        {/* My Properties */}
        <div className="dashboard-section">
          <h4><FaBuilding className="text-primary" /> My Properties</h4>
          {myProperties.length > 0 ? (
            <div className="row g-3">
              {myProperties.map((property) => (
                <div className="col-md-6 col-xl-4" key={property._id}>
                  <div className="position-relative">
                    <PropertyCard property={property} showStatus={true} />
                    <div className="d-flex gap-2 mt-2 justify-content-center">
                      <Link to={`/properties/${property._id}`} className="btn btn-action btn-sm">
                        <FaEye className="me-1" /> View
                      </Link>
                      <Link to={`/edit-property/${property._id}`} className="btn btn-action btn-sm">
                        <FaEdit className="me-1" /> Edit
                      </Link>
                      <button className="btn btn-danger-outline btn-sm" onClick={() => handleDeleteProperty(property._id)}>
                        <FaTrash className="me-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaBuilding /><h5>No properties listed yet</h5>
              <p>Start by adding your first rental property</p>
              <Link to="/add-property" className="btn btn-submit mt-2"><FaPlus className="me-2" /> Add Property</Link>
            </div>
          )}
        </div>

        {/* Received Booking Requests */}
        <div className="dashboard-section">
          <h4><FaInbox className="text-primary" /> Booking Requests Received</h4>
          {receivedBookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table hh-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Property</th>
                    <th>Move-in Date</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <strong>{booking.user?.name}</strong>
                        <br /><small className="text-muted">{booking.user?.email}</small>
                        <br /><small className="text-muted">{booking.user?.phone}</small>
                      </td>
                      <td>{booking.property?.title}</td>
                      <td>{new Date(booking.moveInDate).toLocaleDateString('en-IN')}</td>
                      <td><small>{booking.message || '-'}</small></td>
                      <td><span className={`status-badge status-${booking.status}`}>{booking.status}</span></td>
                      <td>
                        {booking.status === 'pending' && (
                          <div className="d-flex gap-1">
                            <button className="btn btn-approve btn-sm" onClick={() => handleBookingAction(booking._id, 'approved')}>
                              <FaCheck /> Approve
                            </button>
                            <button className="btn btn-reject btn-sm" onClick={() => handleBookingAction(booking._id, 'rejected')}>
                              <FaTimes /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FaInbox /><h5>No booking requests yet</h5>
              <p>You&apos;ll see booking requests here when someone shows interest in your properties</p>
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div className="dashboard-section">
          <h4><FaCalendarCheck className="text-primary" /> My Booking Requests</h4>
          {myBookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table hh-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Move-in Date</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <Link to={`/properties/${booking.property?._id}`} className="fw-semibold">
                          {booking.property?.title}
                        </Link>
                        <br /><small className="text-muted">{booking.property?.city}</small>
                      </td>
                      <td>{new Date(booking.moveInDate).toLocaleDateString('en-IN')}</td>
                      <td><span className={`status-badge status-${booking.status}`}>{booking.status}</span></td>
                      <td>
                        {booking.property?.owner?.name || '-'}
                        {booking.status === 'approved' && booking.property?.owner?.phone && (
                          <><br /><small className="text-muted">{booking.property.owner.phone}</small></>
                        )}
                      </td>
                      <td>
                        {(booking.status === 'pending' || booking.status === 'approved') && (
                          <button className="btn btn-danger-outline btn-sm" onClick={() => handleCancelBooking(booking._id)}>
                            <FaTimesCircle className="me-1" /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FaCalendarCheck /><h5>No bookings yet</h5>
              <p>Browse properties and submit booking requests</p>
              <Link to="/properties" className="btn btn-submit mt-2">Browse Properties</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
