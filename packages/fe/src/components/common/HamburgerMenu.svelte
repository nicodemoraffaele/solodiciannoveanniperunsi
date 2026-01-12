<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	let isOpen = $state(false);

	const toggleMenu = () => {
		isOpen = !isOpen;
	};

	const closeMenu = () => {
		isOpen = false;
	};

	const menuItems = [
		{ href: `${base}/`, label: 'Home' },
		{ href: `${base}/cerimonia`, label: 'Cerimonia' },
		{ href: `${base}/ricevimento`, label: 'Ricevimento' },
		{ href: `${base}/rsvp`, label: 'RSVP' },
	];

	const isActive = (href: string) => {
		const currentPath = $page.url.pathname;
		if (href === `${base}/`) {
			return currentPath === `${base}/` || currentPath === base;
		}
		return currentPath.startsWith(href);
	};
</script>

<!-- Hamburger Button -->
<button
	class="hamburger-button"
	onclick={toggleMenu}
	aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
	aria-expanded={isOpen}
>
	<span class="hamburger-line" class:open={isOpen}></span>
	<span class="hamburger-line" class:open={isOpen}></span>
	<span class="hamburger-line" class:open={isOpen}></span>
</button>

<!-- Overlay -->
{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="menu-overlay" onclick={closeMenu} onkeydown={closeMenu}></div>
{/if}

<!-- Slide-out Menu -->
<nav class="menu-panel" class:open={isOpen}>
	<div class="menu-header">
		<span class="menu-title">Menu</span>
		<button class="close-button" onclick={closeMenu} aria-label="Chiudi menu">
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<ul class="menu-list">
		{#each menuItems as item}
			<li>
				<a href={item.href} class="menu-item" class:active={isActive(item.href)} onclick={closeMenu}>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.hamburger-button {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		width: 44px;
		height: 44px;
		padding: 8px;
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid #d5cec5;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(90, 107, 95, 0.15);
	}

	.hamburger-button:hover {
		background: #ffffff;
		box-shadow: 0 4px 12px rgba(90, 107, 95, 0.2);
	}

	.hamburger-line {
		width: 24px;
		height: 2px;
		background-color: #7a8b7f;
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	.hamburger-line.open:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger-line.open:nth-child(2) {
		opacity: 0;
	}

	.hamburger-line.open:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	.menu-overlay {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(2px);
		animation: fadeIn 0.3s ease;
	}

	.menu-panel {
		position: fixed;
		top: 0;
		right: -300px;
		z-index: 95;
		width: 280px;
		max-width: 80vw;
		height: 100vh;
		background: linear-gradient(to bottom, #fafaf8 0%, #f5f1ed 100%);
		border-left: 2px solid #d5cec5;
		box-shadow: -4px 0 20px rgba(90, 107, 95, 0.15);
		transition: right 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	.menu-panel.open {
		right: 0;
	}

	.menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid #e8e5e1;
	}

	.menu-title {
		font-family: 'Pinyon Script', cursive;
		font-size: 1.8rem;
		color: #7a8b7f;
	}

	.close-button {
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: #8b9f8c;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: #e8e5e1;
		color: #7a8b7f;
	}

	.menu-list {
		list-style: none;
		padding: 1rem 0;
		margin: 0;
		flex: 1;
	}

	.menu-item {
		display: block;
		padding: 1rem 1.5rem;
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.2rem;
		color: #5a6b5f;
		text-decoration: none;
		transition: all 0.2s ease;
		border-left: 3px solid transparent;
	}

	.menu-item:hover {
		background: rgba(122, 139, 127, 0.1);
		color: #7a8b7f;
		border-left-color: #c17557;
	}

	.menu-item.active {
		background: rgba(122, 139, 127, 0.15);
		color: #7a8b7f;
		border-left-color: #c17557;
		font-weight: 600;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
