import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data.bookings || [])).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({ pending: 'var(--earth-500)', confirmed: 'var(--accent)', cancelled: 'var(--danger)', completed: 'var(--earth-600)' }[s] || 'var(--earth-500)');

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <h1 className="page-title">My Bookings</h1>
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : bookings.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--earth-500)' }}>No bookings yet. <Link to="/lands">Browse land</Link>.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((b) => (
            <Link key={b._id} to={`/bookings/${b._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{b.land?.title}</h3>
                  <p style={{ color: 'var(--earth-500)', fontSize: '0.9rem' }}>
                    {b.startDate && new Date(b.startDate).toLocaleDateString()} – {b.endDate && new Date(b.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{b.totalAmount?.toLocaleString()}</span>
                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'var(--earth-200)', color: statusColor(b.status), fontSize: '0.9rem' }}>{b.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
