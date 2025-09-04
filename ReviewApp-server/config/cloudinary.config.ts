import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
    public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
  }),
});

export const reviewStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'reviews',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      {
        width: 600,
        height: 600,
        crop: 'limit',
        quality: 'auto:good',
      },
    ],
    public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
  }),
});
