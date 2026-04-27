import {
	CLOUDINARY_DELIVERY_BASE,
	CLOUDINARY_LIST_URL,
	CLOUDINARY_UPLOAD_PRESET,
	CLOUDINARY_UPLOAD_URL,
	COMPRESSION_MAX_DIMENSION,
	COMPRESSION_QUALITY,
	MAX_UPLOAD_SIZE_BYTES,
} from '$lib/config/cloudinary';

export interface Photo {
	publicId: string;
	format: string;
	width: number;
	height: number;
	createdAt: string;
}

export interface UploadProgress {
	loaded: number;
	total: number;
	percent: number;
}

interface CloudinaryListResource {
	public_id: string;
	format: string;
	width: number;
	height: number;
	created_at: string;
}

interface CloudinaryUploadResponse {
	public_id: string;
	format: string;
	width: number;
	height: number;
	created_at: string;
	secure_url: string;
}

const isHeicLike = (file: File): boolean => /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);

const scaleDimensions = (width: number, height: number, maxDim: number): { width: number; height: number } => {
	if (width <= maxDim && height <= maxDim) return { width, height };
	const ratio = width >= height ? maxDim / width : maxDim / height;
	return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
};

const compressImage = async (file: File): Promise<Blob> => {
	const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	const { width, height } = scaleDimensions(bitmap.width, bitmap.height, COMPRESSION_MAX_DIMENSION);
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		bitmap.close();
		throw new Error('Canvas 2D context not available');
	}
	ctx.drawImage(bitmap, 0, 0, width, height);
	bitmap.close();
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('Image compression returned empty blob'))),
			'image/jpeg',
			COMPRESSION_QUALITY
		);
	});
};

const preparePayload = async (file: File): Promise<Blob | File> => {
	if (isHeicLike(file)) return file;
	try {
		return await compressImage(file);
	} catch {
		return file;
	}
};

const xhrUpload = (formData: FormData, onProgress?: (p: UploadProgress) => void): Promise<CloudinaryUploadResponse> =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', (e) => {
			if (e.lengthComputable && onProgress) {
				onProgress({ loaded: e.loaded, total: e.total, percent: (e.loaded / e.total) * 100 });
			}
		});
		xhr.addEventListener('load', () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResponse);
				} catch {
					reject(new Error('Invalid Cloudinary response'));
				}
			} else {
				reject(new Error(`Upload failed (HTTP ${xhr.status})`));
			}
		});
		xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
		xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
		xhr.open('POST', CLOUDINARY_UPLOAD_URL);
		xhr.send(formData);
	});

export const uploadPhoto = async (file: File, onProgress?: (p: UploadProgress) => void): Promise<Photo> => {
	if (file.size > MAX_UPLOAD_SIZE_BYTES) {
		throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB)`);
	}
	const payload = await preparePayload(file);
	const formData = new FormData();
	formData.append('file', payload, file.name);
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
	const response = await xhrUpload(formData, onProgress);
	return {
		publicId: response.public_id,
		format: response.format,
		width: response.width,
		height: response.height,
		createdAt: response.created_at,
	};
};

export const listPhotos = async (): Promise<Photo[]> => {
	const response = await fetch(`${CLOUDINARY_LIST_URL}?_=${Date.now()}`, { cache: 'no-store' });
	if (response.status === 404) return [];
	if (!response.ok) throw new Error(`List failed (HTTP ${response.status})`);
	const data = (await response.json()) as { resources: CloudinaryListResource[] };
	return data.resources
		.map((r) => ({
			publicId: r.public_id,
			format: r.format,
			width: r.width,
			height: r.height,
			createdAt: r.created_at,
		}))
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const thumbnailUrl = (photo: Photo, size = 400): string =>
	`${CLOUDINARY_DELIVERY_BASE}/c_fill,w_${size},h_${size},q_auto,f_auto/${photo.publicId}.${photo.format}`;

export const fullUrl = (photo: Photo, maxWidth = 2000): string =>
	`${CLOUDINARY_DELIVERY_BASE}/c_limit,w_${maxWidth},q_auto,f_auto/${photo.publicId}.${photo.format}`;
