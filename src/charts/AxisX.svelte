<script>
	import { getContext } from 'svelte';

	const { width, height, xScale, yScale, yRange } = getContext('LayerCake');

	export let gridlines = true;
	export let formatTick = d => d;
	export let baseline = false;
	export let snapTicks = false;
	export let ticks = undefined;
	export let xTick = undefined;
	export let yTick = 16;
	export let dxTick = 0;
	export let dyTick = 0;
	export let suffix = '%';

	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks) ? ticks :
		isBandwidth ?
			$xScale.domain() :
			$xScale.ticks(ticks);

	function textAnchor(i) {
		let align = 'middle';
		let offset = 0;
		if (snapTicks === true) {
			if (i === 0) {
				align = 'start';
				offset = -2.5;
			}
			if (i === tickVals.length - 1) {
				align = 'end';
				offset = 2.5;
			}
		}
		return {
			align: align,
			offset: offset
		}
	}
</script>

<g class='axis x-axis'>
	{#each tickVals as tick, i}
		<g class='tick tick-{ tick }' transform='translate({$xScale(tick)},{$yRange[0]})'>
			{#if gridlines !== false}
				<line y1='0' y2='{dyTick + 5}' x1='0' x2='0'></line>
			{/if}
			<text
				x="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0 }"
				y='{yTick}'
				dx='{dxTick + textAnchor(i).offset}'
				dy='{dyTick}'
				text-anchor='{textAnchor(i).align}'>{formatTick(tick)}{textAnchor(i).align == 'end' ? suffix : ''}</text>
		</g>
	{/each}
	{#if baseline === true}
		<line class="baseline" y1='{$height + 0.5}' y2='{$height + 0.5}' x1='0' x2='{$width}'></line>
	{/if}
</g>

<style>
	.tick {
		font-size: .725em;
	}

	line,
	.tick line {
		stroke: #555;
	}

	.tick text {
		fill: #555;
	}

	.baseline {
		stroke-dasharray: 0;
	}
</style>
