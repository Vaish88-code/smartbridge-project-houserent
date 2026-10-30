import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiHomeModern } from 'react-icons/hi2';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await login(formData);
      toast.success(data.message || 'Login successful!');
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
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
          <h2 className="text-center">Welcome Back</h2>
          <p className="auth-subtitle text-center">
            Log in to access your HouseHunt account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <FaEnvelope className="me-1" /> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                id="login-email"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                <FaLock className="me-1" /> Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  id="login-password"
                />
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: 'var(--gray-400)' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-auth mb-3"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="me-2" /> Login
                </>
              )}
            </button>

            <p className="text-center mb-0" style={{ color: 'var(--gray-500)' }}>
              Don&apos;t have an account?{' '}
              <Link to="/register" style={{ fontWeight: 600 }}>
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
