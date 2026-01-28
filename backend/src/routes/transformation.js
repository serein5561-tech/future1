const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middleware/auth');
const transformationController = require('../controllers/transformationController');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload and transform image
router.post(
  '/transform',
  authenticate,
  upload.single('image'),
  transformationController.uploadAndTransformImage
);

// Get transformation status
router.get('/:transformationId', authenticate, transformationController.getTransformation);

// Get all user transformations
router.get('/', authenticate, transformationController.getUserTransformations);

module.exports = router;
