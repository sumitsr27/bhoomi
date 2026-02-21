const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const cloudinary = require('cloudinary').v2;

// Read and trim env vars (removes \r, spaces; .env on Windows can have CRLF)
const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

const isPlaceholder = (v) => !v || v === 'xxxxx' || v.toLowerCase() === 'your_cloud_name';
const cloudinaryEnabled =
  !isPlaceholder(cloudName) && !isPlaceholder(apiKey) && !isPlaceholder(apiSecret);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  console.log(`Cloudinary configured with cloud_name: ${cloudName}`);
} else {
  console.log('Cloudinary disabled (missing or placeholder env: CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET). Using local uploads.');
}

module.exports = cloudinary;
module.exports.cloudinaryEnabled = cloudinaryEnabled;
