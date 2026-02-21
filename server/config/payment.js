// const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
// const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// module.exports = {
//   razorpayKeyId,
//   razorpayKeySecret,
//   paymentEnabled: !!(razorpayKeyId && razorpayKeySecret),
// };


const razorpayKeyId = process.env.RAZORPAY_KEY_ID || null;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || null;

const paymentEnabled =
  !!razorpayKeyId &&
  !!razorpayKeySecret;

module.exports = {
  razorpayKeyId,
  razorpayKeySecret,
  paymentEnabled,
};
