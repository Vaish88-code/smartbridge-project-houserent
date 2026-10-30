import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { propertyAPI, bookingAPI } from '../services/api';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCouch, FaCalendarAlt,
  FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaArrowLeft, FaRupeeSign, FaShieldAlt
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({ moveInDate: '', message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await propertyAPI.getById(id);
      if (data.success) {
        setProperty(data.property);
      }
    } catch (error) {
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.moveInDate) {
      toast.error('Please select a move-in date');
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await bookingAPI.create({
        propertyId: property._id,
        moveInDate: bookingData.moveInDate,
        message: bookingData.message,
      });
      toast.success(data.message || 'Booking request submitted!');
      setShowBookingModal(false);
      setBookingData({ moveInDate: '', message: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to submit booking request');
    } finally {
      setBookingLoading(false);
    }
  };

  const isOwner = user && property && user._id === property.owner?._id;

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner-custom"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="property-details-page">
      <div className="container">
        <button className="btn btn-action mb-3" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-1" /> Back
        </button>

        <div className="row">
          <div className="col-lg-8">
            {/* Image Gallery */}
            <div className="property-gallery">
              <img
                src={getImageSrc(property.images?.[activeImage] || property.images?.[0])}
                alt={property.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
                }}
              />
              {property.images?.length > 1 && (
                <div className="d-flex gap-2 mt-2">
                  {property.images.map((img, idx) => (
                    <img key={idx}
                      src={getImageSrc(img)}
                      alt={`${property.title} ${idx + 1}`}
                      style={{
                        width: 80, height: 60, objectFit: 'cover', borderRadius: 8,
                        cursor: 'pointer', border: idx === activeImage ? '3px solid var(--primary-blue)' : '3px solid transparent',
                        opacity: idx === activeImage ? 1 : 0.6,
                      }}
                      onClick={() => setActiveImage(idx)}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=80'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="property-info-card">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h1 className="property-detail-title">{property.title}</h1>
                  <p className="text-muted mb-0">
                    <FaMapMarkerAlt className="me-1" /> {property.address}, {property.city}, {property.state} - {property.pincode}
                  </p>
                </div>
                <div className="text-end">
                  <div className="property-detail-price">
                    ₹{property.rent?.toLocaleString('en-IN')}<span>/month</span>
                  </div>
                  <small className="text-muted">
                    <FaShieldAlt className="me-1" />
                    Deposit: ₹{property.deposit?.toLocaleString('en-IN')}
                  </small>
                </div>
              </div>

              <div className="detail-features">
                <div className="detail-feature-item">
                  <FaBed />
                  <div>
                    <div className="label">Bedrooms</div>
                    <div className="value">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="detail-feature-item">
                  <FaBath />
                  <div>
                    <div className="label">Bathrooms</div>
                    <div className="value">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="detail-feature-item">
                  <FaRulerCombined />
                  <div>
                    <div className="label">Area</div>
                    <div className="value">{property.area} sq ft</div>
                  </div>
                </div>
                <div className="detail-feature-item">
                  <FaCouch />
                  <div>
                    <div className="label">Furnishing</div>
                    <div className="value">{property.furnishing}</div>
                  </div>
                </div>
                <div className="detail-feature-item">
                  <FaCalendarAlt />
                  <div>
                    <div className="label">Available From</div>
                    <div className="value">{new Date(property.availableFrom).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              </div>

              <h5 className="mt-4 mb-2" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>Description</h5>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>{property.description}</p>

              {property.amenities?.length > 0 && (
                <>
                  <h5 className="mt-4 mb-2" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>Amenities</h5>
                  <div className="d-flex flex-wrap">
                    {property.amenities.map((amenity) => (
                      <span key={amenity} className="amenity-tag">
                        <FaCheckCircle /> {amenity}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Owner Info */}
            <div className="owner-card mb-3">
              <h5>Property Owner</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="profile-avatar" style={{ width: 50, height: 50, fontSize: '1rem' }}>
                  {property.owner?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <strong>{property.owner?.name}</strong>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                    <FaEnvelope className="me-1" /> {property.owner?.email}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                <FaPhone /> {property.contactNumber}
              </div>
            </div>

            {/* Booking Button */}
            {property.isAvailable && !isOwner && (
              <div className="owner-card">
                <h5 className="mb-3">Interested in this property?</h5>
                {isAuthenticated ? (
                  <button className="btn btn-book" onClick={() => setShowBookingModal(true)}>
                    <FaCalendarAlt className="me-2" /> Request Booking
                  </button>
                ) : (
                  <button className="btn btn-book" onClick={() => navigate('/login')}>
                    Login to Book
                  </button>
                )}
              </div>
            )}

            {!property.isAvailable && (
              <div className="owner-card text-center">
                <span className="status-badge status-rejected">Currently Unavailable</span>
              </div>
            )}

            {isOwner && (
              <div className="owner-card text-center">
                <p className="text-muted mb-2">This is your property</p>
                <button className="btn btn-action" onClick={() => navigate(`/edit-property/${property._id}`)}>
                  Edit Property
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal show d-block booking-modal" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Booking</h5>
                <button type="button" className="btn-close" onClick={() => setShowBookingModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Submit a booking request for <strong>{property.title}</strong></p>
                <form onSubmit={handleBooking}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Preferred Move-in Date *</label>
                    <input type="date" className="form-control" value={bookingData.moveInDate}
                      onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Message to Owner (Optional)</label>
                    <textarea className="form-control" rows="3" placeholder="Introduce yourself or ask questions..."
                      value={bookingData.message}
                      onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })} maxLength={500} />
                  </div>
                  <button type="submit" className="btn btn-book" disabled={bookingLoading}>
                    {bookingLoading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                    ) : 'Submit Booking Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
