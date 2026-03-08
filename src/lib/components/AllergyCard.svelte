<script>
	import allergiesData from '$lib/data/allergies.json';
	
	export let type = 'info'; // 'info' | 'dining' | 'pharmacy' | 'emergency'
	export let selectedAllergies = []; // Array of allergy IDs
	export let translation = {}; // Translation object for current card language
	
	const allergyIcons = Object.fromEntries(
		allergiesData.allergies.map(a => [a.id, a.icon])
	);
	
	$: allergyNameList = selectedAllergies.map(id => translation.allergies?.[id] || id).join(', ');
</script>

<div class="card-content" class:info={type === 'info'} class:dining={type === 'dining'} 
     class:pharmacy={type === 'pharmacy'} class:emergency={type === 'emergency'}>
	
	{#if type === 'info'}
		<div class="allergy-grid">
			{#each selectedAllergies as allergyId}
				<div class="allergy-item">
					<span class="allergy-icon" role="img" aria-label={translation.allergies?.[allergyId]}>
						{allergyIcons[allergyId]}
					</span>
					<span class="allergy-name">{translation.allergies?.[allergyId]}</span>
				</div>
			{/each}
		</div>
		<div class="warning-banner">
			<span class="warning-icon">⚠️</span>
			<span class="warning-text">{translation.phrases?.allergicTo || 'Allergic to'}</span>
		</div>
	{/if}
	
	{#if type === 'dining'}
		<div class="card-box blue">
			<p class="card-label">{translation.phrases?.allergicTo || 'I am allergic to'}</p>
			<p class="card-value">{allergyNameList}</p>
		</div>
		<div class="card-box amber">
			<p class="card-label">{translation.phrases?.contains || 'Does this contain'}</p>
			<p class="card-value">{allergyNameList}?</p>
		</div>
	{/if}
	
	{#if type === 'pharmacy'}
		<div class="card-box green">
			<span class="pharmacy-icon">💊</span>
			<p class="pharmacy-title">{translation.phrases?.epipen || 'I need my EpiPen'}</p>
			<p class="pharmacy-subtitle">{translation.phrases?.allergicTo || 'I am allergic to'}:</p>
			<p class="pharmacy-allergies">{allergyNameList}</p>
		</div>
	{/if}
	
	{#if type === 'emergency'}
		<div class="emergency-main">
			<svg class="emergency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<circle cx="12" cy="12" r="10" stroke-width="2"/>
				<line x1="12" y1="8" x2="12" y2="12" stroke-width="2"/>
				<line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"/>
			</svg>
			<p class="emergency-text">{translation.phrases?.emergency || 'EMERGENCY'}</p>
			<p class="emergency-allergies">{allergyNameList}</p>
		</div>
		<div class="card-box orange">
			<svg class="phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke-width="2"/>
			</svg>
			<p class="ambulance-text">{translation.phrases?.callAmbulance || 'Please call an ambulance'}</p>
		</div>
		<div class="card-box red-light">
			<p class="anaphylaxis-text">{translation.phrases?.anaphylaxis || 'Anaphylactic shock'}</p>
		</div>
	{/if}
</div>

<style>
	.card-content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	
	.allergy-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		padding: 0.5rem 0;
	}
	
	.allergy-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}
	
	.allergy-icon {
		font-size: 3.75rem;
		line-height: 1;
	}
	
	.allergy-name {
		font-size: 1.125rem;
		font-weight: 700;
		color: #1f2937;
		text-align: center;
	}
	
	.warning-banner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding-top: 0.5rem;
	}
	
	.warning-icon {
		font-size: 1.875rem;
	}
	
	.warning-text {
		font-size: 1.25rem;
		font-weight: 700;
		color: #dc2626;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.card-box {
		border-radius: 0.75rem;
		padding: 1.25rem;
		text-align: center;
		border: 2px solid;
	}
	
	.card-box.blue {
		background-color: #eff6ff;
		border-color: #bfdbfe;
	}
	
	.card-box.amber {
		background-color: #fffbeb;
		border-color: #fde68a;
	}
	
	.card-box.green {
		background-color: #f0fdf4;
		border-color: #86efac;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.card-box.orange {
		background-color: #fff7ed;
		border-color: #fed7aa;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.card-box.red-light {
		background-color: #fef2f2;
		border-color: #fecaca;
	}
	
	.card-label {
		font-size: 1.5rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.75rem;
	}
	
	.card-value {
		font-size: 1.875rem;
		font-weight: 700;
		color: #dc2626;
	}
	
	.pharmacy-icon {
		font-size: 3rem;
	}
	
	.pharmacy-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}
	
	.pharmacy-subtitle {
		font-size: 1.25rem;
		color: #4b5563;
	}
	
	.pharmacy-allergies {
		font-size: 1.5rem;
		font-weight: 700;
		color: #dc2626;
	}
	
	.emergency-main {
		background-color: #fee2e2;
		border: 4px solid #dc2626;
		border-radius: 0.75rem;
		padding: 1.5rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.emergency-icon {
		width: 3.5rem;
		height: 3.5rem;
		color: #dc2626;
		margin: 0 auto;
	}
	
	.emergency-text {
		font-size: 1.5rem;
		font-weight: 800;
		color: #b91c1c;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.emergency-allergies {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1f2937;
	}
	
	.phone-icon {
		width: 2.5rem;
		height: 2.5rem;
		color: #ea580c;
		margin: 0 auto;
	}
	
	.ambulance-text {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1f2937;
	}
	
	.anaphylaxis-text {
		font-size: 1.125rem;
		font-weight: 600;
		color: #374151;
	}
</style>
