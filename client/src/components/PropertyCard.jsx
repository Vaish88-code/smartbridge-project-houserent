import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaArrowRight } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const PropertyCard = ({ property, showStatus = false }) => {
  const {
    _id,
    title,
    city,
    state,
    rent,
    propertyType,
    bedrooms,
    bathrooms,
    images,
    approvalStatus,
    furnishing,
  } = property;

  const getImageSrc = () => {
    if (images && images.length > 0) {
      const img = images[0];
      // If it's a full URL, use directly
      if (img.startsWith('http')) return img;
      // If it's a local upload path
      return `${API_BASE}${img}`;
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
  };

  return (
    <div className="property-card">
      <div className="property-card-img">
        <img
          src={getImageSrc()}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
          }}
        />
        <span className="property-type-badge">{propertyType}</span>
        {showStatus && (
          <span className={`property-status-badge badge-${approvalStatus}`}>
            {approvalStatus?.charAt(0).toUpperCase() + approvalStatus?.slice(1)}
          </span>
        )}
      </div>

      <div className="property-card-body">
        <h5 className="property-card-title">{title}</h5>
        <p className="property-card-location">
          <FaMapMarkerAlt /> {city}, {state}
        </p>

        <div className="property-card-features">
          <span className="property-feature">
            <FaBed /> {bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="property-feature">
            <FaBath /> {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
          <span className="property-feature">
            {furnishing}
          </span>
        </div>

        <div className="property-card-footer">
          <div className="property-price">
            ₹{rent?.toLocaleString('en-IN')}
            <span>/month</span>
          </div>
          <Link to={`/properties/${_id}`} className="btn btn-view-details">
            Details <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
