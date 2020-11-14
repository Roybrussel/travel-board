const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

//Cloud nog aanamaken
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-travel-pictures',
    allowedFormats: ['jpg', 'png'], // Kunnen we eventueel uitbreiden
    use_filename: true,
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
