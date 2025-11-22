<script lang="ts">
	import DatePopup from '$components/common/popup/DatePopup.svelte';
	import type { WeddingLocation } from '$lib/types/milestone';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		date: string;
		title: string;
		description: string;
		church: WeddingLocation;
		reception: WeddingLocation;
	}

	let { isOpen = false, onClose, date, title, description, church, reception }: Props = $props();
</script>

<DatePopup {isOpen} {onClose} {title} {date} size="large">
	<!-- Main description -->
	<p class="mb-8 text-lg leading-relaxed">{description}</p>

	<!-- Church and Reception sections -->
	<div class="grid gap-8 md:grid-cols-2">
		<!-- Church Section -->
		<div class="rounded-xl border-2 border-pink-200 bg-pink-50/50 p-6">
			<div class="mb-4 flex items-center gap-2">
				<svg class="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-800">{church.title}</h3>
			</div>

			{#if church.imageUrl}
				<div class="mb-4 rounded-lg">
					<img src={church.imageUrl} alt={church.name} class="h-48 w-full object-cover" />
				</div>
			{/if}

			<div class="space-y-2 text-base">
				<p class="font-medium text-gray-800">{church.name}</p>
				<p class="text-gray-600">{church.address}</p>
				<p class="font-semibold text-pink-600">{church.time}</p>
			</div>

			<p class="mt-4 text-base leading-relaxed text-gray-700">{church.description}</p>
		</div>

		<!-- Reception Section -->
		<div class="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-6">
			<div class="mb-4 flex items-center gap-2">
				<svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					/>
				</svg>
				<h3 class="text-xl font-semibold text-gray-800">{reception.title}</h3>
			</div>

			{#if reception.imageUrl}
				<div class="mb-4 rounded-lg">
					<img src={reception.imageUrl} alt={reception.name} class="h-48 w-full object-cover" />
				</div>
			{/if}

			<div class="space-y-2 text-base">
				<p class="font-medium text-gray-800">{reception.name}</p>
				<p class="text-gray-600">{reception.address}</p>
				<p class="font-semibold text-purple-600">{reception.time}</p>
			</div>

			<p class="mt-4 text-base leading-relaxed text-gray-700">{reception.description}</p>
		</div>
	</div>

	<!-- RSVP Section -->
	<div class="mt-8 rounded-xl border-2 bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center" style="border-color: #C17557;">
		<h3 class="mb-3 text-2xl font-semibold" style="font-family: 'Pinyon Script', cursive; color: #7A8B7F;">
			Conferma la tua presenza
		</h3>
		<p class="mb-6 text-base leading-relaxed" style="font-family: 'Cormorant Garamond', serif; color: #5A6B5F;">
			Saremmo felici di averti con noi in questo giorno speciale. Ti preghiamo di confermare la tua presenza e comunicarci eventuali esigenze alimentari.
		</p>
		<a
			href="/rsvp"
			class="inline-block rounded-full px-8 py-3 text-lg font-semibold text-white transition-all hover:shadow-lg"
			style="background: linear-gradient(135deg, #7A8B7F 0%, #8B9F8C 100%); font-family: 'Cormorant Garamond', serif;"
		>
			Compila il modulo RSVP
		</a>
	</div>
</DatePopup>
