export const CLOUDINARY_CLOUD_NAME = 'dmedqihzn';
export const CLOUDINARY_UPLOAD_PRESET = 'wedding_unsigned';
export const CLOUDINARY_GALLERY_TAG = 'wedding-2026';

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
export const CLOUDINARY_LIST_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/${CLOUDINARY_GALLERY_TAG}.json`;
export const CLOUDINARY_DELIVERY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const COMPRESSION_MAX_DIMENSION = 2000;
export const COMPRESSION_QUALITY = 0.85;

export const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';
