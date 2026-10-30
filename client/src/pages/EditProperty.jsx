import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { propertyAPI } from '../services/api';
import { FaEdit, FaHome, FaUpload } from 'react-icons/fa';

const AMENITIES_LIST = ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Security', 'Lift', 'Balcony'];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: '', rent: '', deposit: '',
    address: '', city: '', state: '', pincode: '', bedrooms: '', bathrooms: '',
    area: '', furnishing: '', amenities: [], availableFrom: '', contactNumber: '',
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await propertyAPI.getById(id);
      if (data.success) {
        const p = data.property;
        setFormData({
          title: p.title || '', description: p.description || '', propertyType: p.propertyType || '',
          rent: p.rent || '', deposit: p.deposit || '', address: p.address || '',
          city: p.city || '', state: p.state || '', pincode: p.pincode || '',
          bedrooms: p.bedrooms ?? '', bathrooms: p.bathrooms || '', area: p.area || '',
          furnishing: p.furnishing || '', amenities: p.amenities || [],
          availableFrom: p.availableFrom ? new Date(p.availableFrom).toISOString().split('T')[0] : '',
          contactNumber: p.contactNumber || '',
        });
      }
    } catch (error) {
      toast.error('Property not found');
      navigate('/dashboard');
    } finally {
      setFetching(false);
    }
  };

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
    if (files.length > 5) { toast.error('Maximum 5 images allowed'); return; }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities') data.append(key, value.join(','));
        else data.append(key, value);
      });
      images.forEach((img) => data.append('images', img));

      const { data: res } = await propertyAPI.update(id, data);
      toast.success(res.message || 'Property updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner-custom"></div><p>Loading property...</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="form-card">
              <h2><FaEdit className="text-primary" /> Edit Property</h2>
              <p className="text-muted mb-4">Update your property listing details</p>

              <form onSubmit={handleSubmit}>
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                  <FaHome className="me-2 text-primary" />Basic Information
                </h5>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label">Property Title *</label>
                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleChange} required />
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
                    <input type="number" className="form-control" name="rent" value={formData.rent} onChange={handleChange} required min="500" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Security Deposit (₹) *</label>
                    <input type="number" className="form-control" name="deposit" value={formData.deposit} onChange={handleChange} required min="0" />
                  </div>
                </div>

                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>📍 Location</h5>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label">Full Address *</label>
                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Pincode *</label>
                    <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} required />
                  </div>
                </div>

                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>🏠 Property Details</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <label className="form-label">Bedrooms *</label>
                    <input type="number" className="form-control" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Bathrooms *</label>
                    <input type="number" className="form-control" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="1" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Area (sq ft) *</label>
                    <input type="number" className="form-control" name="area" value={formData.area} onChange={handleChange} required min="100" />
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
                    <input type="date" className="form-control" name="availableFrom" value={formData.availableFrom} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contact Number *</label>
                    <input type="tel" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                  </div>
                </div>

                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>✨ Amenities</h5>
                <div className="row g-2 mb-4">
                  {AMENITIES_LIST.map((amenity) => (
                    <div className="col-md-3 col-6" key={amenity}>
                      <div className={`amenity-checkbox ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                        onClick={() => handleAmenityToggle(amenity)}>
                        <input type="checkbox" checked={formData.amenities.includes(amenity)} readOnly />
                        <span>{amenity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="mb-3" style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
                  <FaUpload className="me-2 text-primary" />Add More Images
                </h5>
                <div className="mb-4">
                  <input type="file" className="form-control" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleImageChange} />
                  <small className="text-muted">Upload up to 5 new images. Existing images will be kept.</small>
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : <><FaEdit className="me-2" /> Update Property</>}
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

export default EditProperty;
