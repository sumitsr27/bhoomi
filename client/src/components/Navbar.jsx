import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">🌾</span>
          Bhoomi Rental
        </Link>
        <nav className="nav-links">
          <Link to="/lands">Browse Land</Link>
          <Link to="/chatbot">Chatbot</Link>
          {user ? (
            <>
              <Link to="/bookings">My Bookings</Link>
              <Link to="/my-lands">My Listings</Link>
              <Link to="/add-land">Add Land / Register Farm</Link>
              <span className="user-name">{user.name}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
