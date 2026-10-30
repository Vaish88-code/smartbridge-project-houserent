import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const SearchBar = ({ onSearch, isHero = false }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    minRent: '',
    maxRent: '',
    propertyType: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.minRent) params.set('minRent', filters.minRent);
    if (filters.maxRent) params.set('maxRent', filters.maxRent);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);

    if (onSearch) {
      onSearch(filters);
    } else {
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={isHero ? 'search-panel' : ''}>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">
            <FaMapMarkerAlt className="me-1" /> Location
          </label>
          <input
            type="text"
            className="form-control"
            name="search"
            placeholder="Search city or location..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Min Price</label>
          <input
            type="number"
            className="form-control"
            name="minRent"
            placeholder="₹ Min"
            value={filters.minRent}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Max Price</label>
          <input
            type="number"
            className="form-control"
            name="maxRent"
            placeholder="₹ Max"
            value={filters.maxRent}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Property Type</label>
          <select
            className="form-select"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Independent House">Independent House</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
            <option value="PG / Hostel">PG / Hostel</option>
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button type="submit" className="btn btn-search">
            <FaSearch className="me-1" /> Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
