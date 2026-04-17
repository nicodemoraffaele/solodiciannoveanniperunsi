<script lang="ts">
	import { LL } from '$lib/i18n/i18n-svelte';

	const honeymoon = $LL.milestones.honeymoon;

	let ibanCopied = $state(false);

	const copyIban = async () => {
		try {
			await navigator.clipboard.writeText(honeymoon.ibanValue());
			ibanCopied = true;
			setTimeout(() => {
				ibanCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy IBAN:', err);
		}
	};
</script>

<svelte:head>
	<title>Il regalo più grande - Sara e Raffaele</title>
</svelte:head>

<div class="overflow-hidden">
	<div class="mx-auto px-4">
		<div class="font-cormorand border-champagne rounded-xl border-2 font-medium">
			<div class="rounded-xl from-amber-50 to-orange-50 p-6">
				<div class="mb-4 flex items-center gap-2">
					<svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
						/>
					</svg>
					<h3 class="text-xl font-semibold text-gray-800">{honeymoon.giftMessage()}</h3>
				</div>

				<p class="mb-6 leading-relaxed text-gray-700">{honeymoon.giftDescription()}</p>

				<!-- IBAN section -->
				<div class="rounded-lg bg-white p-2 shadow-sm">
					<p class="ibanLabel mb-2 text-base font-medium text-gray-600">{honeymoon.ibanLabel()}</p>

					<div class="ibanContainer flex items-center gap-2">
						<code
							class="flex-1 rounded bg-gray-100 px-3 py-2 font-mono text-base font-semibold text-gray-800"
						>
							{honeymoon.ibanValue()}
						</code>

						<button
							onclick={copyIban}
							class="rounded-lg bg-amber-600 px-4 py-2 text-base font-medium text-white transition-all hover:bg-amber-700 active:scale-95"
							aria-label={$LL.ui.copyIban()}
						>
							{#if ibanCopied}
								<span class="flex items-center gap-1">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									{$LL.ui.ibanCopied()}
								</span>
							{:else}
								<span class="flex items-center gap-1">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									{$LL.ui.copyIban()}
								</span>
							{/if}
						</button>
					</div>

					<p class="ibanLabel mt-2 text-xs text-gray-500">{honeymoon.ibanNote()}</p>
				</div>
			</div>
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

	.border-champagne {
		border-color: #c17557;
	}

	.ibanContainer {
		flex-direction: column;
		align-items: flex-start;
	}

	.ibanContainer code {
		font-size: 0.9rem;
	}

	.ibanLabel {
		font-size: 0.9rem;
		padding-left: 0.7rem;
	}
</style>
