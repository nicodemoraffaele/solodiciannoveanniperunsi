<script lang="ts">
	import { base } from '$app/paths';
	import { LL } from '$lib/i18n/i18n-svelte';

	const reception = $LL.milestones.wedding.reception;
	let isMobile = $state(false);
	let isTablet = $state(false);
	// Detect viewport size on mount and window resize
	$effect(() => {
		const checkViewport = () => {
			const width = window.innerWidth;
			isMobile = width < 768;
			isTablet = width >= 768 && width < 1200;
		};

		checkViewport();
		window.addEventListener('resize', checkViewport);

		return () => {
			window.removeEventListener('resize', checkViewport);
		};
	});
</script>

<svelte:head>
	<title>Fattoria Cerreto a Merse, Borgo di Recenza</title>
</svelte:head>

<div class="overflow-hidden">
	<div class="mx-auto px-4">
		<div class="font-cormorand border-champagne rounded-xl border-2 p-6 font-medium">
			<div class="mb-4 flex items-center gap-2">
				<svg class="color-champagne h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-800">{reception.title()}</h3>
			</div>

			<div class="space-y-2 text-base">
				<p class="font-medium text-gray-800">{reception.name()}</p>
				<p class="color-champagne font-semibold">{reception.time()} dopo la cerimonia</p>
				<p class="link pb-2">
					<a href="https://maps.app.goo.gl/FYndqZXnka64bCCP9" target="_blank">{reception.address()}</a>
				</p>
			</div>

			<iframe
				title="fattoria cerreto"
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d986.1917063468597!2d11.254698508798246!3d43.16430555556684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132981b150d1c39d%3A0x6f21d5a6c91a3e2d!2sFattoria%20Cerreto%20a%20Merse!5e1!3m2!1sit!2sit!4v1768260664476!5m2!1sit!2sit"
				width={isMobile ? 320 : isTablet ? 800 : 1000}
				height={isMobile ? 300 : isTablet ? 600 : 800}
				allowfullscreen
				style="border:0;"
				frameborder="0"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
			<p class="text-grey-800 pt-2">
				<strong>Nota bene:</strong> Seguire le indicazioni per Fattoria Cerreto e Merse e NON per Borgo di Recenza.
				Gli ultimi 7km sono su una strada bianca sterrata. Dopo il ponticino di ferro, 200m dopo, sulla sinistra
				inizia la strada sterrata.Seguite cartelli Fattoria Cerreto a Merse.
			</p>
			<p class="text-grey-800 pt-2">
				<strong>Nota bene bene:</strong> Siccome c'è una strada sterrata, potete anche non lavare l'auto
			</p>
			<img src="strada_recenza.jpg" alt="Strada Fattoria Cerreto a Merse" />
		</div>
	</div>
</div>

<style>
	.font-cormorand {
		font-family: 'Cormorant Garamond', serif;
		color: #5a6b5f;
		line-height: 1.8;
		font-size: 1.05rem;
	}

	.link a {
		color: #5a6b5f;
		text-decoration: underline;
	}

	.border-champagne {
		border-color: #c17557;
	}

	.color-champagne {
		color: #c17557;
	}
</style>
