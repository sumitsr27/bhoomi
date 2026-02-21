// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../api/axios';
// import LandCard from '../components/LandCard';

// export default function MyLands() {
//   const [lands, setLands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState([]);


//   useEffect(() => {
//     api.get('/lands/my-lands').then(({ data }) => setLands(data.lands || [])).catch(() => setLands([])).finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="container" style={{ padding: '2rem 20px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
//         <h1 className="page-title" style={{ marginBottom: 0 }}>My Listings</h1>
//         <Link to="/add-land" className="btn btn-primary">Add Land</Link>
//       </div>
//       {loading ? (
//         <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
//       ) : lands.length === 0 ? (
//         <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--earth-500)' }}>You have no listings. <Link to="/add-land">Add your first land</Link>.</p>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
//           {lands.map((land) => (
//             <div key={land._id} style={{ position: 'relative' }}>
//               <LandCard land={land} />
//               <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
//                 <Link to={`/lands/${land._id}`} className="btn btn-ghost" style={{ flex: 1, textAlign: 'center' }}>View</Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LandCard from '../components/LandCard';

export default function MyLands() {
  const [lands, setLands] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch owner lands
        const landsRes = await api.get('/lands/my-lands');
        setLands(landsRes.data.lands || []);

        // 🔥 IMPORTANT: use /bookings/my
        const bookingsRes = await api.get('/bookings/my');
        setBookings(bookingsRes.data.bookings || []);
      } catch (err) {
        setLands([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const approveBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, {
        status: "confirmed"
      });

      // Refresh bookings after approval
      const { data } = await api.get('/bookings/my');
      setBookings(data.bookings || []);

      alert("Booking confirmed successfully!");
    } catch (err) {
      alert("Failed to confirm booking");
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          My Listings
        </h1>
        <Link to="/add-land" className="btn btn-primary">
          Add Land
        </Link>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
      ) : lands.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          You have no listings.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {lands.map((land) => {
            const landBookings = bookings.filter(
              (booking) =>
                booking.land?._id === land._id
            );

            return (
              <div key={land._id}>
                <LandCard land={land} />

                <div style={{ marginTop: '10px' }}>
                  <Link
                    to={`/lands/${land._id}`}
                    className="btn btn-ghost"
                  >
                    View
                  </Link>
                </div>

                {/* BOOKINGS SECTION */}
                {landBookings.length > 0 && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '10px',
                    background: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <h4>Bookings</h4>

                    {landBookings.map((booking) => (
                      <div
                        key={booking._id}
                        style={{
                          padding: '8px',
                          marginBottom: '8px',
                          background: 'white',
                          borderRadius: '6px',
                          border: '1px solid #ddd'
                        }}
                      >
                        <p><strong>Status:</strong> {booking.status}</p>

                        {booking.status === "pending" && (
                          <button
                            onClick={() => approveBooking(booking._id)}
                            style={{
                              padding: '5px 10px',
                              background: 'green',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Confirm Booking
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
