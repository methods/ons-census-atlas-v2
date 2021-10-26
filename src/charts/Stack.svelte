<script>
	import { getContext } from 'svelte';

	const { xGet, xScale, yRange } = getContext('LayerCake');
	
	export let ticks;
	export let colors = ["#d5f690", "#5bc4b1", "#2e9daa", "#0079a2", "#005583"];
	export let maskId = null;
	export let muted = false;
	
</script>

{#if false}
<g class="stack-background">
	{#each ticks.slice(0, -1) as tick, i}
		<rect
			class='group-rect'
			data-id="{i}"
			x="{$xScale(tick)}"
			y="{$yRange[1]}"
			width="{$xScale(ticks[i + 1]) - $xScale(tick)}"
			height="{$yRange[0]}"
			fill="{colors[i]}"
			opacity="0.3"
		/>
	{/each}
</g>
{/if}
<g class="stack-masked" mask="{maskId ? `url(#${maskId})` : ''}">
	{#each ticks.slice(0, -1) as tick, i}
		<rect
			class='group-rect'
			x="{$xScale(tick)}"
			y="{$yRange[1]}"
			width="{$xScale(ticks[i + 1]) - $xScale(tick)}"
			height="{$yRange[0]}"
			fill="{muted ? '#ccc' : colors[i]}"
		/>
	{/each}
</g>