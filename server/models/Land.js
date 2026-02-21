const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    area: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['sqft', 'sqm', 'acre', 'hectare'], default: 'sqft' },
    },
    pricePerMonth: {
      type: Number,
      required: [true, 'Please provide rent per month'],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    features: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['agricultural', 'residential', 'commercial', 'industrial', 'other'],
      default: 'agricultural',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Land', landSchema);
