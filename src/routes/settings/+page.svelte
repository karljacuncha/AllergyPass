<script>
	import { goto } from '$app/navigation';
	import { interfaceLanguage, cardLanguageShortlist, profiles, activeProfileId } from '$lib/stores/settings';
	import allergiesData from '$lib/data/allergies.json';
	import languagesData from '$lib/data/languages.json';
	
	// Dynamic imports for translations
	let translations = {};
	let t = {};
	
	$: if ($interfaceLanguage) {
		import(`$lib/data/translations/${$interfaceLanguage}.json`).then(module => {
			translations = module.default;
			t = translations;
		});
	}
	
	const allergyList = allergiesData.allergies;
	const allLanguages = Object.keys(languagesData.languages);
	
	let editingProfile = null;
	
	function startNewProfile() {
		editingProfile = { id: null, name: '', allergies: [] };
	}
	
	function startEditProfile(profile) {
		editingProfile = { ...profile };
	}
	
	function saveProfile() {
		if (!editingProfile.name.trim() || editingProfile.allergies.length === 0) return;
		
		if (editingProfile.id) {
			$profiles = $profiles.map(p => p.id === editingProfile.id ? editingProfile : p);
		} else {
			const newProfile = { ...editingProfile, id: Date.now().toString() };
			$profiles = [...$profiles, newProfile];
			$activeProfileId = newProfile.id;
		}
		editingProfile = null;
	}
	
	function deleteProfile(id) {
		// TODO: Replace with inline confirmation UI
		if (!confirm(t.ui?.confirmDelete || 'Delete this profile?')) return;
		
		$profiles = $profiles.filter(p => p.id !== id);
		if ($activeProfileId === id) {
			$activeProfileId = $profiles[0]?.id || null;
		}
	}
	
	function toggleEditAllergy(allergyId) {
		if (editingProfile.allergies.includes(allergyId)) {
			editingProfile.allergies = editingProfile.allergies.filter(a => a !== allergyId);
		} else {
			editingProfile.allergies = [...editingProfile.allergies, allergyId];
		}
	}
	
	function toggleShortlistLang(lang) {
		if (lang === $interfaceLanguage) return;
		
		if ($cardLanguageShortlist.includes(lang)) {
			const updated = $cardLanguageShortlist.filter(l => l !== lang);
			if (updated.length === 0) return;
			$cardLanguageShortlist = updated;
		} else {
			$cardLanguageShortlist = [...$cardLanguageShortlist, lang];
		}
	}
</script>

