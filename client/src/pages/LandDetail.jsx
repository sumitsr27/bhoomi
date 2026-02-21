import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startDate: '', endDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/lands/${id}`).then(({ data }) => setLand(data.land)).catch(() => setLand(null)).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', { land: id, ...booking });
      navigate(`/bookings/${data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !land) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>{loading ? 'Loading...' : 'Land not found.'}</div>;
  }

  const img = land.images?.[0]?.url || 'https://placehold.co/800x400/e8dfd0/5c4a3a?text=No+Image';
  const location = land.location ? `${land.location.address}, ${land.location.city}, ${land.location.state} - ${land.location.pincode}` : '';

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        <div>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1.5rem', background: 'var(--earth-200)' }}>
            <img src={img} alt={land.title} style={{ width: '100%', display: 'block' }} />
          </div>
          <h1 className="page-title">{land.title}</h1>
          <p style={{ color: 'var(--earth-500)', marginBottom: '1rem' }}>{location}</p>
          <p style={{ marginBottom: '1rem' }}>{land.description}</p>
          <p><strong>Area:</strong> {land.area?.value} {land.area?.unit}</p>
          <p><strong>Category:</strong> {land.category}</p>
          {land.features?.length > 0 && (
            <p><strong>Features:</strong> {land.features.join(', ')}</p>
          )}
          {land.owner?.name && <p style={{ marginTop: '1rem' }}>Owner: {land.owner.name}</p>}
        </div>
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 100 }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>₹{land.pricePerMonth?.toLocaleString()}/month</h2>
          {!land.isAvailable ? (
            <p style={{ color: 'var(--earth-500)' }}>Currently not available.</p>
          ) : user ? (
            <form onSubmit={handleBook}>
              {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}
              <div className="form-group">
                <label>Start date</label>
                <input type="date" value={booking.startDate} onChange={(e) => setBooking({ ...booking, startDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End date</label>
                <input type="date" value={booking.endDate} onChange={(e) => setBooking({ ...booking, endDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} rows={2} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Booking...' : 'Request Booking'}
              </button>
            </form>
          ) : (
            <p>Please <a href="/login">login</a> to book this land.</p>
          )}
        </div>
      </div>
    </div>
  );
}
