<script>
	import { goto } from '$app/navigation';
	import { interfaceLanguage, cardLanguageShortlist, activeCardLanguage, profiles, activeProfileId } from '$lib/stores/settings';
	import AllergyCard from '$lib/components/AllergyCard.svelte';
	import languagesData from '$lib/data/languages.json';
	import allergiesData from '$lib/data/allergies.json';
	
	const allergyIcons = Object.fromEntries(allergiesData.allergies.map(a => [a.id, a.icon]));
	
	let uiTranslation = {};
	let cardTranslation = {};
	let currentTab = 'info';
	let langDropdownOpen = false;
	let profileDropdownOpen = false;
	
	$: if ($interfaceLanguage) {
		import(`$lib/data/translations/${$interfaceLanguage}.json`).then(m => { uiTranslation = m.default; });
	}
	
	$: if ($activeCardLanguage) {
		import(`$lib/data/translations/${$activeCardLanguage}.json`).then(m => { cardTranslation = m.default; });
	}
	
	$: activeProfile = $profiles.find(p => p.id === $activeProfileId) || $profiles[0] || null;
	$: selectedAllergies = activeProfile?.allergies || [];
	
	const tabs = [
		{ id: 'info', icon: '🏷️', color: 'blue' },
		{ id: 'dining', icon: '🍽️', color: 'amber' },
		{ id: 'pharmacy', icon: '💊', color: 'green' },
		{ id: 'emergency', icon: '🚨', color: 'red' }
	];
	
	const tabColors = {
		blue: { active: 'bg-blue-500 text-white border-blue-500', inactive: 'bg-white text-blue-500 border-blue-200 hover:bg-blue-50' },
		amber: { active: 'bg-amber-500 text-white border-amber-500', inactive: 'bg-white text-amber-500 border-amber-200 hover:bg-amber-50' },
		green: { active: 'bg-green-600 text-white border-green-600', inactive: 'bg-white text-green-600 border-green-200 hover:bg-green-50' },
		red: { active: 'bg-red-600 text-white border-red-600', inactive: 'bg-white text-red-600 border-red-200 hover:bg-red-50' }
	};
	
	const cardBorder = { info: 'border-blue-300', dining: 'border-amber-300', pharmacy: 'border-green-400', emergency: 'border-red-500' };
	
	function closeDropdowns() {
		langDropdownOpen = false;
		profileDropdownOpen = false;
	}
</script>

<svelte:head>
	<title>{uiTranslation.ui?.appTitle || 'AllergyPass'}</title>
</svelte:head>

<svelte:window on:click={closeDropdowns} />

<div class="min-h-screen bg-gray-100 flex flex-col">
	<div class="max-w-2xl mx-auto w-full flex flex-col flex-1 p-3 gap-3">
		
		<!-- Top bar -->
		<div class="bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-2">
			<svg class="w-6 h-6 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<circle cx="12" cy="12" r="10" stroke-width="2"/>
				<line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
				<line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
			</svg>
			<div class="flex flex-wrap gap-2 flex-1">
				{#each selectedAllergies as allergyId}
					<span class="text-2xl" title={cardTranslation.allergies?.[allergyId]}>
						{allergyIcons[allergyId]}
					</span>
				{/each}
			</div>
			<button on:click={() => goto('/settings')} class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<circle cx="12" cy="12" r="3" stroke-width="2"/>
					<path d="M12 1v6m0 6v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M1 12h6m6 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24" stroke-width="2"/>
				</svg>
			</button>
		</div>
		
		<!-- Tab bar -->
		<div class="grid grid-cols-4 gap-2">
			{#each tabs as tab}
				{@const isActive = currentTab === tab.id}
				{@const colorClasses = tabColors[tab.color]}
				<button
					on:click={() => currentTab = tab.id}
					class="flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 font-medium transition-all gap-1 {isActive ? colorClasses.active : colorClasses.inactive}"
				>
					<span class="text-2xl">{tab.icon}</span>
					<span class="text-xs leading-tight text-center">{uiTranslation.ui?.[`tab${tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}`] || tab.id}</span>
				</button>
			{/each}
		</div>
		
		<!-- Card content -->
		<div class="bg-white rounded-2xl shadow-xl border-2 p-6 flex flex-col flex-1 {cardBorder[currentTab]}">
			<AllergyCard type={currentTab} {selectedAllergies} translation={cardTranslation} />
		</div>
		
		<!-- Bottom bar -->
		<div class="bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
			
			<!-- Profile selector -->
			<div class="relative flex-1">
				<button
					on:click|stopPropagation={() => { profileDropdownOpen = !profileDropdownOpen; langDropdownOpen = false; }}
					class="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
				>
					<svg class="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2"/>
						<circle cx="12" cy="7" r="4" stroke-width="2"/>
					</svg>
					<span class="font-semibold text-gray-800 text-sm truncate flex-1">{activeProfile?.name || '—'}</span>
					<svg class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform {profileDropdownOpen ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<polyline points="6 9 12 15 18 9" stroke-width="2"/>
					</svg>
				</button>
				{#if profileDropdownOpen}
					<div class="absolute bottom-full left-0 mb-1 bg-white rounded-xl shadow-xl border border-gray-200 w-full z-10 overflow-hidden">
						{#each $profiles as profile}
							<button
								on:click|stopPropagation={() => { $activeProfileId = profile.id; profileDropdownOpen = false; }}
								class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left {$activeProfileId === profile.id ? 'bg-blue-50' : ''}"
							>
								<svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2"/>
									<circle cx="12" cy="7" r="4" stroke-width="2"/>
								</svg>
								<span class="text-sm font-medium text-gray-800">{profile.name}</span>
								<span class="ml-auto text-base">{profile.allergies.map(id => allergyIcons[id]).join('')}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
			
			<div class="w-px h-8 bg-gray-200 flex-shrink-0" />
			
			<!-- Language selector -->
			<div class="relative">
				<button
					on:click|stopPropagation={() => { langDropdownOpen = !langDropdownOpen; profileDropdownOpen = false; }}
					class="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
				>
					<span class="text-xl">{languagesData.languages[$activeCardLanguage]?.flag || '🏳️'}</span>
					<svg class="w-4 h-4 text-gray-400 transition-transform {langDropdownOpen ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<polyline points="6 9 12 15 18 9" stroke-width="2"/>
					</svg>
				</button>
				{#if langDropdownOpen}
					<div class="absolute bottom-full right-0 mb-1 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden min-w-max">
						{#each $cardLanguageShortlist as lang}
							<button
								on:click|stopPropagation={() => { $activeCardLanguage = lang; langDropdownOpen = false; }}
								class="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left {$activeCardLanguage === lang ? 'bg-green-50' : ''}"
							>
								<span class="text-xl">{languagesData.languages[lang].flag}</span>
								<span class="text-sm font-medium text-gray-800">{languagesData.languages[lang].name}</span>
								{#if $activeCardLanguage === lang}
									<svg class="w-4 h-4 text-green-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
										<polyline points="20 6 9 17 4 12" stroke-width="2"/>
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		
		<div class="text-center text-gray-400">
			<p class="text-xs">{uiTranslation.ui?.footerInstructions || 'Show this screen to communicate your allergies'}</p>
		</div>
	</div>
</div>