<svelte:head>
	<title>{t.ui?.settings || 'Settings'} - {t.ui?.appTitle || 'AllergyPass'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<div class="max-w-2xl mx-auto p-4 flex flex-col gap-4">
		
		<!-- Header -->
		<div class="flex items-center justify-between pt-2">
			<h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
				<svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<circle cx="12" cy="12" r="10" stroke-width="2"/>
					<line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
					<line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
				</svg>
				{t.ui?.appTitle || 'AllergyPass'}
			</h1>
			{#if $profiles.length > 0}
				<button on:click={() => goto('/cards')} class="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors text-sm">
					{t.ui?.showCards || 'Show Cards'}
				</button>
			{/if}
		</div>
		
		<!-- Interface Language -->
		<div class="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
			<h2 class="font-bold text-gray-700 text-sm uppercase tracking-wide">{t.ui?.interfaceLanguage || 'Interface Language'}</h2>
			<select bind:value={$interfaceLanguage} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 bg-white">
				{#each allLanguages as lang}
					<option value={lang}>{languagesData.languages[lang].flag}  {languagesData.languages[lang].name}</option>
				{/each}
			</select>
		</div>
		
		<!-- Card Language Shortlist -->
		<div class="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
			<h2 class="font-bold text-gray-700 text-sm uppercase tracking-wide">{t.ui?.cardLanguages || 'Card Languages'}</h2>
			<div class="grid grid-cols-2 gap-2">
				{#each allLanguages as lang}
					{@const isSelected = $cardLanguageShortlist.includes(lang)}
					{@const isInterface = lang === $interfaceLanguage}
					<button
						on:click={() => toggleShortlistLang(lang)}
						disabled={isInterface}
						class="flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium"
						class:border-green-500={isSelected}
						class:bg-green-50={isSelected}
						class:border-gray-200={!isSelected}
						class:hover:border-gray-300={!isSelected && !isInterface}
						class:opacity-50={isInterface}
						class:cursor-not-allowed={isInterface}
						title={isInterface ? t.ui?.interfaceLanguage : ''}
					>
						<span class="text-xl">{languagesData.languages[lang].flag}</span>
						<span class="text-gray-800">{languagesData.languages[lang].name}</span>
						{#if isSelected}
							<svg class="w-4 h-4 text-green-500 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<polyline points="20 6 9 17 4 12" stroke-width="2"/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Profiles -->
		<div class="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<h2 class="font-bold text-gray-700 text-sm uppercase tracking-wide">{t.ui?.profiles || 'Profiles'}</h2>
				<button on:click={startNewProfile} class="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<line x1="12" y1="5" x2="12" y2="19" stroke-width="2"/>
						<line x1="5" y1="12" x2="19" y2="12" stroke-width="2"/>
					</svg>
					{t.ui?.addProfile || 'Add'}
				</button>
			</div>
			
			{#if $profiles.length === 0}
				<p class="text-gray-500 text-sm text-center py-4">{t.ui?.noProfiles || 'No profiles yet'}</p>
			{:else}
				<div class="flex flex-col gap-2">
					{#each $profiles as profile}
						{@const isActive = $activeProfileId === profile.id}
						<div class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all" class:border-blue-500={isActive} class:bg-blue-50={isActive} class:border-gray-200={!isActive}>
							<button on:click={() => $activeProfileId = profile.id} class="flex items-center gap-3 flex-1 text-left">
								<svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2"/>
									<circle cx="12" cy="7" r="4" stroke-width="2"/>
								</svg>
								<div>
									<p class="font-semibold text-gray-800">{profile.name}</p>
									<p class="text-xs text-gray-500">
										{#each profile.allergies as allergyId}
											{allergyList.find(a => a.id === allergyId)?.icon || ''}
										{/each}
									</p>
								</div>
							</button>
							<button on:click={() => startEditProfile(profile)} class="p-2 rounded-lg hover:bg-gray-200 text-gray-500">
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2"/>
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2"/>
								</svg>
							</button>
							<button on:click={() => deleteProfile(profile.id)} class="p-2 rounded-lg hover:bg-red-100 text-red-400">
								<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<polyline points="3 6 5 6 21 6" stroke-width="2"/>
									<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke-width="2"/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		
		{#if $profiles.length > 0}
			<button on:click={() => goto('/cards')} class="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg">
				{t.ui?.showCards || 'Show Cards'}
			</button>
		{/if}
	</div>
</div>

<!-- Profile Editor Modal -->
{#if editingProfile}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-800">
					{editingProfile.id ? t.ui?.editProfile : t.ui?.addProfile}
				</h2>
				<button on:click={() => editingProfile = null} class="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<line x1="18" y1="6" x2="6" y2="18" stroke-width="2"/>
						<line x1="6" y1="6" x2="18" y2="18" stroke-width="2"/>
					</svg>
				</button>
			</div>
			
			<!-- Name input -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">{t.ui?.profileName || 'Name'}</label>
				<input
					type="text"
					bind:value={editingProfile.name}
					class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
					placeholder={t.ui?.profileName || 'Name'}
					maxlength="30"
				/>
			</div>
			
			<!-- Allergies -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">{t.ui?.allergies || 'Allergies'}</label>
				<div class="grid grid-cols-2 gap-2">
					{#each allergyList as allergy}
						{@const isSelected = editingProfile.allergies.includes(allergy.id)}
						<button
							on:click={() => toggleEditAllergy(allergy.id)}
							class="p-3 rounded-xl border-2 transition-all flex items-center gap-3"
							class:border-red-500={isSelected}
							class:bg-red-50={isSelected}
							class:border-gray-200={!isSelected}
							class:hover:border-gray-300={!isSelected}
						>
							<span class="text-2xl">{allergy.icon}</span>
							<span class="font-medium text-gray-800 text-sm">{t.allergies?.[allergy.id] || allergy.id}</span>
						</button>
					{/each}
				</div>
				{#if editingProfile.allergies.length === 0}
					<p class="text-sm text-red-500 mt-2">{t.ui?.selectAtLeastOne || 'Select at least one'}</p>
				{/if}
			</div>
			
			<!-- Actions -->
			<div class="flex gap-3">
				<button on:click={() => editingProfile = null} class="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
					{t.ui?.cancel || 'Cancel'}
				</button>
				<button
					on:click={saveProfile}
					disabled={!editingProfile.name.trim() || editingProfile.allergies.length === 0}
					class="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{t.ui?.save || 'Save'}
				</button>
			</div>
		</div>
	</div>
{/if}
