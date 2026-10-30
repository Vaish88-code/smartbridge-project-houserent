import { FaUsers, FaShieldAlt, FaSearchLocation, FaHandshake, FaBullseye, FaLightbulb, FaRocket, FaHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero text-center">
          <h1 style={{ fontFamily: 'var(--font-primary)', fontWeight: 800, fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>
            About HouseHunt
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: 600, margin: '1rem auto 0', position: 'relative', zIndex: 1 }}>
            We're on a mission to simplify the rental property search experience across India.
            HouseHunt connects tenants with property owners through a secure, transparent, and user-friendly platform.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="feature-card text-start">
              <div className="feature-icon mb-3" style={{ margin: 0 }}><FaBullseye /></div>
              <h4 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>Our Mission</h4>
              <p className="text-muted">
                To make finding and renting homes as simple as possible. We believe everyone deserves a comfortable home,
                and our platform bridges the gap between tenants and property owners with technology and trust.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="feature-card text-start">
              <div className="feature-icon mb-3" style={{ margin: 0, background: 'var(--gradient-primary)' }}><FaLightbulb /></div>
              <h4 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>Our Vision</h4>
              <p className="text-muted">
                To become India's most trusted rental property platform, empowering millions of people
                to find their perfect home with verified listings, secure bookings, and direct owner connections.
              </p>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="text-center mb-4">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">Our platform provides everything you need for a seamless rental experience</p>
        </div>

        <div className="row g-4 mb-5">
          {[
            { icon: <FaShieldAlt />, title: 'Verified Listings', desc: 'Every property is reviewed by our admin team before being listed publicly.' },
            { icon: <FaSearchLocation />, title: 'Smart Search', desc: 'Powerful filters to search by city, budget, property type, and amenities.' },
            { icon: <FaHandshake />, title: 'Direct Connection', desc: 'Connect directly with property owners without middlemen or hidden fees.' },
            { icon: <FaUsers />, title: 'Community Driven', desc: 'Join thousands of users who trust HouseHunt for their rental needs.' },
          ].map((item, idx) => (
            <div className="col-md-3 col-6" key={idx}>
              <div className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="dashboard-section text-center">
          <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
            <FaRocket className="me-2 text-primary" /> Built With Modern Technology
          </h3>
          <p className="text-muted mb-4">
            HouseHunt is built using the MERN Stack — the industry-standard for full-stack web applications.
          </p>
          <div className="row g-3 justify-content-center">
            {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Bootstrap 5', 'JWT Auth'].map((tech) => (
              <div className="col-auto" key={tech}>
                <span className="amenity-tag" style={{ fontSize: '0.95rem', padding: '0.5rem 1.2rem' }}>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="text-center mt-5">
          <div className="feature-card" style={{ maxWidth: 600, margin: '0 auto' }}>
            <FaHeart style={{ fontSize: '2rem', color: 'var(--danger)', marginBottom: '1rem' }} />
            <h5>SmartBridge MERN Stack Internship Project</h5>
            <p className="text-muted mb-0">
              This project was developed as part of the SmartBridge Full Stack Development Internship program,
              demonstrating proficiency in MERN stack technologies and modern web development practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
