import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import {
  FaUserShield, FaUsers, FaBuilding, FaCalendarCheck, FaClock, FaCheckCircle,
  FaTimesCircle, FaEye, FaCheck, FaTimes, FaTrash, FaBan, FaUserCheck, FaChartBar
} from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [propFilter, setPropFilter] = useState('');
  const [bookingFilter, setBookingFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, propsRes, bookingsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getProperties(),
        adminAPI.getBookings(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setProperties(propsRes.data.properties || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserStatus(id);
      toast.success(data.message);
      setUsers(users.map((u) => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (error) {
      toast.error(error.message || 'Failed');
    }
  };

  const handleApprove = async (id) => {
    try {
      const { data } = await adminAPI.approveProperty(id);
      toast.success(data.message);
      setProperties(properties.map((p) => p._id === id ? { ...p, approvalStatus: 'approved' } : p));
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this property?')) return;
    try {
      const { data } = await adminAPI.rejectProperty(id);
      toast.success(data.message);
      setProperties(properties.map((p) => p._id === id ? { ...p, approvalStatus: 'rejected' } : p));
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed');
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this property permanently?')) return;
    try {
      const { data } = await adminAPI.removeProperty(id);
      toast.success(data.message);
      setProperties(properties.filter((p) => p._id !== id));
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed');
    }
  };

  const filteredProperties = propFilter ? properties.filter((p) => p.approvalStatus === propFilter) : properties;
  const filteredBookings = bookingFilter ? bookings.filter((b) => b.status === bookingFilter) : bookings;

  if (loading) {
    return <div className="loading-container" style={{ minHeight: '60vh' }}><div className="spinner-custom"></div><p>Loading admin dashboard...</p></div>;
  }

  const propertyChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [stats?.pendingApprovals || 0, stats?.approvedProperties || 0, stats?.rejectedProperties || 0],
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const bookingChartData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    datasets: [{
      label: 'Bookings',
      data: [stats?.pendingBookings || 0, stats?.approvedBookings || 0, stats?.rejectedBookings || 0, stats?.cancelledBookings || 0],
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#94a3b8'],
      borderRadius: 6,
    }],
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { key: 'users', label: 'Users', icon: <FaUsers /> },
    { key: 'properties', label: 'Properties', icon: <FaBuilding /> },
    { key: 'bookings', label: 'Bookings', icon: <FaCalendarCheck /> },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="dashboard-title"><FaUserShield className="me-2 text-primary" /> Admin Dashboard</h1>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.key} className={`btn ${activeTab === tab.key ? 'btn-submit' : 'btn-action'}`}
              onClick={() => setActiveTab(tab.key)}>
              {tab.icon} <span className="ms-1">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            <div className="row g-3 mb-4">
              {[
                { icon: <FaUsers />, value: stats?.totalUsers, label: 'Total Users', bg: 'bg-gradient-blue' },
                { icon: <FaBuilding />, value: stats?.totalProperties, label: 'Total Properties', bg: 'bg-gradient-purple' },
                { icon: <FaClock />, value: stats?.pendingApprovals, label: 'Pending Approvals', bg: 'bg-gradient-orange' },
                { icon: <FaCheckCircle />, value: stats?.approvedProperties, label: 'Approved', bg: 'bg-gradient-green' },
                { icon: <FaCalendarCheck />, value: stats?.totalBookings, label: 'Total Bookings', bg: 'bg-gradient-blue' },
              ].map((stat, idx) => (
                <div className="col-6 col-lg" key={idx}>
                  <div className="stat-card">
                    <div className={`stat-icon ${stat.bg}`}>{stat.icon}</div>
                    <div className="stat-value">{stat.value || 0}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="dashboard-section">
                  <h4>Properties by Status</h4>
                  <div style={{ maxWidth: 300, margin: '0 auto' }}>
                    <Doughnut data={propertyChartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="dashboard-section">
                  <h4>Bookings by Status</h4>
                  <Bar data={bookingChartData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="dashboard-section">
            <h4><FaUsers className="text-primary" /> User Management ({users.length})</h4>
            <div className="table-responsive">
              <table className="table hh-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td><span className={`status-badge ${u.isActive ? 'status-approved' : 'status-rejected'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button className={`btn ${u.isActive ? 'btn-danger-outline' : 'btn-approve'} btn-sm`}
                          onClick={() => handleToggleUser(u._id)}>
                          {u.isActive ? <><FaBan className="me-1" /> Disable</> : <><FaUserCheck className="me-1" /> Enable</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="dashboard-section">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h4 className="mb-0"><FaBuilding className="text-primary" /> Property Management</h4>
              <div className="d-flex gap-2">
                {['', 'pending', 'approved', 'rejected'].map((f) => (
                  <button key={f} className={`btn ${propFilter === f ? 'btn-submit' : 'btn-action'} btn-sm`}
                    onClick={() => setPropFilter(f)}>
                    {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'} ({f ? properties.filter((p) => p.approvalStatus === f).length : properties.length})
                  </button>
                ))}
              </div>
            </div>
            <div className="table-responsive">
              <table className="table hh-table">
                <thead>
                  <tr><th>Property</th><th>Owner</th><th>City</th><th>Rent</th><th>Type</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredProperties.map((p) => (
                    <tr key={p._id}>
                      <td className="fw-semibold">{p.title}</td>
                      <td>{p.owner?.name}<br /><small className="text-muted">{p.owner?.email}</small></td>
                      <td>{p.city}</td>
                      <td>₹{p.rent?.toLocaleString('en-IN')}</td>
                      <td>{p.propertyType}</td>
                      <td><span className={`status-badge status-${p.approvalStatus}`}>{p.approvalStatus}</span></td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {p.approvalStatus === 'pending' && (
                            <>
                              <button className="btn btn-approve btn-sm" onClick={() => handleApprove(p._id)}><FaCheck /></button>
                              <button className="btn btn-reject btn-sm" onClick={() => handleReject(p._id)}><FaTimes /></button>
                            </>
                          )}
                          {p.approvalStatus === 'rejected' && (
                            <button className="btn btn-approve btn-sm" onClick={() => handleApprove(p._id)}><FaCheck /> Approve</button>
                          )}
                          <button className="btn btn-danger-outline btn-sm" onClick={() => handleRemove(p._id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="dashboard-section">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h4 className="mb-0"><FaCalendarCheck className="text-primary" /> Booking Management</h4>
              <div className="d-flex gap-2">
                {['', 'pending', 'approved', 'rejected', 'cancelled'].map((f) => (
                  <button key={f} className={`btn ${bookingFilter === f ? 'btn-submit' : 'btn-action'} btn-sm`}
                    onClick={() => setBookingFilter(f)}>
                    {f ? f.charAt(0).toUpperCase() + f.slice(1) : 'All'}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-responsive">
              <table className="table hh-table">
                <thead>
                  <tr><th>Property</th><th>Requester</th><th>Move-in</th><th>Status</th><th>Requested On</th></tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-semibold">{b.property?.title || 'N/A'}</td>
                      <td>{b.user?.name}<br /><small className="text-muted">{b.user?.email}</small></td>
                      <td>{new Date(b.moveInDate).toLocaleDateString('en-IN')}</td>
                      <td><span className={`status-badge status-${b.status}`}>{b.status}</span></td>
                      <td>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
