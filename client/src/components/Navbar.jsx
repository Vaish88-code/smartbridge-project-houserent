import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaBuilding, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaList, FaCalendarCheck, FaUser, FaSignOutAlt, FaUserShield, FaPlus } from 'react-icons/fa';
import { HiHomeModern } from 'react-icons/hi2';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg hh-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <HiHomeModern className="brand-icon" />
          <span>HouseHunt</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <FaHome className="me-1" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/properties">
                <FaBuilding className="me-1" /> Properties
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                <FaInfoCircle className="me-1" /> About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                <FaEnvelope className="me-1" /> Contact
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav align-items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">
                      <FaUserShield className="me-1" /> Admin
                    </NavLink>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/dashboard">
                        <FaTachometerAlt className="me-1" /> Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/add-property">
                        <FaPlus className="me-1" /> Add Property
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/my-bookings">
                        <FaCalendarCheck className="me-1" /> My Bookings
                      </NavLink>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    <FaUser className="me-1" /> {user?.name?.split(' ')[0]}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                    style={{ cursor: 'pointer' }}
                  >
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-btn-login" to="/login">
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-btn-register" to="/register">
                    <FaUserPlus className="me-1" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
