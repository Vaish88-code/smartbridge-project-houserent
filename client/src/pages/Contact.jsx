import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaClock } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-subtitle">
            Have questions or need help? We'd love to hear from you.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="feature-card text-start mb-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="feature-icon" style={{ width: 50, height: 50, fontSize: '1.2rem', margin: 0 }}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Address</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>

            <div className="feature-card text-start mb-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="feature-icon" style={{ width: 50, height: 50, fontSize: '1.2rem', margin: 0, background: 'var(--gradient-primary)' }}>
                  <FaEnvelope />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Email</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>support@househunt.com</p>
                </div>
              </div>
            </div>

            <div className="feature-card text-start mb-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="feature-icon" style={{ width: 50, height: 50, fontSize: '1.2rem', margin: 0, background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                  <FaPhone />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Phone</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div className="feature-card text-start">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="feature-icon" style={{ width: 50, height: 50, fontSize: '1.2rem', margin: 0, background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
                  <FaClock />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Working Hours</h6>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="contact-form">
              <h4 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, marginBottom: '1.5rem' }}>
                <FaPaperPlane className="me-2 text-primary" /> Send us a Message
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Your Name *</label>
                    <input type="text" className="form-control" name="name" placeholder="John Doe"
                      value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input type="email" className="form-control" name="email" placeholder="john@example.com"
                      value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Subject *</label>
                    <input type="text" className="form-control" name="subject" placeholder="How can we help?"
                      value={formData.subject} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Message *</label>
                    <textarea className="form-control" name="message" rows="5" placeholder="Write your message here..."
                      value={formData.message} onChange={handleChange} required></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-submit" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> :
                        <><FaPaperPlane className="me-2" /> Send Message</>}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
