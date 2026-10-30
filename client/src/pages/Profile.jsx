import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await userAPI.updateProfile(profileData);
      toast.success(data.message || 'Profile updated!');
      updateUser(data.user);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters'); return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    setPasswordLoading(true);
    try {
      const { data } = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success(data.message || 'Password changed!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Profile Info */}
            <div className="profile-card mb-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="profile-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, marginBottom: 0 }}>{user?.name}</h3>
                  <p className="text-muted mb-0">{user?.email}</p>
                  <span className={`status-badge ${user?.role === 'admin' ? 'status-approved' : 'status-pending'} mt-1`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                <FaUser className="me-2 text-primary" /> Edit Profile
              </h5>
              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input type="text" className="form-control" value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold"><FaEnvelope className="me-1" /> Email</label>
                    <input type="email" className="form-control" value={user?.email} disabled
                      style={{ background: 'var(--gray-100)' }} />
                    <small className="text-muted">Email cannot be changed</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold"><FaPhone className="me-1" /> Phone</label>
                    <input type="tel" className="form-control" value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-submit" disabled={profileLoading}>
                      {profileLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> :
                        <><FaSave className="me-2" /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="profile-card">
              <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                <FaLock className="me-2 text-primary" /> Change Password
              </h5>
              <form onSubmit={handlePasswordSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Current Password</label>
                    <input type="password" className="form-control" value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">New Password</label>
                    <input type="password" className="form-control" placeholder="Min 8 characters"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm New Password</label>
                    <input type="password" className="form-control"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-submit" disabled={passwordLoading}>
                      {passwordLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Changing...</> :
                        <><FaLock className="me-2" /> Change Password</>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
