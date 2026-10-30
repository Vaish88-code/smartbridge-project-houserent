import { Link } from 'react-router-dom';
import { HiHomeModern } from 'react-icons/hi2';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="hh-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="footer-brand">
              <HiHomeModern className="me-2" />
              <span>HouseHunt</span>
            </Link>
            <p>
              Your trusted partner in finding the perfect rental home. 
              We connect tenants with property owners seamlessly, making 
              the house hunting experience simple and enjoyable.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5>For Users</h5>
            <ul className="footer-links">
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/properties">Browse Properties</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5>Contact Info</h5>
            <div className="footer-contact-item">
              <FaMapMarkerAlt />
              <span>Pune, Maharashtra, India</span>
            </div>
            <div className="footer-contact-item">
              <FaEnvelope />
              <span>support@househunt.com</span>
            </div>
            <div className="footer-contact-item">
              <FaPhone />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="mb-0">
            © {new Date().getFullYear()} HouseHunt. All rights reserved. | 
            Built with ❤️ for SmartBridge MERN Stack Internship
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
