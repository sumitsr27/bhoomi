const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  confirmDemoPayment,
  getPaymentsByBooking,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/verify-demo', protect, confirmDemoPayment);
router.get('/booking/:bookingId', protect, getPaymentsByBooking);

module.exports = router;
