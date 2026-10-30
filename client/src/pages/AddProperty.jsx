import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { propertyAPI } from '../services/api';
import { FaPlus, FaHome, FaUpload } from 'react-icons/fa';

const AMENITIES_LIST = ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Security', 'Lift', 'Balcony'];

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: '', rent: '', deposit: '',
    address: '', city: '', state: '', pincode: '', bedrooms: '', bathrooms: '',
    area: '', furnishing: '', amenities: [], availableFrom: '', contactNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const required = ['title', 'description', 'propertyType', 'rent', 'deposit', 'address', 'city', 'state', 'pincode', 'bedrooms', 'bathrooms', 'area', 'furnishing', 'availableFrom', 'contactNumber'];
    for (const field of required) {
      if (!formData[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return;
      }
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities') {
          data.append(key, value.join(','));
        } else {
          data.append(key, value);
        }
      });
      images.forEach((img) => data.append('images', img));

      const { data: res } = await propertyAPI.create(data);
      toast.success(res.message || 'Property listed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="form-card">
              <h2><FaPlus className="text-primary" /> List a New Property</h2>
              <p className="text-muted mb-4">Fill in the details to list your rental property on HouseHunt</p>

              <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                  <FaHome className="me-2 text-primary" />Basic Information
                </h5>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label">Property Title *</label>
                    <input type="text" className="form-control" name="title" placeholder="e.g. Spacious 2BHK Apartment in Koregaon Park"
                      value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea className="form-control" name="description" rows="4" placeholder="Describe your property in detail (min 20 characters)"
                      value={formData.description} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Property Type *</label>
                    <select className="form-select" name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                      <option value="">Select Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Villa">Villa</option>
                      <option value="Studio">Studio</option>
                      <option value="PG / Hostel">PG / Hostel</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Monthly Rent (₹) *</label>
                    <input type="number" className="form-control" name="rent" placeholder="e.g. 25000"
                      value={formData.rent} onChange={handleChange} required min="500" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Security Deposit (₹) *</label>
                    <input type="number" className="form-control" name="deposit" placeholder="e.g. 50000"
                      value={formData.deposit} onChange={handleChange} required min="0" />
                  </div>
                </div>

                {/* Location */}
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>📍 Location</h5>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label">Full Address *</label>
                    <input type="text" className="form-control" name="address" placeholder="e.g. 42, North Main Road"
                      value={formData.address} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input type="text" className="form-control" name="city" placeholder="e.g. Pune"
                      value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input type="text" className="form-control" name="state" placeholder="e.g. Maharashtra"
                      value={formData.state} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Pincode *</label>
                    <input type="text" className="form-control" name="pincode" placeholder="e.g. 411001"
                      value={formData.pincode} onChange={handleChange} required maxLength="6" />
                  </div>
                </div>

                {/* Property Details */}
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>🏠 Property Details</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <label className="form-label">Bedrooms *</label>
                    <input type="number" className="form-control" name="bedrooms" placeholder="e.g. 2"
                      value={formData.bedrooms} onChange={handleChange} required min="0" max="20" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Bathrooms *</label>
                    <input type="number" className="form-control" name="bathrooms" placeholder="e.g. 2"
                      value={formData.bathrooms} onChange={handleChange} required min="1" max="10" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Area (sq ft) *</label>
                    <input type="number" className="form-control" name="area" placeholder="e.g. 1200"
                      value={formData.area} onChange={handleChange} required min="100" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Furnishing *</label>
                    <select className="form-select" name="furnishing" value={formData.furnishing} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Available From *</label>
                    <input type="date" className="form-control" name="availableFrom"
                      value={formData.availableFrom} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contact Number *</label>
                    <input type="tel" className="form-control" name="contactNumber" placeholder="10-digit phone number"
                      value={formData.contactNumber} onChange={handleChange} required />
                  </div>
                </div>

                {/* Amenities */}
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>✨ Amenities</h5>
                <div className="row g-2 mb-4">
                  {AMENITIES_LIST.map((amenity) => (
                    <div className="col-md-3 col-6" key={amenity}>
                      <div
                        className={`amenity-checkbox ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                        onClick={() => handleAmenityToggle(amenity)}
                      >
                        <input type="checkbox" checked={formData.amenities.includes(amenity)} readOnly style={{ accentColor: 'var(--primary-blue)' }} />
                        <span>{amenity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Images */}
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                  <FaUpload className="me-2 text-primary" />Property Images
                </h5>
                <div className="mb-4">
                  <input type="file" className="form-control" accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple onChange={handleImageChange} />
                  <small className="text-muted">Upload up to 5 images (JPEG, PNG, WebP). Max 5MB each.</small>
                  {images.length > 0 && (
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {images.map((img, idx) => (
                        <img key={idx} src={URL.createObjectURL(img)} alt={`Preview ${idx}`}
                          style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Listing Property...</>
                    ) : (
                      <><FaPlus className="me-2" /> List Property</>
                    )}
                  </button>
                  <button type="button" className="btn btn-action px-4" onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
