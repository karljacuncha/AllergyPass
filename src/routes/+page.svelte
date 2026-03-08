<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { profiles } from '$lib/stores/settings';
	
	onMount(() => {
		// Route based on whether profiles exist
		if ($profiles.length > 0) {
			goto('/cards');
		} else {
			goto('/settings');
		}
	});
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
	<p class="text-gray-500">Loading...</p>
</div>
