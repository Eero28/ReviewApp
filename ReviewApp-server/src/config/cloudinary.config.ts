import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from 'dotenv';

config();

// Cloudinary initialization
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Utility function for generating unique public IDs
const getPublicId = (file: Express.Multer.File) => {
  const baseName = file.originalname.split('.')[0];
  return `${baseName}-${Date.now()}`;
};

// Avatar storage
export const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
    public_id: getPublicId(file),
  }),
});

// Review storage
export const reviewStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'reviews',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: getPublicId(file),
  }),
});
