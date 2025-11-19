import { tick } from 'svelte';
import type { ActionReturn } from 'svelte/action';

type Target = HTMLElement | string;

interface Attributes {
	newTarget?: Target;
}

export const portal = (element: HTMLElement, target: Target = 'body'): ActionReturn<Target, Attributes> => {
	let targetElem: Target | null;

	const update = async (newTarget: Target) => {
		target = newTarget;

		if (typeof window === 'undefined') throw new Error('Portal can only be used on browser');

		if (typeof target === 'string') {
			targetElem = document.querySelector(target) as HTMLElement;

			if (targetElem === null) {
				await tick();
				targetElem = document.querySelector(target) as HTMLElement;
			}

			if (targetElem === null) {
				throw new Error(`No element found for ${target}`);
			}
		} else if (target instanceof HTMLElement) {
			targetElem = target;
		} else {
			throw new Error(`Received non allowed target type: ${target === null ? 'null' : typeof target}`);
		}

		targetElem.appendChild(element);
		element.hidden = false;
	};

	const destroy = () => {
		if (typeof window === 'undefined') throw new Error('Portal can only be used on browser');

		if (element.parentNode) {
			element.parentNode.removeChild(element);
		}
	};

	update(target);

	return {
		update,
		destroy,
	};
};
