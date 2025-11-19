let intersecObsv: IntersectionObserver;

export const lazyLoad = (
	imageElem: HTMLImageElement,
	{
		src,
		placeHolder,
		observerOptions = {
			root: null,
			rootMargin: '0px',
			threshold: 0,
		},
	}: {
		src: string;
		placeHolder: string;
		observerOptions?: IntersectionObserverInit;
	}
) => {
	const imageLoaded = () => {
		imageElem.style.filter = 'blur(0px)';
	};

	intersecObsv = new IntersectionObserver((entries, observer) => {
		if (entries.length === 0 || (entries.length !== 0 && !entries[0].isIntersecting)) return;

		if (imageElem.complete) {
			imageLoaded();
			imageElem.setAttribute('src', src);
			observer.unobserve(imageElem);
		} else {
			imageElem.setAttribute('src', placeHolder);
			imageElem.addEventListener('load', imageLoaded);
		}
	}, observerOptions);

	intersecObsv.observe(imageElem);

	return {
		destroy() {
			imageElem.removeEventListener('load', imageLoaded);
			intersecObsv.unobserve(imageElem);
		},
	};
};
