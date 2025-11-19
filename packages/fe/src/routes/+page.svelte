<script lang="ts">
	import TimelineContainer from '$components/routes-component/home/timeline/TimelineContainer.svelte';
	import { LL } from '$lib/i18n/i18n-svelte';
</script>

<svelte:head>
	<title>{$LL.siteTitle()} - {$LL.weddingDate()}</title>
</svelte:head>

<div class="fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
	<div class="h-full overflow-y-auto">
		<div class="container mx-auto px-4 py-8">
			<!-- Header -->
			<header class="py-12 text-center md:py-20">
				<h1 class="animate-fadeInUp mb-4 font-serif text-5xl text-gray-800 md:text-7xl lg:text-8xl">
					{$LL.siteTitle()}
				</h1>
				<p class="animate-fadeInUp text-xl font-light text-gray-600 md:text-2xl" style="animation-delay: 0.2s;">
					{$LL.weddingDate()}
				</p>
			</header>

			<!-- Timeline -->
			<main class="py-8 md:py-12">
				<TimelineContainer />
			</main>
		</div>
	</div>
</div>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeInUp {
		animation: fadeInUp 0.8s ease-out forwards;
		opacity: 0;
	}
</style>
