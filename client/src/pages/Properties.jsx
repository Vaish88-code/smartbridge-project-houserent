import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSortAmountDown, FaTimes, FaBuilding } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import { propertyAPI } from '../services/api';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '',
    furnishing: searchParams.get('furnishing') || '',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || 1,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const { data } = await propertyAPI.getAll(params);
      if (data.success) {
        setProperties(data.properties);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value, page: 1 };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '1') params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const cleared = {
      search: '', city: '', propertyType: '', furnishing: '',
      minRent: '', maxRent: '', bedrooms: '', sort: 'newest', page: 1,
    };
    setFilters(cleared);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const hasActiveFilters = filters.search || filters.city || filters.propertyType ||
    filters.furnishing || filters.minRent || filters.maxRent || filters.bedrooms;

  return (
    <div className="properties-page">
      <div className="container">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="filter-sidebar">
              <h5><FaFilter /> Filters</h5>

              <div className="filter-group">
                <label>Search</label>
                <input type="text" className="form-control" name="search" placeholder="City, title..."
                  value={filters.search} onChange={handleFilterChange} />
              </div>

              <div className="filter-group">
                <label>City</label>
                <select className="form-select" name="city" value={filters.city} onChange={handleFilterChange}>
                  <option value="">All Cities</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolhapur">Kolhapur</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Property Type</label>
                <select className="form-select" name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="PG / Hostel">PG / Hostel</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Furnishing</label>
                <select className="form-select" name="furnishing" value={filters.furnishing} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Min Rent (₹)</label>
                <input type="number" className="form-control" name="minRent" placeholder="₹ Min"
                  value={filters.minRent} onChange={handleFilterChange} />
              </div>

              <div className="filter-group">
                <label>Max Rent (₹)</label>
                <input type="number" className="form-control" name="maxRent" placeholder="₹ Max"
                  value={filters.maxRent} onChange={handleFilterChange} />
              </div>

              <div className="filter-group">
                <label>Bedrooms</label>
                <select className="form-select" name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option value="0">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button className="btn btn-clear-filters mt-2" onClick={clearFilters}>
                  <FaTimes className="me-1" /> Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Properties Grid */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="results-info mb-0">
                <FaBuilding className="me-1" />
                {pagination.total} {pagination.total === 1 ? 'property' : 'properties'} found
              </p>
              <div className="d-flex align-items-center gap-2">
                <FaSortAmountDown style={{ color: 'var(--gray-400)' }} />
                <select className="form-select form-select-sm" name="sort" value={filters.sort}
                  onChange={handleFilterChange} style={{ width: 'auto' }}>
                  <option value="newest">Newest First</option>
                  <option value="rent_asc">Price: Low to High</option>
                  <option value="rent_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="spinner-custom"></div>
                <p>Loading properties...</p>
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="row g-4">
                  {properties.map((property) => (
                    <div className="col-md-6 col-xl-4" key={property._id}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <nav className="mt-4 d-flex justify-content-center">
                    <ul className="pagination pagination-custom">
                      <li className={`page-item ${pagination.page <= 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)}>
                          Prev
                        </button>
                      </li>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <li key={p} className={`page-item ${pagination.page === p ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => handlePageChange(p)}>{p}</button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page >= pagination.pages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            ) : (
              <div className="empty-state">
                <FaBuilding />
                <h5>No properties found</h5>
                <p>Try adjusting your search filters or check back later for new listings.</p>
                {hasActiveFilters && (
                  <button className="btn btn-search mt-2" onClick={clearFilters}>Clear Filters</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
