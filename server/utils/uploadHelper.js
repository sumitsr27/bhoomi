const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const cloudinaryEnabled = cloudinary.cloudinaryEnabled;

const uploadsDir = path.join(__dirname, '..', 'uploads');

async function uploadImageToCloudinary(filePath, folder) {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return { url: result.secure_url, publicId: result.public_id };
}

function uploadImageLocal(filePath, subdir) {
  const dir = path.join(uploadsDir, subdir);
  const ext = path.extname(filePath) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dest = path.join(dir, filename);
  fs.copyFileSync(filePath, dest);
  return { url: `/uploads/${subdir}/${filename}`, publicId: null };
}

async function uploadLandImage(filePath) {
  if (cloudinaryEnabled) {
    try {
      return await uploadImageToCloudinary(filePath, 'bhoomirental/lands');
    } catch (err) {
      console.warn('Cloudinary upload failed, using local:', err.message);
    }
  }
  return uploadImageLocal(filePath, 'lands');
}

async function uploadPdfBuffer(buffer, subdir, baseName) {
  if (cloudinaryEnabled) {
    try {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `bhoomirental/${subdir}`, resource_type: 'raw' },
          (err, result) => (err ? reject(err) : resolve(result?.secure_url))
        );
        stream.end(buffer);
      });
    } catch (err) {
      console.warn('Cloudinary PDF upload failed, using local:', err.message);
    }
  }
  const dir = path.join(uploadsDir, subdir);
  const filename = `${baseName}-${Date.now()}.pdf`;
  const dest = path.join(dir, filename);
  fs.writeFileSync(dest, buffer);
  return `/uploads/${subdir}/${filename}`;
}

module.exports = { uploadLandImage, uploadPdfBuffer, cloudinaryEnabled };
