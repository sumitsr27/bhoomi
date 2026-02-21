const crypto = require('crypto');
const { razorpayKeyId, razorpayKeySecret, paymentEnabled } = require('../config/payment');

let razorpay = null;
if (paymentEnabled) {
  const Razorpay = require('razorpay');
  razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

const createOrder = async (amount, currency = 'INR', receipt) => {
  if (!paymentEnabled) return null;
  const options = {
    amount: amount * 100,
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  return order;
};

const verifyPayment = (orderId, paymentId, signature) => {
  if (!paymentEnabled) return false;
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(body.toString())
    .digest('hex');
  return expectedSignature === signature;
};

module.exports = { createOrder, verifyPayment, razorpay, paymentEnabled };
