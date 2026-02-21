import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--earth-700)',
      color: 'var(--earth-200)',
      padding: '2rem',
      marginTop: '3rem',
      textAlign: 'center',
    }}>
      <div className="container">
        <p style={{ marginBottom: '0.5rem' }}>© Bhoomi Rental. Rent land with ease.</p>
        <Link to="/lands" style={{ color: 'var(--earth-200)' }}>Browse</Link>
        {' · '}
        <Link to="/chatbot" style={{ color: 'var(--earth-200)' }}>Help</Link>
      </div>
    </footer>
  );
}
