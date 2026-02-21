import { Link } from 'react-router-dom';

export default function LandCard({ land }) {
  //const img = land.images?.[0]?.url || 'https://placehold.co/400x220/e8dfd0/5c4a3a?text=No+Image';
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const img =
  land.images?.[0]?.url
    ? land.images[0].url.startsWith('http')
      ? land.images[0].url
      : `${backendURL}${land.images[0].url}`
    : 'https://placehold.co/400x220/e8dfd0/5c4a3a?text=No+Image';
  const location = land.location ? `${land.location.city}, ${land.location.state}` : '';

  return (
    <Link to={`/lands/${land._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card" style={{ overflow: 'hidden', transition: 'transform 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = ''; }}>
        <div style={{ aspectRatio: '16/10', background: 'var(--earth-200)', overflow: 'hidden' }}>
          <img src={img} alt={land.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{land.title}</h3>
          <p style={{ color: 'var(--earth-500)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{location}</p>
          <p style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{land.pricePerMonth?.toLocaleString()}/month</p>
        </div>
      </div>
    </Link>
  );
}
