<script lang="ts">
	import type { MilestoneType } from '$lib/types/milestone';

	interface Props {
		fromId: MilestoneType;
		toId: MilestoneType;
		fromY: number;
		toY: number;
	}

	let { fromId, toId, fromY, toY }: Props = $props();

	let fromElement: HTMLElement | null = $state(null);
	let toElement: HTMLElement | null = $state(null);
	let svgPath = $state('');
	let arrowTransform = $state('');

	$effect(() => {
		// Wait for elements to be rendered
		setTimeout(() => {
			fromElement = document.querySelector(`[data-milestone="${fromId}"]`);
			toElement = document.querySelector(`[data-milestone="${toId}"]`);

			if (fromElement && toElement) {
				const fromRect = fromElement.getBoundingClientRect();
				const toRect = toElement.getBoundingClientRect();
				const container = fromElement.closest('.desktop-timeline');

				if (container) {
					const containerRect = container.getBoundingClientRect();

					// Calculate relative positions
					const startX = fromRect.right - containerRect.left;
					const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
					const endX = toRect.left - containerRect.left;
					const endY = toRect.top + toRect.height / 2 - containerRect.top;

					// Control point for bezier curve (middle with vertical offset)
					const controlX = (startX + endX) / 2;
					const controlY = (startY + endY) / 2;

					// Create the path
					svgPath = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

					// Calculate angle for arrow head
					const angle = (Math.atan2(endY - controlY, endX - controlX) * 180) / Math.PI;
					arrowTransform = `translate(${endX}, ${endY}) rotate(${angle})`;
				}
			}
		}, 150);
	});
</script>

<!-- This component doesn't render anything, it's managed by the parent -->
