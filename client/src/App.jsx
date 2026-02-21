import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Lands from './pages/Lands';
import LandDetail from './pages/LandDetail';
import MyLands from './pages/MyLands';
import AddLand from './pages/AddLand';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Chatbot from './pages/Chatbot';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="lands" element={<Lands />} />
        <Route path="lands/:id" element={<LandDetail />} />
        <Route path="my-lands" element={<PrivateRoute><MyLands /></PrivateRoute>} />
        <Route path="add-land" element={<PrivateRoute><AddLand /></PrivateRoute>} />
        <Route path="bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
        <Route path="bookings/:id" element={<PrivateRoute><BookingDetail /></PrivateRoute>} />
        <Route path="chatbot" element={<Chatbot />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
