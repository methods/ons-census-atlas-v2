<script>
	import { getContext } from 'svelte';

	const { data, yRange, xScale, yScale, yDomain } = getContext('LayerCake');
	
  export let breaks;
  export let values = null;
	export let maskId = null;
	export let selected = null;
	export let parent = null;
	export let avg = null;
	export let key = 'perc';
	export let colors = ["#d5f690", "#5bc4b1", "#2e9daa", "#0079a2", "#005583"];
	
	$: min = $yDomain[0];
	$: max = $yDomain[1];
	
	function getColor(d) {
		let color;
		let i = 0;
		while (i < breaks.length) {
			if (d < breaks[i]) {
				color = colors[i];
				break;
			}
			i ++;
		}
		return color;
	}
</script>

{#if values}
<g class="markers-group" mask="{maskId ? `url(#${maskId})` : ''}">
	{#each values as d}
  <line
    data-id="marker-{d.code}"
		x1="{$xScale(d[key])}"
		x2="{$xScale(d[key])}"
		y1="{$yScale(max)}"
		y2="{$yScale(min)}"
		stroke="{getColor(d[key])}"
		stroke-width="1"
		stroke-linecap="butt"
	/>
	{/each}
</g>
{/if}


<g class="markers-active">
  {#if avg}
  <line
    data-id="marker-mean"
		x1="{$xScale(avg[key])}"
		x2="{$xScale(avg[key])}"
		y1="{$yScale(max)}"
		y2="{$yScale(min)}"
		stroke="#871A5B"
		stroke-width="2"
		stroke-linecap="butt"
  />
	{/if}
	{#if parent}
  <line
    data-id="marker-parent"
		x1="{$xScale(parent[key])}"
		x2="{$xScale(parent[key])}"
		y1="{$yScale(max)}"
		y2="{$yScale(min)}"
		stroke="#27A0CC"
		stroke-width="2"
		stroke-linecap="butt"
  />
	{/if}
	{#if selected}
  <line
    data-id="marker-selected"
		x1="{$xScale(selected[key])}"
		x2="{$xScale(selected[key])}"
		y1="{$yScale(max)}"
		y2="{$yScale(min)}"
		stroke="#000000"
		stroke-width="2"
		stroke-linecap="butt"
  />
  {/if}
</g>