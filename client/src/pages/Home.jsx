import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, var(--earth-200) 0%, var(--earth-300) 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.75rem', marginBottom: '1rem', color: 'var(--earth-700)' }}>
            Find Land to Rent, Simply
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--earth-600)', marginBottom: '2rem', maxWidth: 560, margin: '0 auto 2rem' }}>
            Bhoomi Rental connects land owners with tenants. Browse listings, book, pay securely, and sign agreements online.
          </p>
          <Link to="/lands" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 28px' }}>
            Browse Land Listings
          </Link>
        </div>
      </section>
      <section className="container" style={{ padding: '3rem 20px' }}>
        <h2 className="page-title" style={{ textAlign: 'center' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Browse</h3>
            <p style={{ color: 'var(--earth-500)', fontSize: '0.95rem' }}>Search land by location, price, and category.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Book</h3>
            <p style={{ color: 'var(--earth-500)', fontSize: '0.95rem' }}>Select dates and request a booking.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Pay</h3>
            <p style={{ color: 'var(--earth-500)', fontSize: '0.95rem' }}>Pay securely with Razorpay.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Agreement</h3>
            <p style={{ color: 'var(--earth-500)', fontSize: '0.95rem' }}>Sign the rental agreement online.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
