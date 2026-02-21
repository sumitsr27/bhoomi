// const Payment = require('../models/Payment');
// const Booking = require('../models/Booking');
// const { createOrder, verifyPayment, paymentEnabled } = require('../services/paymentService');
// const { razorpayKeyId } = require('../config/payment');

// exports.createOrder = async (req, res, next) => {
//   try {
//     const { bookingId } = req.body;
//     const booking = await Booking.findById(bookingId).populate('land');
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//     if (booking.user.toString() !== req.user.id) {
//       return res.status(403).json({ success: false, message: 'Not authorized' });
//     }
//     if (paymentEnabled) {
//       const order = await createOrder(booking.totalAmount, 'INR', `booking_${bookingId}`);
//       await Payment.create({
//         booking: bookingId,
//         user: req.user.id,
//         amount: booking.totalAmount,
//         razorpayOrderId: order.id,
//         status: 'pending',
//       });
//       return res.json({
//         success: true,
//         orderId: order.id,
//         amount: booking.totalAmount,
//         keyId: razorpayKeyId,
//         demoMode: false,
//       });
//     }
//     const demoOrderId = `demo_${Date.now()}_${bookingId}`;
//     await Payment.create({
//       booking: bookingId,
//       user: req.user.id,
//       amount: booking.totalAmount,
//       razorpayOrderId: demoOrderId,
//       status: 'pending',
//     });
//     res.json({
//       success: true,
//       orderId: demoOrderId,
//       amount: booking.totalAmount,
//       keyId: null,
//       demoMode: true,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.verifyPayment = async (req, res, next) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
//     if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
//     if (razorpay_order_id.startsWith('demo_')) {
//       return res.status(400).json({ success: false, message: 'Use demo payment confirmation for this order' });
//     }
//     const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
//     if (!isValid) {
//       payment.status = 'failed';
//       await payment.save();
//       return res.status(400).json({ success: false, message: 'Payment verification failed' });
//     }
//     payment.razorpayPaymentId = razorpay_payment_id;
//     payment.razorpaySignature = razorpay_signature;
//     payment.status = 'completed';
//     await payment.save();
//     const booking = await Booking.findById(payment.booking);
//     if (booking) booking.status = 'confirmed';
//     await booking.save();
//     res.json({ success: true, message: 'Payment verified', payment });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.confirmDemoPayment = async (req, res, next) => {
//   try {
//     const { bookingId } = req.body;
//     const payment = await Payment.findOne({ booking: bookingId, razorpayOrderId: /^demo_/ }).sort('-createdAt');
//     if (!payment) return res.status(404).json({ success: false, message: 'No demo payment found for this booking' });
//     if (payment.user.toString() !== req.user.id) {
//       return res.status(403).json({ success: false, message: 'Not authorized' });
//     }
//     payment.status = 'completed';
//     payment.razorpayPaymentId = 'demo_payment';
//     await payment.save();
//     const booking = await Booking.findById(payment.booking);
//     if (booking) {
//       booking.status = 'confirmed';
//       await booking.save();
//     }
//     res.json({ success: true, message: 'Payment confirmed (demo)', payment });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getPaymentsByBooking = async (req, res, next) => {
//   try {
//     const payments = await Payment.find({ booking: req.params.bookingId });
//     const booking = await Booking.findById(req.params.bookingId);
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
//     if (booking.user.toString() !== req.user.id && booking.owner.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Not authorized' });
//     }
//     res.json({ success: true, payments });
//   } catch (error) {
//     next(error);
//   }
// };



const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const {
  createOrder,
  verifyPayment,
  paymentEnabled
} = require('../services/paymentService');
const { razorpayKeyId } = require('../config/payment');

/**
 * CREATE ORDER
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    const booking = await Booking.findById(bookingId).populate('land');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // 🔥 REAL PAYMENT MODE
    if (paymentEnabled) {
      const order = await createOrder(
        booking.totalAmount,
        'INR',
        `booking_${bookingId}`
      );

      await Payment.create({
        booking: bookingId,
        user: req.user.id,
        amount: booking.totalAmount,
        razorpayOrderId: order.id,
        status: 'pending',
      });

      return res.json({
        success: true,
        orderId: order.id,
        amount: booking.totalAmount,
        keyId: razorpayKeyId,
        demoMode: false,
      });
    }

    // 🔥 DEMO MODE
    const demoOrderId = `demo_${Date.now()}_${bookingId}`;

    await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: booking.totalAmount,
      razorpayOrderId: demoOrderId,
      status: 'pending',
    });

    return res.json({
      success: true,
      orderId: demoOrderId,
      amount: booking.totalAmount,
      keyId: null,
      demoMode: true,
    });

  } catch (error) {
    console.error("🔥 CREATE ORDER ERROR:", error);
    next(error);
  }
};


/**
 * VERIFY REAL RAZORPAY PAYMENT
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Prevent demo misuse
    if (razorpay_order_id.startsWith('demo_')) {
      return res.status(400).json({
        success: false,
        message: 'Use demo verification endpoint',
      });
    }

    const isValid = verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Mark payment completed
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // Update booking safely
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.status = 'paid';
      await booking.save();
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      payment,
    });

  } catch (error) {
    console.error("🔥 VERIFY PAYMENT ERROR:", error);
    next(error);
  }
};


/**
 * CONFIRM DEMO PAYMENT
 */
exports.confirmDemoPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    const payment = await Payment.findOne({
      booking: bookingId,
      razorpayOrderId: /^demo_/
    }).sort('-createdAt');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No demo payment found for this booking',
      });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Mark payment completed
    payment.status = 'completed';
    payment.razorpayPaymentId = 'demo_payment';
    await payment.save();

    // Safely update booking
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.status = 'paid';
      await booking.save();
    }

    return res.json({
      success: true,
      message: 'Demo payment confirmed',
      payment,
    });

  } catch (error) {
    console.error("🔥 DEMO PAYMENT ERROR:", error);
    next(error);
  }
};


/**
 * GET PAYMENTS FOR BOOKING
 */
exports.getPaymentsByBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (
      booking.user.toString() !== req.user.id &&
      booking.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const payments = await Payment.find({
      booking: req.params.bookingId,
    });

    return res.json({
      success: true,
      payments,
    });

  } catch (error) {
    console.error("🔥 GET PAYMENTS ERROR:", error);
    next(error);
  }
};
