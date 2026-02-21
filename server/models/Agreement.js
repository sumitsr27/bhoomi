const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    land: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Land',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    signedByTenant: {
      type: Boolean,
      default: false,
    },
    signedByOwner: {
      type: Boolean,
      default: false,
    },
    signedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agreement', agreementSchema);
