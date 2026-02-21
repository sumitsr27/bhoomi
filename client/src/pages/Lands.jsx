import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LandCard from '../components/LandCard';

export default function Lands() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', city: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    params.set('available', 'true');
    api.get(`/lands?${params}`).then(({ data }) => {
      setLands(data.lands || []);
    }).catch(() => setLands([])).finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 className="page-title">Browse Land</h1>
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
          <label>Category</label>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All</option>
            <option value="agricultural">Agricultural</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
          <label>City</label>
          <input placeholder="City name" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        </div>
        <div className="form-group" style={{ marginBottom: 0, minWidth: 100 }}>
          <label>Min ₹/mo</label>
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        </div>
        <div className="form-group" style={{ marginBottom: 0, minWidth: 100 }}>
          <label>Max ₹/mo</label>
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : lands.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--earth-500)' }}>No land listings found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {lands.map((land) => (
            <LandCard key={land._id} land={land} />
          ))}
        </div>
      )}
    </div>
  );
}
