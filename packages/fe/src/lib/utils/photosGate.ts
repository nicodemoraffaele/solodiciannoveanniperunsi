export const PHOTOS_RELEASE_DATE = new Date('2026-06-20T08:00:00+02:00');

const isPreviewMode = (): boolean => {
	if (typeof window === 'undefined') return false;
	return new URLSearchParams(window.location.search).has('preview');
};

export const photosAvailable = (now: Date = new Date()): boolean => {
	if (isPreviewMode()) return true;
	return now.getTime() >= PHOTOS_RELEASE_DATE.getTime();
};
