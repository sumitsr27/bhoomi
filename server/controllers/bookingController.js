const Booking = require('../models/Booking');
const Land = require('../models/Land');

exports.createBooking = async (req, res, next) => {
  try {
    const land = await Land.findById(req.body.land);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });
    if (!land.isAvailable) {
      return res.status(400).json({ success: false, message: 'Land is not available' });
    }
    const { startDate, endDate, notes } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)) || 1;
    const totalAmount = land.pricePerMonth * months;
    const booking = await Booking.create({
      land: land._id,
      user: req.user.id,
      owner: land.owner,
      startDate: start,
      endDate: end,
      totalAmount,
      notes,
    });
    const populated = await Booking.findById(booking._id)
      .populate('land')
      .populate('owner', 'name email phone');
    res.status(201).json({ success: true, booking: populated });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const filter = req.user.role === 'owner' ? { owner: req.user.id } : { user: req.user.id };
    const bookings = await Booking.find(filter)
      .populate('land')
      .populate('user', 'name email')
      .populate('owner', 'name email')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('land')
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (
      booking.user._id.toString() !== req.user.id &&
      booking.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    booking.status = req.body.status || booking.status;
    if (booking.status === 'confirmed') {
      const Land = require('../models/Land');
      await Land.findByIdAndUpdate(booking.land, { isAvailable: false });
    }
    await booking.save();
    const updated = await Booking.findById(booking._id)
      .populate('land')
      .populate('user', 'name email')
      .populate('owner', 'name email');
    res.json({ success: true, booking: updated });
  } catch (error) {
    next(error);
  }
};
