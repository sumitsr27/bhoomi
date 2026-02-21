// import { useState, useEffect } from 'react';
// import api from '../api/axios';

// const loadRazorpay = () => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// export default function PaymentModal({ bookingId, amount, onSuccess, onClose }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const confirmDemoPayment = async () => {
//     setError('');
//     setLoading(true);
//     try {
//       await api.post('/payments/verify-demo', { bookingId });
//       onSuccess();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Demo payment failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openRazorpay = async () => {
//     setError('');
//     setLoading(true);
//     try {
//       const { data } = await api.post('/payments/create-order', { bookingId });
//       if (data.demoMode || !data.keyId) {
//         await confirmDemoPayment();
//         return;
//       }
//       const ok = await loadRazorpay();
//       if (!ok) {
//         setError('Could not load payment gateway.');
//         setLoading(false);
//         return;
//       }
//       const options = {
//         key: data.keyId,
//         amount: data.amount * 100,
//         currency: 'INR',
//         order_id: data.orderId,
//         name: 'Bhoomi Rental',
//         description: 'Land rental payment',
//         handler: async (res) => {
//           try {
//             await api.post('/payments/verify', {
//               razorpay_order_id: res.razorpay_order_id,
//               razorpay_payment_id: res.razorpay_payment_id,
//               razorpay_signature: res.razorpay_signature,
//             });
//             onSuccess();
//           } catch (e) {
//             setError('Payment verification failed.');
//           }
//         },
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       position: 'fixed',
//       inset: 0,
//       background: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 1000,
//     }} onClick={onClose}>
//       <div className="card" style={{ padding: '2rem', maxWidth: 400, width: '90%' }} onClick={(e) => e.stopPropagation()}>
//         <h2 style={{ marginBottom: '1rem' }}>Pay ₹{amount?.toLocaleString()}</h2>
//         {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}
//         <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//           <button className="btn btn-primary" onClick={openRazorpay} disabled={loading}>
//             {loading ? 'Please wait...' : 'Pay (Razorpay or Demo)'}
//           </button>
//           <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
//         </div>
//         <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--earth-500)' }}>
//           No Razorpay? Payment runs in demo mode and confirms the booking without real payment.
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from 'react';
import api from '../api/axios';

export default function PaymentModal({ bookingId, amount, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      // Step 1: Create order (will auto switch to demo mode if no Razorpay keys)
      const { data } = await api.post('/payments/create-order', {
        bookingId,
      });

      // 🔥 DEMO MODE (No Razorpay keys)
      if (data.demoMode || !data.keyId) {
        await api.post('/payments/verify-demo', {
          bookingId,
        });

        onSuccess();
        return;
      }

      // 🔥 If Razorpay keys exist (future use)
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: data.keyId,
          amount: data.amount * 100,
          currency: 'INR',
          order_id: data.orderId,
          name: 'Bhoomi Rental',
          description: 'Land rental payment',
          handler: async (res) => {
            try {
              await api.post('/payments/verify', {
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              });

              onSuccess();
            } catch (e) {
              setError('Payment verification failed.');
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        setError('Failed to load payment gateway.');
      };

      document.body.appendChild(script);

    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ padding: '2rem', maxWidth: 400, width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '1rem' }}>
          Pay ₹{amount?.toLocaleString()}
        </h2>

        {error && (
          <p className="error-msg" style={{ marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay (Demo Mode)'}
          </button>

          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>

        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '0.85rem',
            color: 'var(--earth-500)',
          }}
        >
          Demo mode: No real payment is processed. Booking will be confirmed instantly.
        </p>
      </div>
    </div>
  );
}
