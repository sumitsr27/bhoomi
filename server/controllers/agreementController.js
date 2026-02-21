const Agreement = require('../models/Agreement');
const Booking = require('../models/Booking');
const { generateAgreementPDF } = require('../utils/pdfGenerator');
const { uploadPdfBuffer } = require('../utils/uploadHelper');

exports.createAgreement = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.body.bookingId)
      .populate('land')
      .populate('user', 'name')
      .populate('owner', 'name');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    // if (booking.status !== 'confirmed') {
    //   return res.status(400).json({ success: false, message: 'Booking must be confirmed first' });
    // }

    if (!['confirmed', 'paid'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking must be confirmed or paid first'
      });
    }

    let agreement = await Agreement.findOne({ booking: booking._id });
    if (agreement) return res.json({ success: true, agreement });

    const land = booking.land;
    const agreementData = {
      ownerName: booking.owner.name,
      tenantName: booking.user.name,
      landTitle: land.title,
      landLocation: `${land.location.address}, ${land.location.city}, ${land.location.state}`,
      rentPerMonth: land.pricePerMonth,
      startDate: booking.startDate.toLocaleDateString(),
      endDate: booking.endDate.toLocaleDateString(),
    };

    const pdfBuffer = await generateAgreementPDF(agreementData);
    const pdfUrl = await uploadPdfBuffer(pdfBuffer, 'agreements', `agreement-${booking._id}`);

    agreement = await Agreement.create({
      booking: booking._id,
      land: land._id,
      tenant: booking.user._id,
      owner: booking.owner._id,
      pdfUrl: pdfUrl || '',
    });
    const populated = await Agreement.findById(agreement._id)
      .populate('booking')
      .populate('land')
      .populate('tenant', 'name email')
      .populate('owner', 'name email');
    res.status(201).json({ success: true, agreement: populated });
   

  } catch (error) {
    next(error);
  }
};

exports.getAgreementByBooking = async (req, res, next) => {
  try {
    const agreement = await Agreement.findOne({ booking: req.params.bookingId })
      .populate('booking')
      .populate('land')
      .populate('tenant', 'name email')
      .populate('owner', 'name email');
    if (!agreement) return res.status(404).json({ success: false, message: 'Agreement not found' });
    if (
      agreement.tenant._id.toString() !== req.user.id &&
      agreement.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, agreement });
  } catch (error) {
    next(error);
  }
};

exports.signAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) return res.status(404).json({ success: false, message: 'Agreement not found' });
    if (agreement.tenant.toString() === req.user.id) {
      agreement.signedByTenant = true;
    } else if (agreement.owner.toString() === req.user.id) {
      agreement.signedByOwner = true;
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (agreement.signedByTenant && agreement.signedByOwner) {
      agreement.signedAt = new Date();
    }
    await agreement.save();
    const updated = await Agreement.findById(agreement._id)
      .populate('booking')
      .populate('land')
      .populate('tenant', 'name email')
      .populate('owner', 'name email');
    res.json({ success: true, agreement: updated });
  } catch (error) {
    next(error);
  }
};
