// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api/axios';
// import { useAuth } from '../context/AuthContext';
// import PaymentModal from '../components/PaymentModal';

// export default function BookingDetail() {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [booking, setBooking] = useState(null);
//   const [agreement, setAgreement] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [paymentModal, setPaymentModal] = useState(false);
//   const [statusUpdating, setStatusUpdating] = useState(false);

//   const load = () => {
//     api.get(`/bookings/${id}`).then(({ data }) => setBooking(data.booking)).catch(() => setBooking(null)).finally(() => setLoading(false));
//     api.get(`/agreements/booking/${id}`).then(({ data }) => setAgreement(data.agreement)).catch(() => setAgreement(null));
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   const isOwner = booking?.owner?._id === user?.id || booking?.owner === user?.id;
//   const isTenant = booking?.user?._id === user?.id || booking?.user === user?.id;

//   const updateStatus = async (status) => {
//     setStatusUpdating(true);
//     try {
//       await api.put(`/bookings/${id}/status`, { status });
//       load();
//     } finally {
//       setStatusUpdating(false);
//     }
//   };

//   const createAgreement = async () => {
//     try {
//       await api.post('/agreements', { bookingId: id });
//       load();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const signAgreement = async (agreementId) => {
//     try {
//       await api.put(`/agreements/${agreementId}/sign`);
//       load();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   if (loading || !booking) {
//     return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>{loading ? 'Loading...' : 'Booking not found.'}</div>;
//   }

//   return (
//     <div className="container" style={{ padding: '2rem 20px', maxWidth: 720 }}>
//       <h1 className="page-title">Booking: {booking.land?.title}</h1>
//       <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
//         <p><strong>Period:</strong> {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p>
//         <p><strong>Total:</strong> ₹{booking.totalAmount?.toLocaleString()}</p>
//         <p><strong>Status:</strong> {booking.status}</p>
//         {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
//         {isOwner && booking.status === 'pending' && (
//           <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
//             <button className="btn btn-primary" onClick={() => updateStatus('confirmed')} disabled={statusUpdating}>Confirm</button>
//             <button className="btn btn-ghost" onClick={() => updateStatus('cancelled')} disabled={statusUpdating}>Cancel</button>
//           </div>
//         )}
//         {isTenant && booking.status === 'confirmed' && (
//           <div style={{ marginTop: '1rem' }}>
//             <button className="btn btn-primary" onClick={() => setPaymentModal(true)}>Pay Now</button>
//           </div>
//         )}
//       </div>

//       {agreement && (
//         <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
//           <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Agreement</h2>
//           <p>Signed by tenant: {agreement.signedByTenant ? 'Yes' : 'No'}</p>
//           <p>Signed by owner: {agreement.signedByOwner ? 'Yes' : 'No'}</p>
//           {agreement.pdfUrl && (
//             <a href={agreement.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>View PDF</a>
//           )}
//           {(isTenant && !agreement.signedByTenant) && (
//             <button className="btn btn-primary" style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }} onClick={() => signAgreement(agreement._id)}>Sign as Tenant</button>
//           )}
//           {(isOwner && !agreement.signedByOwner) && (
//             <button className="btn btn-primary" style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }} onClick={() => signAgreement(agreement._id)}>Sign as Owner</button>
//           )}
//         </div>
//       )}

//       {booking.status === 'confirmed' && isOwner && !agreement && (
//         <div className="card" style={{ padding: '1.5rem' }}>
//           <button className="btn btn-outline" onClick={createAgreement}>Generate Agreement</button>
//         </div>
//       )}

//       {paymentModal && (
//         <PaymentModal
//           bookingId={id}
//           amount={booking.totalAmount}
//           onSuccess={() => { setPaymentModal(false); load(); }}
//           onClose={() => setPaymentModal(false)}
//         />
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const load = async () => {
    try {
      const bookingRes = await api.get(`/bookings/${id}`);
      setBooking(bookingRes.data.booking);
    } catch {
      setBooking(null);
    }

    try {
      const agreementRes = await api.get(`/agreements/booking/${id}`);
      setAgreement(agreementRes.data.agreement);
    } catch {
      setAgreement(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const isOwner =
    booking?.owner?._id === user?.id ||
    booking?.owner === user?.id;

  const isTenant =
    booking?.user?._id === user?.id ||
    booking?.user === user?.id;

  const updateStatus = async (status) => {
    setStatusUpdating(true);
    try {
      await api.put(`/bookings/${id}/status`, { status });
      await load();
    } finally {
      setStatusUpdating(false);
    }
  };

  const createAgreement = async () => {
    try {
      await api.post('/agreements', { bookingId: id });
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const signAgreement = async (agreementId) => {
    try {
      await api.put(`/agreements/${agreementId}/sign`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !booking) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        {loading ? 'Loading...' : 'Booking not found.'}
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 20px', maxWidth: 720 }}>
      <h1 className="page-title">
        Booking: {booking.land?.title}
      </h1>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p>
          <strong>Period:</strong>{' '}
          {new Date(booking.startDate).toLocaleDateString()} –{' '}
          {new Date(booking.endDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Total:</strong> ₹{booking.totalAmount?.toLocaleString()}
        </p>

        <p>
          <strong>Status:</strong>{' '}
          <span style={{ fontWeight: 'bold' }}>
            {booking.status}
          </span>
        </p>

        {booking.notes && (
          <p>
            <strong>Notes:</strong> {booking.notes}
          </p>
        )}

        {/* OWNER ACTIONS */}
        {isOwner && booking.status === 'pending' && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => updateStatus('confirmed')}
              disabled={statusUpdating}
            >
              Confirm
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => updateStatus('cancelled')}
              disabled={statusUpdating}
            >
              Cancel
            </button>
          </div>
        )}

        {/* TENANT PAYMENT */}
        {isTenant && booking.status === 'confirmed' && (
          <div style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => setPaymentModal(true)}
            >
              Pay Now
            </button>
          </div>
        )}

        {/* PAYMENT COMPLETED */}
        {isTenant && booking.status === 'paid' && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              Payment Completed ✅
            </p>
          </div>
        )}
      </div>

      {/* AGREEMENT SECTION (Only after paid) */}
      {booking.status === 'paid' && !agreement && isOwner && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <button className="btn btn-outline" onClick={createAgreement}>
            Generate Agreement
          </button>
        </div>
      )}

      {agreement && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
            Agreement
          </h2>

          <p>Signed by tenant: {agreement.signedByTenant ? 'Yes' : 'No'}</p>
          <p>Signed by owner: {agreement.signedByOwner ? 'Yes' : 'No'}</p>

          {agreement.pdfUrl && (
            <a
              href={agreement.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ marginTop: '0.5rem' }}
            >
              View PDF
            </a>
          )}

          {isTenant && !agreement.signedByTenant && (
            <button
              className="btn btn-primary"
              style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
              onClick={() => signAgreement(agreement._id)}
            >
              Sign as Tenant
            </button>
          )}

          {isOwner && !agreement.signedByOwner && (
            <button
              className="btn btn-primary"
              style={{ marginLeft: '0.5rem', marginTop: '0.5rem' }}
              onClick={() => signAgreement(agreement._id)}
            >
              Sign as Owner
            </button>
          )}
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentModal && (
        <PaymentModal
          bookingId={id}
          amount={booking.totalAmount}
          onSuccess={async () => {
            setPaymentModal(false);
            await load();   // 🔥 refresh after payment
          }}
          onClose={() => setPaymentModal(false)}
        />
      )}
    </div>
  );
}
