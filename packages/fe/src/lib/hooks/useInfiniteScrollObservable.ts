import { get, type Writable } from 'svelte/store';

import type { ActionReturn } from 'svelte/action';

type InfiniteScrollObservableProps = {
	loadingElem?: string;
	currentItems: Writable<number>;
	totalItems: Writable<number>;
	cb: Writable<() => void>;
};

export const infiniteScrollObservable = (
	node: HTMLElement,
	{ loadingElem, currentItems, totalItems, cb }: InfiniteScrollObservableProps
): ActionReturn<InfiniteScrollObservableProps> => {
	let cbCalled = false;

	const createObserver = (): IntersectionObserver => {
		return new IntersectionObserver(
			async (entries) => {
				for (const entry of entries) {
					const loadMore = get(currentItems) < get(totalItems);

					if (!loadMore || !entry.isIntersecting || cbCalled) return;

					cbCalled = true;
					get(cb)();
					cbCalled = false;
				}
			},
			{
				root: null,
				rootMargin: '0px',
				threshold: 0,
			}
		);
	};

	const observerInstance = createObserver();

	const loadingEl = Array.from(node.children).find((child) => child.id === (loadingElem ?? 'loading-elem'));

	if (!loadingEl) {
		console.error('Loading element not found');
		return {
			destroy: () => {},
		};
	}

	observerInstance.observe(loadingEl);

	return {
		destroy: () => {
			if (!loadingEl) return;

			observerInstance.unobserve(loadingEl);
		},
	};
};
