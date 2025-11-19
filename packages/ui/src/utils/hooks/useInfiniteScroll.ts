import type { ActionReturn } from 'svelte/action';
import { get, type Writable } from 'svelte/store';

interface InfiniteScrollProps {
	currentItems: Writable<number>;
	totalItems: Writable<number>;
	cb: Writable<() => void>;
}

export const infiniteScroll = (
	node: HTMLElement,
	{ currentItems, totalItems, cb }: InfiniteScrollProps
): ActionReturn<InfiniteScrollProps> => {
	const onScroll = (event: Event) => {
		const loadMore = get(currentItems) < get(totalItems);

		if (!loadMore) return;

		const reachedScrollEnd =
			Math.abs(
				(event.target as HTMLElement).scrollHeight -
					(event.target as HTMLElement).clientHeight -
					(event.target as HTMLElement).scrollTop
			) < 1;

		if (!reachedScrollEnd) return;

		get(cb)();
	};

	node.addEventListener('scroll', onScroll);

	return {
		destroy: () => {},
	};
};
