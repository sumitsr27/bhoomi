const express = require('express');
const router = express.Router();
const {
  createLand,
  getAllLands,
  getLandById,
  getMyLands,
  updateLand,
  deleteLand,
  uploadImages,
} = require('../controllers/landController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/', getAllLands);
router.get('/my-lands', protect, getMyLands);
router.get('/:id', getLandById);
router.post('/', protect, createLand);
router.put('/:id', protect, updateLand);
router.delete('/:id', protect, deleteLand);
router.post('/:id/images', protect, upload.array('images', 5), uploadImages);

module.exports = router;
