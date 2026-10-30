import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiHomeModern } from 'react-icons/hi2';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await register(formData);
      toast.success(data.message || 'Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="text-center mb-3">
            <HiHomeModern style={{ fontSize: '2.5rem', color: 'var(--primary-blue)' }} />
          </div>
          <h2 className="text-center">Create Account</h2>
          <p className="auth-subtitle text-center">
            Join HouseHunt to find your perfect rental home
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><FaUser className="me-1" /> Full Name</label>
              <input
                type="text" className="form-control" name="name"
                placeholder="Enter your full name"
                value={formData.name} onChange={handleChange} required id="register-name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><FaEnvelope className="me-1" /> Email Address</label>
              <input
                type="email" className="form-control" name="email"
                placeholder="Enter your email"
                value={formData.email} onChange={handleChange} required id="register-email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><FaPhone className="me-1" /> Phone Number</label>
              <input
                type="tel" className="form-control" name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone} onChange={handleChange} required id="register-phone"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><FaLock className="me-1" /> Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'} className="form-control" name="password"
                  placeholder="Min 8 characters"
                  value={formData.password} onChange={handleChange} required id="register-password"
                />
                <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                  onClick={() => setShowPassword(!showPassword)} style={{ color: 'var(--gray-400)' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label"><FaLock className="me-1" /> Confirm Password</label>
              <input
                type="password" className="form-control" name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword} onChange={handleChange} required id="register-confirm"
              />
            </div>

            <button type="submit" className="btn btn-auth mb-3" disabled={loading} id="register-submit">
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
              ) : (
                <><FaUserPlus className="me-2" /> Register</>
              )}
            </button>

            <p className="text-center mb-0" style={{ color: 'var(--gray-500)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 600 }}>Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
