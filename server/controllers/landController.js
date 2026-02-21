const path = require('path');
const fs = require('fs');
const Land = require('../models/Land');
const cloudinary = require('../config/cloudinary');
const { uploadLandImage, cloudinaryEnabled } = require('../utils/uploadHelper');

exports.createLand = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    const land = await Land.create(req.body);
    res.status(201).json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

exports.getAllLands = async (req, res, next) => {
  try {
    const { category, city, minPrice, maxPrice, available } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.pricePerMonth = {};
      if (minPrice) filter.pricePerMonth.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerMonth.$lte = Number(maxPrice);
    }
    if (available !== undefined) filter.isAvailable = available === 'true';
    const lands = await Land.find(filter).populate('owner', 'name email phone').sort('-createdAt');
    res.json({ success: true, count: lands.length, lands });
  } catch (error) {
    next(error);
  }
};

exports.getLandById = async (req, res, next) => {
  try {
    const land = await Land.findById(req.params.id).populate('owner', 'name email phone');
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });
    res.json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

exports.getMyLands = async (req, res, next) => {
  try {
    const lands = await Land.find({ owner: req.user.id }).sort('-createdAt');
    res.json({ success: true, lands });
  } catch (error) {
    next(error);
  }
};

exports.updateLand = async (req, res, next) => {
  try {
    let land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });
    if (land.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    land = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, land });
  } catch (error) {
    next(error);
  }
};

exports.deleteLand = async (req, res, next) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ success: false, message: 'Land not found' });
    if (land.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (land.images?.length) {
      for (const img of land.images) {
        if (img.publicId && cloudinaryEnabled) {
          try { await cloudinary.uploader.destroy(img.publicId); } catch (e) { /* ignore */ }
        }
        if (img.url?.startsWith('/uploads/')) {
          const p = path.join(__dirname, '..', img.url);
          try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch (e) { /* ignore */ }
        }
      }
    }
    await land.deleteOne();
    res.json({ success: true, message: 'Land deleted' });
  } catch (error) {
    next(error);
  }
};

// exports.uploadImages = async (req, res, next) => {
//   try {
//     const land = await Land.findById(req.params.id);
//     if (!land) return res.status(404).json({ success: false, message: 'Land not found' });
//     if (land.owner.toString() !== req.user.id) {
//       return res.status(403).json({ success: false, message: 'Not authorized' });
//     }
//     if (!req.files?.length) {
//       return res.status(400).json({ success: false, message: 'No images uploaded' });
//     }
//     const newImages = await Promise.all(req.files.map((file) => uploadLandImage(file.path)));
//     land.images = land.images || [];
//     land.images.push(...newImages);
//     await land.save();
//     res.json({ success: true, land });
//   } catch (error) {
//     next(error);
//   }
// };


exports.uploadImages = async (req, res, next) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land)
      return res.status(404).json({ success: false, message: "Land not found" });

    if (land.owner.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: "No images uploaded" });

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadLandImage(file.path);

      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
      });

      // delete local temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    // 🔥 IMPORTANT: push into existing images array
    land.images.push(...uploadedImages);

    await land.save();

    res.json({
      success: true,
      images: land.images,
    });

  } catch (error) {
    next(error);
  }
};
