import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaSearchLocation, FaHandshake, FaUserCheck, FaSearch, FaEye, FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import { propertyAPI } from '../services/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data } = await propertyAPI.getAll({ limit: 6, sort: 'newest' });
      if (data.success) {
        setFeaturedProperties(data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Verified Listings',
      desc: 'All properties are reviewed and approved by our admin team for quality assurance.',
    },
    {
      icon: <FaSearchLocation />,
      title: 'Easy Property Search',
      desc: 'Powerful search and filter options to find your ideal rental home quickly.',
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Secure Booking Requests',
      desc: 'Submit booking requests directly to property owners through our secure platform.',
    },
    {
      icon: <FaHandshake />,
      title: 'Direct Owner Connection',
      desc: 'Connect directly with property owners without any middlemen or hidden charges.',
    },
  ];

  const steps = [
    { num: 1, title: 'Search Properties', desc: 'Browse through hundreds of verified rental listings across top Indian cities.' },
    { num: 2, title: 'Explore Details', desc: 'View photos, amenities, pricing, and all property details in one place.' },
    { num: 3, title: 'Request a Booking', desc: 'Submit your booking request with your preferred move-in date.' },
    { num: 4, title: 'Connect with Owner', desc: 'Property owner reviews and responds to your booking request directly.' },
  ];

  const locations = [
    { name: 'Pune', img: 'https://images.unsplash.com/photo-1572445271230-a78b5e6d1c75?w=600&q=80' },
    { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80' },
    { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80' },
    { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
    { name: 'Kolhapur', img: 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=600&q=80' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <h1 className="hero-title">
                Find Your Perfect <br />
                <span className="highlight">Home with HouseHunt</span>
              </h1>
              <p className="hero-subtitle">
                Discover comfortable and affordable rental properties in your favorite locations. 
                Browse verified listings and connect directly with property owners.
              </p>
              <div className="d-flex gap-3">
                <Link to="/properties" className="btn btn-search px-4">
                  <FaSearch className="me-2" /> Browse Properties
                </Link>
                <Link to="/register" className="btn nav-btn-login px-4" style={{ borderRadius: '10px' }}>
                  <FaUserCheck className="me-2" /> Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              <SearchBar isHero={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-2">
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">
              Explore our hand-picked rental properties across top Indian cities
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-custom"></div>
              <p>Loading properties...</p>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="row g-4">
              {featuredProperties.map((property) => (
                <div className="col-lg-4 col-md-6" key={property._id}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaSearchLocation style={{ fontSize: '3rem' }} />
              <h5>No properties available yet</h5>
              <p>Check back soon for new listings!</p>
            </div>
          )}

          {featuredProperties.length > 0 && (
            <div className="text-center mt-4">
              <Link to="/properties" className="btn btn-search px-5">
                View All Properties <FaEye className="ms-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose HouseHunt */}
      <section className="section-padding" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="text-center mb-2">
            <h2 className="section-title">Why Choose HouseHunt?</h2>
            <p className="section-subtitle">
              We make finding your perfect rental home simple, safe, and stress-free
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h5>{feature.title}</h5>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-2">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Four simple steps to find and book your dream rental home
            </p>
          </div>

          <div className="row g-4">
            {steps.map((step) => (
              <div className="col-lg-3 col-md-6" key={step.num}>
                <div className="step-card">
                  <div className="step-number">{step.num}</div>
                  <h5>{step.title}</h5>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="section-padding" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="text-center mb-2">
            <h2 className="section-title">Popular Locations</h2>
            <p className="section-subtitle">
              Explore rental properties in India&apos;s most sought-after cities
            </p>
          </div>

          <div className="row g-4">
            {locations.map((loc) => (
              <div className="col-lg col-md-4 col-6" key={loc.name}>
                <Link to={`/properties?search=${loc.name}`} style={{ textDecoration: 'none' }}>
                  <div className="location-card">
                    <img
                      src={loc.img}
                      alt={loc.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80';
                      }}
                    />
                    <div className="location-overlay">
                      <h5>{loc.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
