const express = require('express');
const router = express.Router();
const {
  createAgreement,
  getAgreementByBooking,
  signAgreement,
} = require('../controllers/agreementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAgreement);
router.get('/booking/:bookingId', protect, getAgreementByBooking);
router.put('/:id/sign', protect, signAgreement);

module.exports = router;
